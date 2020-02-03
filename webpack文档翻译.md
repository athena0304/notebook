## Plugin API

Plugins are a key piece of the webpack ecosystem and provide the community with a powerful way to tap into webpack's compilation process. A plugin is able to [hook](https://github.com/webpack/webpack.js.org/blob/73f1c7692e93c8f7d8584ae67eb8d29a1abec7bb/api/compiler-hooks/#hooks) into key events that are fired throughout each compilation. Every step of the way, the plugin will have full access to the `compiler` and, when applicable, the current `compilation`.

插件是webpack生态系统里重要的环节，它为社区提供了一个很强大的方式方法，可以深入webpack 的编译过程。插件可以 hook 进入关键事件，这些事件在每次编译的过程里都会被触发。插件可以在每一步都能完全访问 `compiler` ，以及在合适的实际访问当前的 `compilation`。

T> For a high-level introduction to writing plugins, start with [writing a plugin](https://github.com/webpack/webpack.js.org/blob/73f1c7692e93c8f7d8584ae67eb8d29a1abec7bb/contribute/writing-a-plugin).

Let's start by going over `tapable` utility, which provides the backbone of webpack's plugin interface.

## Tapable

This small library is a core utility in webpack but can also be used elsewhere to provide a similar plugin interface. Many objects in webpack extend the `Tapable` class. The class exposes `tap`, `tapAsync`, and `tapPromise` methods which plugins can use to inject custom build steps that will be fired throughout a compilation.

Please see the [documentation](https://github.com/webpack/tapable) to learn more. An understanding of the three `tap` methods, as well as the hooks that provide them is crucial. The objects that extend `Tapable` (e.g. the compiler), the hooks they provide, and each hook's type (e.g. the `SyncHook`) will be noted.

Tapable是一个很小的库，却是webpack中最核心的实例，而且可以适用于其他场景，只要是用来提供类似的插件接口即可。webpack中的很多对象是继承自类 `Tapable` 。这个类暴露出了 `tap`, `tapAsync`, 和 `tapPromise` 方法，这样插件就可以利用他们注入自定义构建步骤，这些步骤会在编译（compilation）过程中被触发。

## Plugin Types 插件类型

Depending on the hooks used and `tap` methods applied, plugins can function in a different number of ways. The way this works is closely related to the [hooks](https://github.com/webpack/tapable#tapable) provided by `Tapable`. The [compiler hooks](https://github.com/webpack/webpack.js.org/blob/73f1c7692e93c8f7d8584ae67eb8d29a1abec7bb/api/compiler-hooks/#hooks) each note the underlying `Tapable` hook indicating which `tap` methods are available.

依赖于hook的使用和 `tap` 方法的应用，插件可以有不同的作用。这种作用方式与 `Tapable`  提供的钩子密切相关。

So depending on which event you `tap` into, the plugin may run differently. For example, when hooking into the `compile` stage, only the synchronous `tap` method can be used:

所以不同的tap事件，插件也会随之表现的不同。例如，当在 `compile` 阶段hook的时候，只有同步（synchronous）的 `tap` 方法可以使用：

```js
compiler.hooks.compile.tap('MyPlugin', params => {
  console.log('Synchronously tapping the compile hook.');
});
```

However, for `run` which utilizes the `AsyncHook`, we can utilize `tapAsync` or `tapPromise` (as well as `tap`):

此外，由于 `run` 利用  `AsyncHook`,，我们可以利用除了  `tap` 以外的  `tapAsync` 或者 `tapPromise` ：

```js
compiler.hooks.run.tapAsync('MyPlugin', (source, target, routesList, callback) => {
  console.log('Asynchronously tapping the run hook.');
  callback();
});

compiler.hooks.run.tapPromise('MyPlugin', (source, target, routesList) => {
  return new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
    console.log('Asynchronously tapping the run hook with a delay.');
  });
});

compiler.hooks.run.tapPromise('MyPlugin', async (source, target, routesList) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Asynchronously tapping the run hook with a delay.');
});
```

The moral of the story is that there are a variety of ways to `hook` into the `compiler`, each one allowing your plugin to run as it sees fit.

总结下来就是说有很多种hook进compiler的方式，每一种方法都允许你的插件按照合适的方式运行。

## Custom Hooks 自定义钩子

In order to add a new hook to the compilation for other plugins to `tap` into, simply `require` the necessary hook class from `tapable` and create one:

为了添加一个新的钩子到 compilation ，让其他插件可以 tap 进来，只需要从 `tapable`  `require` 对应的钩子 class 然后创建：

```js
const SyncHook = require('tapable').SyncHook;

// Within the `apply` method...
if (compiler.hooks.myCustomHook) throw new Error('Already in use');
compiler.hooks.myCustomHook = new SyncHook(['a', 'b', 'c']);

// Wherever/whenever you'd like to trigger the hook...
compiler.hooks.myCustomHook.call(a, b, c);
```

Again, see the [documentation](https://github.com/webpack/tapable) for `tapable` to learn more about the different hook classes and how they work.

可以查看  `tapable` 的[文档](https://github.com/webpack/tapable)，了解更多钩子类之间的不同，以及他们的原理。

## Reporting Progress报告进度

Plugins can report progress via [`ProgressPlugin`](https://github.com/webpack/webpack.js.org/blob/73f1c7692e93c8f7d8584ae67eb8d29a1abec7bb/plugins/progress-plugin), which prints progress messages to stderr by default. In order to enable progress reporting, pass a `--progress` argument when running the [webpack CLI](https://github.com/webpack/webpack.js.org/blob/73f1c7692e93c8f7d8584ae67eb8d29a1abec7bb/api/cli).

插件可以通过 [`ProgressPlugin`](https://github.com/webpack/webpack.js.org/blob/73f1c7692e93c8f7d8584ae67eb8d29a1abec7bb/plugins/progress-plugin) 报告进度（progress），可以默认将错误打印到stderr。想要开启进度报告，在运行 [webpack CLI](https://github.com/webpack/webpack.js.org/blob/73f1c7692e93c8f7d8584ae67eb8d29a1abec7bb/api/cli) 的时候传递  `--progress` 参数即可。

It is possible to customize the printed output by passing different arguments to the `reportProgress` function of [`ProgressPlugin`](https://github.com/webpack/webpack.js.org/blob/73f1c7692e93c8f7d8584ae67eb8d29a1abec7bb/plugins/progress-plugin).

通过传递不同的参数到 [`ProgressPlugin`](https://github.com/webpack/webpack.js.org/blob/73f1c7692e93c8f7d8584ae67eb8d29a1abec7bb/plugins/progress-plugin) 的 `reportProgress` 方法，可以自定义打印的输出。

To report progress, a plugin must `tap` into a hook using the `context: true` option:

为了报告进度，插件必须传递option  `context: true`  `tap` 进一个钩子：

```js
compiler.hooks.emit.tapAsync({
  name: 'MyPlugin',
  context: true
}, (context, compiler, callback) => {
  const reportProgress = context && context.reportProgress;
  if (reportProgress) reportProgress(0.95, 'Starting work');
  setTimeout(() => {
    if (reportProgress) reportProgress(0.95, 'Done work');
    callback();
  }, 1000);
});
```

The `reportProgress` function may be called with these arguments:

 `reportProgress` 方法可能会被这些参数调用：

```
reportProgress(percentage, ...args);
```

- `percentage`: This argument is unused; instead, [`ProgressPlugin`](https://github.com/webpack/webpack.js.org/blob/73f1c7692e93c8f7d8584ae67eb8d29a1abec7bb/plugins/progress-plugin) will calculate a percentage based on the current hook.
- `percentage`: 
- `...args`: Any number of strings, which will be passed to the `ProgressPlugin` handler to be reported to the user.
- `...args`: 任意数量的字符串，可以通过  `ProgressPlugin` 的传递报告给用户。

Note that only a subset of compiler and compilation hooks support the `reportProgress` function. See [`ProgressPlugin`](https://github.com/webpack/webpack.js.org/blob/73f1c7692e93c8f7d8584ae67eb8d29a1abec7bb/plugins/progress-plugin/#supported-hooks) for a full list.

## Logging

Logging API is available since the release of webpack 4.37. When `logging` is enabled in [`stats configuration`](https://github.com/webpack/webpack.js.org/blob/73f1c7692e93c8f7d8584ae67eb8d29a1abec7bb/configuration/stats/#statslogging) and/or when [`infrastructure logging`](https://github.com/webpack/webpack.js.org/blob/73f1c7692e93c8f7d8584ae67eb8d29a1abec7bb/configuration/other-options/#infrastructurelogging) is enabled, plugins may log messages which will be printed out in the respective logger format (stats, infrastructure).

- Plugins should prefer to use `compilation.getLogger('PluginName')` for logging. This kind of logging is stored to the Stats and formatted accordingly. It can be filtered and exported by the user.
- Plugins may use the `compiler.getInfrastructureLogger('PluginName')` for logging. Using `infrastructure` logging is not stored in the Stats and therefore not formatted. It's usually logged to the console/dashboard/GUI directly. It can be filtered by the user.
- Plugins may use special fallback logic for detecting logging support `compilation.getLogger ? compilation.getLogger('PluginName') : console` to provide a fallback for cases when an older webpack version is used which does not support `getLogger` method on `compilation` object.

## Next Steps

See the [compiler hooks](https://github.com/webpack/webpack.js.org/blob/73f1c7692e93c8f7d8584ae67eb8d29a1abec7bb/api/compiler-hooks) section for a detailed listing of all the available `compiler` hooks and the parameters they make available.