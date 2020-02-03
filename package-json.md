# package.json

## name

如果你计划要发布你的package，在package.json 中，最重要的就是 name 和 version字段，要求必填。 name 和 version一起构成了一个唯一标识，被认为是绝对唯一的。package的变化应该随着版本号的变化而变化。如果你没有计划发包，名字和版本号字段是可选的。

一些规则：

- 名字必须小于等于214个字符，包括scoped的包的范围。（This includes the scope for scoped packages.）
- 名字不能以点和下划线为开头。
- 新包的名称中不能有大写字母。
- 该名称最终会成为URL、命令行上的参数和文件夹名称的一部分。因此，名称不能包含任何URL不安全字符（Includes the blank/empty space and `" < > # % { } | \ ^ ~ [ ] ``）。

> 拓展阅读-不安全字符：
>
> Characters can be unsafe for a number of reasons. The space character is unsafe because significant spaces may disappear and insignificant spaces may be introduced when URLs are transcribed or typeset or subjected to the treatment of word-processing programs. The characters “`<`” and “`>`” are unsafe because they are used as the delimiters around URLs in free text; the quote mark (“`"`”) is used to delimit URLs in some systems. The character “`#`” is unsafe and should always be encoded because it is used in World Wide Web and in other systems to delimit a URL from a fragment/anchor identifier that might follow it. The character “`%`” is unsafe because it is used for encodings of other characters. Other characters are unsafe because gateways and other transport agents are known to sometimes modify such characters. These characters are “`{`”, “`}`”, “`|`”, “`\`”, “`^`”, “`~`”, “`[`”, “`]`”, and “```”.
>
> All unsafe characters must always be encoded within a URL. For example, the character “`#`” must be encoded within URLs even in systems that do not normally deal with fragment or anchor identifiers, so that if the URL is copied into another system that does use them, it will not be necessary to change the URL encoding.
>
>  https://perishablepress.com/stop-using-unsafe-characters-in-urls/

一些建议：

- 不要与核心 Node module同名
- 不要在名字里加上“js”或者“node”。因为本来你写的包就是js，而且可以用engines字段来指定engines。
- 这个名字可能会作为require()的参数出现，所以不要太长，但也得是合理的描述。
- 在起名字之前，可以去npm的官网检查一下是否已经有了你想要起的名字，避免重复。

名字可以有一个作用域（scope）的前缀，例如**@myorg/mypackage**。See `npm-scope` for more detail.

## version

version一般和name共同出现。

Version必须能被[node-semver](https://github.com/isaacs/node-semver)解析，它作为依赖项与npm绑定。

更多关于版本数字和范围请看 [semver](https://docs.npmjs.com/misc/semver).



## [description](https://docs.npmjs.com/files/package.json#description-1)

用于描述，是字符串，可以帮助人们发现你的包，会在**npm search**里列出。

![image-20190903101522001](/Users/athena/Library/Application Support/typora-user-images/image-20190903101522001.png)

## [keywords](https://docs.npmjs.com/files/package.json#keywords

关键字，字符串组成的数组，可以帮助人们发现你的包，会在**npm search**里列出。

## [homepage](https://docs.npmjs.com/files/package.json#homepage)

项目首页的url，例如：

`"homepage": "https://github.com/owner/project#readme"`

## [bugs](https://docs.npmjs.com/files/package.json#bugs)

url 指向你的项目的issue tracker，或者是一个上报issue的邮箱地址。这会帮助到使用你的包遇到问题的人。

可以是下面这样：

```
{ "url" : "https://github.com/owner/project/issues"
, "email" : "project@hostname.com"
}
```

你可以指定一个或两个值。如果你只想提供一个url，只填一个字符串就好。

如果提供了url，可以通过 `npm bugs` 命令打开。

## [license](https://docs.npmjs.com/files/package.json#license)

你应该为你的package指定一个licence，以便人们知道他们是如何被允许使用它的，以及您对它施加的任何限制。

## [people fields: author, contributors](https://docs.npmjs.com/files/package.json#people-fields-author-contributors)

author是一个人，contributors是数组。每个人是一个对象，里面有name、email和url，就像下面这样：

```
{ "name" : "Barney Rubble"
, "email" : "b@rubble.com"
, "url" : "http://barnyrubble.tumblr.com/"
}
```

或者你可以把它们缩成一行，npm会自动解析：

```
"Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)"
```

email和url都是可选的。

npm还设了一个maintainers字段，意为最优先的维护人员。

## [files](https://docs.npmjs.com/files/package.json#files)

可选字段，是由文件模式（file patterns）组成的数组，用来描述当你的包作为依赖被安装之后，有那些文件能够露出。文件模式的语法和**.gitignore**类似，但作用是相反的：这里面的内容例如文件名、路径或者glob模式（*`, `**/*）会被留下来，默认是**["\*"]**，也就是会包含所有文件。

一些特殊的文件和路径也会被包含或者剔除出去，不论他们是否存在于 files 数组中（见下面）。

你也可以在你包的根路径或者子目录提供一个 **.npmignore** 文件，可以阻止文件被包含进来。在你的包的根路径下不会重写“files”字段，但是在子目录下面会。**.npmignore**文件的原理和**.gitignore**类似。如果没有.npmignore文件，只有.gitignore文件，那么.gitignore文件将会被使用。

在 package.json#files 字段里标识的文件不能被 **.npmignore**和**.gitignore**排除掉。

下面这些文件总是会被引入，不管你是否设置了：

- `package.json`
- `README`
- `CHANGES` / `CHANGELOG` / `HISTORY`
- `LICENSE` / `LICENCE`
- `NOTICE`
- The file in the “main” field

相反，以下文件总是会被ignore：

- `.git`
- `CVS`
- `.svn`
- `.hg`
- `.lock-wscript`
- `.wafpickle-N`
- `.*.swp`
- `.DS_Store`
- `._*`
- `npm-debug.log`
- `.npmrc`
- `node_modules`
- `config.gypi`
- `*.orig`
- `package-lock.json` (use shrinkwrap instead)

## [main](https://docs.npmjs.com/files/package.json#main)

main这个字段是一个module ID，也就是说你整个项目的主入口。如果你的包叫做 foo， 那么用户安装了以后，调用**require("foo")**的时候，返回的就是这个入口所export的对象。

这应该是一个相对于包文件夹根目录的模块ID。

For most modules, it makes the most sense to have a main script and often not much else.

## [browser](https://docs.npmjs.com/files/package.json#browser)

如果你的module是要用在客户端的话，应该使用browser字段代替main字段。

## bin
很多package都想要把一个或者多个可执行文件安装到PATH中。
bin 字段是一个命令的名字和本地文件的映射。在install的时候，npm会将这个文件连接到 全局安装的*prefix/bin* 或者 局部安装的 **./node_modules/.bin/** 中。
例如，myapp有下面这个配置：
```
{ "bin" : { "myapp" : "./cli.js" } }
```
所以，当你 install myapp，将会为 cli.js 创建一个 symlink 到 **/usr/local/bin/myapp**。
如果你只有一个可执行文件，并且它的名字与package相同，那么 bin 就可以缩略成一个字符串。例如：
```
{ "name": "my-program"
, "version": "1.2.5"
, "bin": "./path/to/program" }
```
和下面的是一样的：
```
{ "name": "my-program"
, "version": "1.2.5"
, "bin" : { "my-program" : "./path/to/program" } }
```

需要确认的是，你在bin中所引用的文件需要以`#!/usr/bin/env node`开头，不然无法使用 node 的执行环境。

## man
指定单个文件或者文件名的数组，供 man 程序查找。
> man命令是Linux下的帮助指令，通过man指令可以查看Linux中的指令帮助、配置文件帮助和编程帮助等信息。

## directories
## repository
指定你的代码仓库位置。对于那些想要贡献代码的人有帮助。如果 git repo 是在 Github 上，那么 `npm docs` 命令就能够找到你。
就像下面这样：
```
"repository": {
  "type" : "git",
  "url" : "https://github.com/npm/cli.git"
}

"repository": {
  "type" : "svn",
  "url" : "https://v8.googlecode.com/svn/trunk/"
}
```
 URL应该是一个公共可访问的（有可能是只读）地址，不需要任何修饰就能被一个 VSC 程序处理。它不应该是一个浏览器里的项目页面的 url。这是供计算机读取的。

对于 GitHub, GitHub gist, Bitbucket, or GitLab仓库，你可以使用同名缩写：

```

"repository": "npm/npm"

"repository": "github:user/repo"

"repository": "gist:11081aaa281"

"repository": "bitbucket:user/repo"

"repository": "gitlab:user/repo"

```

##  scripts

script 是一个字典，包含运行在package生命周期不同时间的脚本命令。key 是生命周期事件，值是当前运行的命令。

## config
config 是一个对象，用来设置 scripts 命令的参数配置。例如，如果一个package有下面的配置：

```
{ "name" : "foo"
, "config" : { "port" : "8080" } }
```

然后有一个 start 的命令，会引用 npm_package_config_port 环境变量，然后用户可以通过执行 `npm config set foo:port 8001` 来进行覆盖。

## dependencies


dependencies 指定了一个简单的字典，讲 package 的名字和版本做了一个映射。版本的范围是一个字符串，包含一个或者多个以空格分隔的描述符。dependencies 也可以使用tarball或git URL识别依赖关系。

请不要在depandencies中放入测试工具或者转译器。见下面的 devDependencies。

## devDependencies

如果有人计划在他们的项目里下载并使用你的 module，那么他们可能不想或者不需要下载和安装额外的测试或者文档框架。
基于这种考虑，最好是将这些额外的东西放进 devDependencies 对象里。

这里的东西会在 package 的根目录下执行 npm link 或者 npm install进行安装，也可以像其他 npm 配置参数一样进行管理。

对于那些没有指定平台的，例如编译 CoffeeScript 或者把其他语言编译成 JavaScript，使用 `prepare` script 可以把需要的package设成一个 devDependency。
例如：

```
{ "name": "ethopia-waza",
  "description": "a delightfully fruity coffee varietal",
  "version": "1.2.3",
  "devDependencies": {
    "coffee-script": "~1.6.3"
  },
  "scripts": {
    "prepare": "coffee -o lib/ -c src/waza.coffee"
  },
  "main": "lib/waza.js"
}
```
`prepare` script 会在发布之前执行，这样使用者就不需要他们自己编译了。在 dev模式下（例如本地执行 npm install），也会执行这个脚本，方便测试。

## [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies)

In some cases, you want to express the compatibility of your package with a host tool or library, while not necessarily doing a `require` of this host. This is usually referred to as a *plugin*. Notably, your module may be exposing a specific interface, expected and specified by the host documentation.

例如：

```
{
  "name": "tea-latte",
  "version": "1.3.5",
  "peerDependencies": {
    "tea": "2.x"
  }
}
```

This ensures your package `tea-latte` can be installed *along* with the second major version of the host package `tea` only. `npm install tea-latte` 可能会产生以下依赖关系图：

```
├── tea-latte@1.3.5
└── tea@2.2.0
```

**NOTE: npm versions 1 and 2 will automatically install peerDependencies if they are not explicitly depended upon higher in the dependency tree. In the next major version of npm (npm@3), this will no longer be the case. You will receive a warning that the peerDependency is not installed instead.** The behavior in npms 1 & 2 was frequently confusing and could easily put you into dependency hell, a situation that npm is designed to avoid as much as possible.

**注意：npm 1 和 2 会自动安装 peerDependencies，如果他们在依赖树中没有明确的更高的依赖。在npm@3中不会这样了。你将收到一个警告，说明没有安装 peerDependency。**

npms 1 & 2的行为经常会产生困惑，可能很容易就进入依赖地狱，而这是npm尽量想要避免的。

Trying to install another plugin with a conflicting requirement will cause an error. For this reason, make sure your plugin requirement is as broad as possible, and not to lock it down to specific patch versions.



Assuming the host complies with [semver](https://semver.org/), only changes in the host package’s major version will break your plugin. Thus, if you’ve worked with every 1.x version of the host package, use `"^1.0"` or `"1.x"` to express this. If you depend on features introduced in 1.5.2, use `">= 1.5.2 < 2"`.