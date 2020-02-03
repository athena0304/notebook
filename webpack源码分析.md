入口文件：

bin/webpack.js

```js
/** @type {CliOption} */
const cli = {
	name: "webpack-cli",
	package: "webpack-cli",
	binName: "webpack-cli",
	installed: isInstalled("webpack-cli"),
	url: "https://github.com/webpack/webpack-cli"
};  

const path = require("path");
const pkgPath = require.resolve(`${cli.package}/package.json`);
// eslint-disable-next-line node/no-missing-require
const pkg = require(pkgPath);
// eslint-disable-next-line node/no-missing-require
/* oxw:
	"bin": {
    "webpack-cli": "./bin/cli.js"
  },
 */
require(path.resolve(path.dirname(pkgPath), pkg.bin[cli.binName]));
```

可见require的是webpack-cli的`./bin/cli.js`文件



https://github.com/webpack/webpack-cli/blob/master/bin/cli.js

```js
// oxw: 省略其他代码
const webpack = require("webpack");

  let lastHash = null;
	let compiler;
	try {
		compiler = webpack(options);
	} catch (err) {
	  if (err.name === "WebpackOptionsValidationError") {
	    if (argv.color) console.error(`\u001b[1m\u001b[31m${err.message}\u001b[39m\u001b[22m`);
	    else console.error(err.message);
	    // eslint-disable-next-line no-process-exit
	    process.exit(1);
	  }

	  throw err;
  }
```

此处require的webpack找的是webpack包下面`package.json`的main中的`"lib/index.js"`

这个index文件导出了webpack整个的module，首先引入的是webpack的主体，来自`lib/webpack.js`，主要代码如下：

```js
/**
 * @param {WebpackOptions | WebpackOptions[]} options options object
 * @param {Callback<Stats | MultiStats>=} callback callback
 * @returns {Compiler | MultiCompiler} the compiler object
 */
const webpack = (options, callback) => {
	validateSchema(webpackOptionsSchema, options);
	/** @type {TODO} */
	let compiler;
	let watch = false;
	let watchOptions;
	if (Array.isArray(options)) {
		compiler = createMultiCompiler(options);
		watch = options.some(options => options.watch);
		watchOptions = options.map(options => options.watchOptions || {});
	} else {
		compiler = createCompiler(options);
		watch = options.watch;
		watchOptions = options.watchOptions || {};
	}
	if (callback) {
		if (watch) {
			compiler.watch(watchOptions, callback);
		} else {
			compiler.run((err, stats) => {
				compiler.close(err2 => {
					callback(err || err2, stats);
				});
			});
		}
	}
	return compiler;
};
```

可以看出来这是一个函数，return了一个`compiler`，compiler是通过`createCompiler`创建的：

```js
/**
 * @param {WebpackOptions} options options object
 * @returns {Compiler} a compiler
 */
const createCompiler = options => {
	options = new WebpackOptionsDefaulter().process(options);
	const compiler = new Compiler(options.context);
	compiler.options = options;
	new NodeEnvironmentPlugin({
		infrastructureLogging: options.infrastructureLogging
	}).apply(compiler);
	if (Array.isArray(options.plugins)) {
		for (const plugin of options.plugins) {
			if (typeof plugin === "function") {
				plugin.call(compiler, compiler);
			} else {
				plugin.apply(compiler);
			}
		}
	}
	compiler.hooks.environment.call();
	compiler.hooks.afterEnvironment.call();
	compiler.options = new WebpackOptionsApply().process(options, compiler);
	return compiler;
};
```

compiler是类Compiler初始化的，这里会重新赋值`compiler.options = new WebpackOptionsApply().process(options, compiler);`

在这里我们只摘取我们关心的代码：

```js
		new HarmonyModulesPlugin({
			module: options.module,
			topLevelAwait: options.experiments.topLevelAwait,
			importAwait: options.experiments.importAwait
		}).apply(compiler);
```

以及后面的：

```js
		if (options.optimization.removeAvailableModules) {
			const RemoveParentModulesPlugin = require("./optimize/RemoveParentModulesPlugin");
			new RemoveParentModulesPlugin().apply(compiler);
		}
		if (options.optimization.removeEmptyChunks) {
			const RemoveEmptyChunksPlugin = require("./optimize/RemoveEmptyChunksPlugin");
			new RemoveEmptyChunksPlugin().apply(compiler);
		}
		if (options.optimization.mergeDuplicateChunks) {
			const MergeDuplicateChunksPlugin = require("./optimize/MergeDuplicateChunksPlugin");
			new MergeDuplicateChunksPlugin().apply(compiler);
		}
		if (options.optimization.flagIncludedChunks) {
			const FlagIncludedChunksPlugin = require("./optimize/FlagIncludedChunksPlugin");
			new FlagIncludedChunksPlugin().apply(compiler);
		}
		if (options.optimization.sideEffects) {
			const SideEffectsFlagPlugin = require("./optimize/SideEffectsFlagPlugin");
			new SideEffectsFlagPlugin().apply(compiler);
		}
		if (options.optimization.providedExports) {
			const FlagDependencyExportsPlugin = require("./FlagDependencyExportsPlugin");
			new FlagDependencyExportsPlugin().apply(compiler);
		}
		if (options.optimization.usedExports) {
			const FlagDependencyUsagePlugin = require("./FlagDependencyUsagePlugin");
			new FlagDependencyUsagePlugin().apply(compiler);
		}
		if (options.optimization.innerGraph) {
			const InnerGraphPlugin = require("./optimize/InnerGraphPlugin");
			new InnerGraphPlugin().apply(compiler);
		}
		if (options.optimization.mangleExports) {
			const MangleExportsPlugin = require("./optimize/MangleExportsPlugin");
			new MangleExportsPlugin().apply(compiler);
		}
		if (options.optimization.concatenateModules) {
			const ModuleConcatenationPlugin = require("./optimize/ModuleConcatenationPlugin");
			new ModuleConcatenationPlugin().apply(compiler);
		}
		if (options.optimization.splitChunks) {
			const SplitChunksPlugin = require("./optimize/SplitChunksPlugin");
			new SplitChunksPlugin(options.optimization.splitChunks).apply(compiler);
		}
		if (options.optimization.runtimeChunk) {
			const RuntimeChunkPlugin = require("./optimize/RuntimeChunkPlugin");
			new RuntimeChunkPlugin(options.optimization.runtimeChunk).apply(compiler);
		}
		if (options.optimization.noEmitOnErrors) {
			const NoEmitOnErrorsPlugin = require("./NoEmitOnErrorsPlugin");
			new NoEmitOnErrorsPlugin().apply(compiler);
		}
		if (options.optimization.checkWasmTypes) {
			const WasmFinalizeExportsPlugin = require("./wasm/WasmFinalizeExportsPlugin");
			new WasmFinalizeExportsPlugin().apply(compiler);
		}

		if (options.optimization.minimize) {
			for (const minimizer of options.optimization.minimizer) {
				if (typeof minimizer === "function") {
					minimizer.call(compiler, compiler);
				} else {
					minimizer.apply(compiler);
				}
			}
		}

		if (options.performance) {
			const SizeLimitsPlugin = require("./performance/SizeLimitsPlugin");
			new SizeLimitsPlugin(options.performance).apply(compiler);
		}
```

这里所有的插件都进行了apply调用，也就是说监听了各种事件

<font color=#FF0000 >在这之后，初始化所有的 plugins，其中apply似乎是plugin中约定的用来注册订阅时间的函数，在这里把自己感兴趣的事件tap了，到时候谁call的时候，就能监听到，然后执行自己的回调函数即可。</font>

这里执行的hook都是tapable的SyncHook类的实例

最后会走到watch或者run方法里，这里执行了 compile 方法：

```js
/**
	 * @param {Callback<Compilation>} callback signals when the compilation finishes
	 * @returns {void}
	 */
	compile(callback) {
		const params = this.newCompilationParams();
		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err);

			this.hooks.compile.call(params);

			const compilation = this.newCompilation(params);

			const logger = compilation.getLogger("webpack.Compiler");

			logger.time("make hook");
			this.hooks.make.callAsync(compilation, err => {
				logger.timeEnd("make hook");
				if (err) return callback(err);

				process.nextTick(() => {
					logger.time("finish compilation");
					compilation.finish(err => {
						logger.timeEnd("finish compilation");
						if (err) return callback(err);

						logger.time("seal compilation");
						compilation.seal(err => {
							logger.timeEnd("seal compilation");
							if (err) return callback(err);

							logger.time("afterCompile hook");
							this.hooks.afterCompile.callAsync(compilation, err => {
								logger.timeEnd("afterCompile hook");
								if (err) return callback(err);

								return callback(null, compilation);
							});
						});
					});
				});
			});
		});
	}
```

这里`this.hooks.compile.call(params);` 这里call了complile事件，也就是说之前对这个事件订阅过的，都会触发。全局搜索`compile.tap`，就可以知道是谁订阅了compile事件，可以看到有三个插件订阅了该事件，分别是：`DelegatedPlugin`、 `DllReferencePlugin` 和 `ExternalsPlugin`



然后初始化了一个compilation，调用`this.newCompilation`：

```js
newCompilation(params) {
		const compilation = this.createCompilation();
		compilation.name = this.name;
		compilation.records = this.records;
		this.hooks.thisCompilation.call(compilation, params);
		this.hooks.compilation.call(compilation, params);
		return compilation;
	}
```

在这里执行了`this.hooks.compilation.call`，此时所有监听compilation事件的插件都会被调用

这里就触发了之前对这个事件感兴趣，我们也比较感兴趣的插件：HarmonyModulesPlugin：

```js
	apply(compiler) {
		compiler.hooks.compilation.tap(
			"HarmonyModulesPlugin",
			(compilation, { normalModuleFactory }) => {
				compilation.dependencyTemplates.set(
					HarmonyCompatibilityDependency,
					new HarmonyCompatibilityDependency.Template()
				);

				compilation.dependencyFactories.set(
					HarmonyImportSideEffectDependency,
					normalModuleFactory
				);
				compilation.dependencyTemplates.set(
					HarmonyImportSideEffectDependency,
					new HarmonyImportSideEffectDependency.Template()
				);

				compilation.dependencyFactories.set(
					HarmonyImportSpecifierDependency,
					normalModuleFactory
				);
				compilation.dependencyTemplates.set(
					HarmonyImportSpecifierDependency,
					new HarmonyImportSpecifierDependency.Template()
				);

				compilation.dependencyTemplates.set(
					HarmonyExportHeaderDependency,
					new HarmonyExportHeaderDependency.Template()
				);

				compilation.dependencyTemplates.set(
					HarmonyExportExpressionDependency,
					new HarmonyExportExpressionDependency.Template()
				);

				compilation.dependencyTemplates.set(
					HarmonyExportSpecifierDependency,
					new HarmonyExportSpecifierDependency.Template()
				);

				compilation.dependencyFactories.set(
					HarmonyExportImportedSpecifierDependency,
					normalModuleFactory
				);
				compilation.dependencyTemplates.set(
					HarmonyExportImportedSpecifierDependency,
					new HarmonyExportImportedSpecifierDependency.Template()
				);

				compilation.dependencyTemplates.set(
					HarmonyAcceptDependency,
					new HarmonyAcceptDependency.Template()
				);

				compilation.dependencyFactories.set(
					HarmonyAcceptImportDependency,
					normalModuleFactory
				);
				compilation.dependencyTemplates.set(
					HarmonyAcceptImportDependency,
					new HarmonyAcceptImportDependency.Template()
				);

				const handler = (parser, parserOptions) => {
					if (parserOptions.harmony !== undefined && !parserOptions.harmony)
						return;

					new HarmonyDetectionParserPlugin(this.options).apply(parser);
					new HarmonyImportDependencyParserPlugin(this.options).apply(parser);
					new HarmonyExportDependencyParserPlugin(this.options).apply(parser);
					new HarmonyTopLevelThisParserPlugin().apply(parser);
				};

				normalModuleFactory.hooks.parser
					.for("javascript/auto")
					.tap("HarmonyModulesPlugin", handler);
				normalModuleFactory.hooks.parser
					.for("javascript/esm")
					.tap("HarmonyModulesPlugin", handler);
			}
		);
	}
```

这里注册了`normalModuleFactory.hooks.parser`事件，当触发的时候，调用handler，也就是在parser的时候初始化了四个插件



然后调用了`this.hooks.make.callAsync`，搜索 `hooks.make.tapAsync` ，发现在`EntryPlugin`中有：

```js
compiler.hooks.make.tapAsync("EntryPlugin", (compilation, callback) => {
			const { entry, name, context } = this;

			const dep = EntryPlugin.createDependency(entry, name);
			compilation.addEntry(context, dep, name, err => {
				callback(err);
			});
		});
```

在这里初始化 entry，并调用`compilation.addEntry`：

```js
/**
	 *
	 * @param {string} context context path for entry
	 * @param {EntryDependency} entry entry dependency being created
	 * @param {string} name name of entry
	 * @param {ModuleCallback} callback callback function
	 * @returns {void} returns
	 */
	addEntry(context, entry, name, callback) {
		this.hooks.addEntry.call(entry, name);

		let entriesArray = this.entryDependencies.get(name);
		if (entriesArray === undefined) {
			entriesArray = [];
			this.entryDependencies.set(name, entriesArray);
		}
		entriesArray.push(entry);

		this.addModuleChain(context, entry, (err, module) => {
			if (err) {
				this.hooks.failedEntry.call(entry, name, err);
				return callback(err);
			}
			this.hooks.succeedEntry.call(entry, name, module);
			return callback(null, module);
		});
	}
```

把entry添加到entryDependencies中，然后执行 addModuleChain：

```js
/**
	 *
	 * @param {string} context context string path
	 * @param {Dependency} dependency dependency used to create Module chain
	 * @param {ModuleCallback} callback callback for when module chain is complete
	 * @returns {void} will throw if dependency instance is not a valid Dependency
	 */
	addModuleChain(context, dependency, callback) {
		if (
			typeof dependency !== "object" ||
			dependency === null ||
			!dependency.constructor
		) {
			return callback(
				new WebpackError("Parameter 'dependency' must be a Dependency")
			);
		}
		const Dep = /** @type {DepConstructor} */ (dependency.constructor);
		const moduleFactory = this.dependencyFactories.get(Dep);
		if (!moduleFactory) {
			return callback(
				new WebpackError(
					`No dependency factory available for this dependency type: ${dependency.constructor.name}`
				)
			);
		}

		this.handleModuleCreation(
			{
				factory: moduleFactory,
				dependencies: [dependency],
				originModule: null,
				context
			},
			err => {
				if (err && this.bail) {
					callback(err);
					this.buildQueue.stop();
					this.rebuildQueue.stop();
					this.processDependenciesQueue.stop();
					this.factorizeQueue.stop();
				} else {
					callback();
				}
			}
		);
	}
```

这里调用了 handleModuleCreation： 

```js
	handleModuleCreation(
		{ factory, dependencies, originModule, context },
		callback
	) {
		const moduleGraph = this.moduleGraph;

		const currentProfile = this.profile ? new ModuleProfile() : undefined;

		this.factorizeModule(
			{ currentProfile, factory, dependencies, originModule, context },
			(err, newModule) => {
				if (err) {
					if (dependencies.every(d => d.optional)) {
						this.warnings.push(err);
					} else {
						this.errors.push(err);
					}
					return callback(err);
				}

				if (!newModule) {
					return callback();
				}

				if (currentProfile !== undefined) {
					moduleGraph.setProfile(newModule, currentProfile);
				}

				this.addModule(newModule, (err, module) => {
					if (err) {
						if (!err.module) {
							err.module = module;
						}
						this.errors.push(err);

						return callback(err);
					}

					for (let i = 0; i < dependencies.length; i++) {
						const dependency = dependencies[i];
						moduleGraph.setResolvedModule(originModule, dependency, module);
					}

					moduleGraph.setIssuerIfUnset(
						module,
						originModule !== undefined ? originModule : null
					);
					if (module !== newModule) {
						if (currentProfile !== undefined) {
							const otherProfile = moduleGraph.getProfile(module);
							if (otherProfile !== undefined) {
								currentProfile.mergeInto(otherProfile);
							} else {
								moduleGraph.setProfile(module, currentProfile);
							}
						}
					}

					this.buildModule(module, err => {
						if (err) {
							if (!err.module) {
								err.module = module;
							}
							this.errors.push(err);

							return callback(err);
						}

						// This avoids deadlocks for circular dependencies
						if (this.processDependenciesQueue.isProcessing(module)) {
							return callback();
						}

						this.processModuleDependencies(module, err => {
							if (err) {
								return callback(err);
							}
							callback(null, module);
						});
					});
				});
			}
		);
	}
```

调用了`factorizeModule`

```js
factorizeModule(options, callback) {
		this.factorizeQueue.add(options, callback);
	}
```

```js
	buildModule(module, callback) {
		this.buildQueue.add(module, callback);
	}
```











