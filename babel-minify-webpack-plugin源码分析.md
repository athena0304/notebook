# babel-minify-webpack-plugin 源码分析

先看都引用了哪些模块

```js
import { transform } from 'babel-core';
import babelPresetMinify from 'babel-preset-minify';
import { SourceMapSource, RawSource } from 'webpack-sources';
import ModuleFilenameHelpers from 'webpack/lib/ModuleFilenameHelpers';
```

- 从 babel-core 引入了 transform 模块，这个模块是babel核心转译的模块。

- babel-preset-minify 是 Babel 关于所有 minify 插件的预设。具体文件可以查看[这里](https://github.com/babel/minify/blob/master/packages/babel-preset-minify/src/index.js)。
- [webpack-sources](https://github.com/webpack/webpack-sources) Contains multiple classes which represent a `Source`. A `Source` can be asked for source code, size, source map and hash.

- ModuleFilenameHelpers

首先看下这个插件默认 export 的是什么：

```js
export default class BabelMinifyPlugin {
  constructor(minifyOpts = {}, pluginOpts = {}) {
    this.plugin = { name: 'BabelMinifyPlugin' };

    this.options = {
      parserOpts: pluginOpts.parserOpts || {},
      minifyPreset: pluginOpts.minifyPreset || babelPresetMinify,
      minifyOpts,
      babel: pluginOpts.babel || { transform },
      comments: getDefault(pluginOpts.comments, /^\**!|@preserve|@license|@cc_on/),
      // compiler.options.devtool overrides options.sourceMap if NOT set
      // so we set it to void 0 as the default value
      sourceMap: getDefault(pluginOpts.sourceMap, void 0),
      test: pluginOpts.test || /\.js($|\?)/i,
      include: pluginOpts.include || void 0,
      exclude: pluginOpts.exclude || void 0,
    };
  }

  apply(compiler) {
    const { options } = this;
    // if sourcemap is not set
    options.sourceMap = getDefault(options.sourceMap, !!compiler.options.devtool);

    if (compiler.hooks) {
      const { compilation } = compiler.hooks;

      compilation.tap(this.plugin, compilationFn.bind(this));
    } else {
      compiler.plugin('compilation', compilationFn.bind(this));
    }
  }
}
```

在构造函数中，首先定义了plugin，添加了name属性，定义了 options，为后面babel编译定义选项，其中做了一些默认值的赋值，例如 minifyPreset 默认是 babelPresetMinify，babel 默认是 transform，这两个都是从外部引入的，作为初始选项。

而 apply 方法是插件的默认注册方法，会在插件注册时调用，首先先赋值了 options 的 sourceMap，如果没有自定义的 sourceMap 选项，就会应用 compiler.options.devtool。这里插播一个小知识点，这里会用 `void 0` 来代替 `undefined`，[有篇文章可以详细了解一下](https://github.com/lessfish/underscore-analysis/issues/1)。

如果 `compiler` 有 `hooks`，找到 `compiler` 下面的` compilation` 钩子，通过 `tap` 注册进监听事件，回调函数是 `compilationFn`：

```js
function compilationFn(compilation) {
  const { options, plugin } = this;

  if (compilation.hooks) {
    if (options.sourceMap) {
      compilation.hooks
        .buildModule
        .tap(plugin, (module) => { module.useSourceMap = true; });
    }

    compilation.hooks
      .optimizeChunkAssets
      .tapAsync(plugin, (chunks, callback) => {
        optimizeChunkAssets(compilation, options, chunks);
        callback();
      });
  } else {
    if (options.sourceMap) {
      compilation.plugin('build-module', (module) => {
        module.useSourceMap = true;
      });
    }

    compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
      optimizeChunkAssets(compilation, options, chunks);
      callback();
    });
  }
}
```

 这里先判断 `options` 是否有 `sourceMap`，如果有的话，就在 `buildModule` 的时候注册监听事件，回调函数是将 `module.useSourceMap` 置为 `true`。

接着在 `optimizeChunkAssets` 阶段通过 `tapAsync` 注册监听事件，回调函数中调用了 `optimizeChunkAssets` 函数：

```js
function optimizeChunkAssets(compilation, options, chunks) {
  chunks.reduce((acc, chunk) => acc.concat(chunk.files || []), [])
    .concat(compilation.additionalChunkAssets || [])
    .filter(ModuleFilenameHelpers.matchObject.bind(null, options))
    .forEach((file) => {
      try {
        const asset = compilation.assets[file];

        if (asset.__babelminified) {
          compilation.assets[file] = asset.__babelminified;
          return;
        }

        let input;
        let inputSourceMap;

        if (options.sourceMap) {
          if (asset.sourceAndMap) {
            const sourceAndMap = asset.sourceAndMap();
            inputSourceMap = sourceAndMap.map;
            input = sourceAndMap.source;
          } else {
            inputSourceMap = asset.map();
            input = asset.source();
          }
        } else {
          input = asset.source();
        }

        // do the transformation
        const result = options.babel.transform(input, {
          parserOpts: options.parserOpts,
          presets: [[options.minifyPreset, options.minifyOpts]],
          sourceMaps: options.sourceMap,
          babelrc: false,
          inputSourceMap,
          shouldPrintComment(contents) {
            return shouldPrintComment(contents, options.comments);
          },
        });

        asset.__babelminified = compilation.assets[file] = result.map
          ? new SourceMapSource(result.code, file, result.map, input, inputSourceMap)
          : new RawSource(result.code);
      } catch (e) {
        compilation.errors.push(e);
      }
    });
}
```

这时能拿到参数 `chunks`，是一个数组，首先把数组中每个 chunk 的 files 都合并到一个数组中，然后合并 `compilation.additionalChunkAssets` 里的文件，然后用到了一开始引用的 `ModuleFilenameHelpers`，如果在 `options` 中有 test、include和exclude，这里会过滤掉不符合要求的文件（这里可以通过 `ModuleFilenameHelpers` 详细查看），然后对每个文件做遍历：

- 先从 `compilation.assets` 里面找到该文件
- 如果已经有 __babelminified ，就此退出
- 处理 sourceMap 相关，确认 input 
- 使用 babel 的 transform 方法，进行编译，输出为 result
- 根据 result.map 的情况，将 result 赋值给 ` asset.__babelminified` 和 ` compilation.assets[file]` 最终的编译结果

这样后续的插件可以继续通过 `compilation.assets` 来获取文件，然后可以进行后续的工作。