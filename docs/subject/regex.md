# 这次，我好像终于会正则了

> 前言：以前一看到正则就脑袋疼，其实就是不明白这些奇怪的符号的含义，这篇文章的内容来自开源项目 freeCodeCamp 的教程和练习，能够很好地入门正则，并学会一些基本的使用方法，至少现在我看到一些正则不会头晕了，能够静下心来好好解读。正则在实际工作中还是有很多用途的，比如我做的项目中就有好多表单校验相关的，而且搜索查找等等可能也会需要。有一些用数组和字符串方法比较复杂的，可能用正则很快就实现了，也是提高代码效率的一种手段。

### `.test()`

从这里还是接触正则再好不过了，这个函数很简单，就是验证是否匹配你给的正则条件，返回 `true` 或 `false`：

```js
let testStr = "howToCode";
let testRegex = /Code/;
testRegex.test(testStr);
// Returns true
```

### 匹配文字字符串

如果你只想匹配某个文字，就直接在`/.../` 中写出就好：

```js
let testStr = "Hello, my name is Kevin.";
let testRegex = /Kevin/;
testRegex.test(testStr);
// Returns true

let wrongRegex = /kevin/;
wrongRegex.test(testStr);
// Returns false
```

### 匹配多种文字字符串 `|`

使用 `|` 操作符来进行分割：

```js
let petString = "James has a pet cat.";
let petRegex = /dog|cat|bird|fish/;
let result = petRegex.test(petString);
```

### 忽略大小写 `i`

这里引入了标志 flag -- `i`

```javascript
let myString = "freeCodeCamp";
let fccRegex = /freeCodeCamp/i; 
let result = fccRegex.test(myString);
```

### `.match()` 提取匹配

在这之前，你只知道了如何检查要匹配的是否在字符串中，现在引入 `.match()` 方法来提取你找到的实际匹配项。输出的结果是一个数组，包含所有的匹配项。

```js
"Hello, World!".match(/Hello/);
// Returns ["Hello"]
let ourStr = "Regular expressions";
let ourRegex = /expressions/;
ourStr.match(ourRegex);
// Returns ["expressions"]
```

### 全局匹配 `g`

若要多次搜寻或提取匹配模式，你可以使用`g`标志：

```javascript
let twinkleStar = "Twinkle, twinkle, little star";
let starRegex = /twinkle/gi; 
let result = twinkleStar.match(starRegex); // ["Twinkle", "twinkle"]
```

### 用通配符 `.` 匹配任何内容

通配符 `.` 将匹配任何一个字符。

```js
let humStr = "I'll hum a song";
let hugStr = "Bear hug";
let huRegex = /hu./;
humStr.match(huRegex); // Returns ["hum"]
hugStr.match(huRegex); // Returns ["hug"]
```

### 字符集 `[]`

你已经了解了如何匹配文字匹配模式（`/literal/`）和通配符（`/./`）。这是正则表达式的两种极端情况，一种是精确匹配，而另一种则是匹配所有。在这两种极端情况之间有一个平衡选项。

你可以使用 `字符集` 搜寻具有一定灵活性的文字匹配模式。字符集允许你通过把它们放在方括号（`[`和`]`）之间的方式来定义一组你需要匹配的字符串。

```js
let bigStr = "big";
let bagStr = "bag";
let bugStr = "bug";
let bogStr = "bog";
let bgRegex = /b[aiu]g/;
bigStr.match(bgRegex); // Returns ["big"]
bagStr.match(bgRegex); // Returns ["bag"]
bugStr.match(bgRegex); // Returns ["bug"]
bogStr.match(bgRegex); // Returns null
```

### 匹配字母表中的字母 `连字符`（`-`）

例如，要匹配小写字母 `a` 到 `e`，你可以使用 `[a-e]`。

```js
let catStr = "cat";
let batStr = "bat";
let matStr = "mat";
let bgRegex = /[a-e]at/;
catStr.match(bgRegex); // Returns ["cat"]
batStr.match(bgRegex); // Returns ["bat"]
matStr.match(bgRegex); // Returns null
```

### 匹配字母表中的数字和字母

`/[a-z0-9]/`

```js
let jennyStr = "Jenny8675309";
let myRegex = /[a-z0-9]/ig;
// matches all letters and numbers in jennyStr
jennyStr.match(myRegex); // ["J", "e", "n", "n", "y", "8", "6", "7", "5", "3", "0", "9"]
```

### 否定字符集 `[^...]`

到目前为止，你已创建了一个你想要匹配的字符集合，但你也可以创建一个你不想匹配的字符集合。这些类型的字符集称为`否定字符集`。

例如，`/[^aeiou]/gi`匹配所有非元音字符。注意，字符`.`、`!`、`[`、`@`、`/`和空白字符等也会被匹配，该否定字符集仅排除元音字符。

### 匹配出现一次或多次的字符 `+`

可以使用`+`符号来检查情况是否如此。记住，字符或匹配模式必须一个接一个地连续出现。

例如，`/a+/g`会在`"abc"`中匹配到一个匹配项，并且返回`["a"]`。因为`+`的存在，它也会在`"aabc"`中匹配到一个匹配项，然后返回`["aa"]`。

如果它是检查字符串`"abab"`，它将匹配到两个匹配项并且返回`["a", "a"]`，因为`a`字符不连续，在它们之间有一个`b`字符。最后，因为在字符串`"bcd"`中没有`"a"`，因此找不到匹配项。

### 匹配出现零次或多次的字符 `*`

执行该操作的字符叫做`asterisk`或`star`，即`*`。

```js
let soccerWord = "gooooooooal!";
let gPhrase = "gut feeling";
let oPhrase = "over the moon";
let goRegex = /go*/;
soccerWord.match(goRegex); // Returns ["goooooooo"]
gPhrase.match(goRegex); // Returns ["g"]
oPhrase.match(goRegex); // Returns null
```

### 惰性匹配 `?`

`贪婪`匹配会匹配到符合正则表达式匹配模式的字符串的最长可能部分，并将其作为匹配项返回。

`惰性`匹配它会匹配到满足正则表达式的字符串的最小可能部分。

同样是 `"titanic"`，`/t[a-z]*i/`会返回 `["titani"]`，`/t[a-z]*?i/`会返回 `["ti"]`。

### 匹配字符串的开头 `^`

如果在字符集内部使用 `^`，是否定字符集的意思，在外部使用，用于字符串的开头搜寻匹配模式。

```js
let firstString = "Ricky is first and can be found.";
let firstRegex = /^Ricky/;
firstRegex.test(firstString);
// Returns true
let notFirst = "You can't find Ricky now.";
firstRegex.test(notFirst);
// Returns false
```

### 匹配字符串的末尾 `$`

```js
let theEnding = "This is a never ending story";
let storyRegex = /story$/;
storyRegex.test(theEnding);
// Returns true
let noEnding = "Sometimes a story will have to end";
storyRegex.test(noEnding);
// Returns false
```

### 匹配所有的字母和数字 `\w` `[A-Za-z0-9_]`

JavaScript 中与字母表匹配的最接近的字符类是`\w`，这个缩写等同于`[A-Za-z0-9_]`。它不仅可以匹配大小写字母和数字，注意，它还会匹配下划线字符（`_`）。

### 匹配除了字母和数字的所有符号 `\w`

你可以使用`\W`搜寻和`\w`相反的匹配模式。注意，相反匹配模式使用大写字母。此缩写与`[^A-Za-z0-9_]`是一样的。

```js
let shortHand = /\W/;
let numbers = "42%";
let sentence = "Coding!";
numbers.match(shortHand); // Returns ["%"]
sentence.match(shortHand); // Returns ["!"]
```

### 匹配所有数字 `\d`

这等同于字符类`[0-9]`，它查找 0 到 9 之间任意数字的单个字符。

### 匹配所有非数字 `\D`

查找非数字字符的缩写是`\D`。这等同于字符串`[^0-9]`，它查找不是 0 - 9 之间数字的单个字符。

### 匹配空白字符 `\s`

可以使用`\s`搜寻空格，其中`s`是小写。此匹配模式不仅匹配空格，还匹配回车符、制表符、换页符和换行符，你可以将其视为与`[\r\t\f\n\v]`类似。

```js
let whiteSpace = "Whitespace. Whitespace everywhere!"
let spaceRegex = /\s/g;
whiteSpace.match(spaceRegex);
// Returns [" ", " "]
```

### 匹配非空白字符 `\S`

使用`\S`搜寻非空白字符，其中`S`是大写。此匹配模式将不匹配空格、回车符、制表符、换页符和换行符。你可以认为这类似于字符类`[^\r\t\f\n\v]`。

```js
let whiteSpace = "Whitespace. Whitespace everywhere!"
let nonSpaceRegex = /\S/g;
whiteSpace.match(nonSpaceRegex).length; // Returns 32
```

### 指定匹配的上限和下限 `{a,b}`

可以使用`数量说明符`指定匹配模式的上下限。数量说明符与花括号（`{`和`}`）一起使用。你可以在花括号之间放两个数字，这两个数字代表匹配模式的上限和下限。

例如，要在字符串`"ah"`中匹配仅出现`3`到`5`次的字母`a`，你的正则表达式应为 `/a{3,5}h/`。

#### 只指定匹配的下限：

例如，要匹配至少出现 `3` 次字母 `a` 的字符串 `"hah"`，你的正则表达式应该是 `/ha{3,}h/`。

#### 指定匹配的确切数量

例如，要只匹配字母 `a` 出现 `3` 次的单词 `"hah"`，你的正则表达式应为 `/ha{3}h/`。

### 检查全部或无 `?`

可以使用问号 `?` 指定可能存在的元素。这将检查前面的零个或一个元素。你可以将此符号视为前面的元素是可选的。

```js
let american = "color";
let british = "colour";
let rainbowRegex= /colou?r/;
rainbowRegex.test(american); // Returns true
rainbowRegex.test(british); // Returns true
```

### 先行断言

#### 正向先行断言`(?=...)`

`正向先行断言` 会查看并确保搜索匹配模式中的元素存在，但实际上并不匹配。正向先行断言的用法是 `(?=...)`，其中 `...` 就是需要存在但不会被匹配的部分。

#### 负向先行断言`(?!...)`

`负向先行断言` 会查看并确保搜索匹配模式中的元素不存在。负向先行断言的用法是 `(?!...)`，其中 `...` 是你希望不存在的匹配模式。如果负向先行断言部分不存在，将返回匹配模式的其余部分。

```js
let quit = "qu";
let noquit = "qt";
let quRegex= /q(?=u)/;
let qRegex = /q(?!u)/;
quit.match(quRegex); // Returns ["q"]
noquit.match(qRegex); // Returns ["q"]
```

`先行断言` 的更实际用途是检查一个字符串中的两个或更多匹配模式。这里有一个简单的密码检查器，密码规则是 3 到 6 个字符且至少包含一个数字：

```js
let password = "abc123";
let checkPass = /(?=\w{3,6})(?=\D*\d)/;
checkPass.test(password); // Returns true
```

### 使用捕获组重用模式 `()`

你可以使用 `捕获组` 搜寻重复的子字符串。括号 `(` 和 `)` 可以用来匹配重复的子字符串。你只需要把重复匹配模式的正则表达式放在括号中即可。

要指定重复字符串将出现的位置，可以使用反斜杠（`\`）后接一个数字。这个数字从 1 开始，随着你使用的每个捕获组的增加而增加。这里有一个示例，`\1` 可以匹配第一个组。

```js
let repeatStr = "regex regex";
let repeatRegex = /(\w+)\s\1/;
repeatRegex.test(repeatStr); // Returns true
repeatStr.match(repeatRegex); // Returns ["regex regex", "regex"]
```

在字符串上使用 `.match()` 方法将返回一个数组，其中包含它匹配的字符串及其捕获组。

### 使用捕获组搜索和替换

可以使用字符串上 `.replace()` 方法来搜索并替换字符串中的文本。`.replace()` 的输入首先是你想要搜索的正则表达式匹配模式，第二个参数是用于替换匹配的字符串或用于执行某些操作的函数。

```js
let wrongText = "The sky is silver.";
let silverRegex = /silver/;
wrongText.replace(silverRegex, "blue");
// Returns "The sky is blue."

```

还可以使用美元符号（`$`）访问替换字符串中的捕获组。

```js
"Code Camp".replace(/(\w+)\s(\w+)/, '$2 $1');
// Returns "Camp Code"
```

