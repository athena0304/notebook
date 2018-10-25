# Strings & Arrays

## 是否唯一-Is Unique

### Instructions

Create a function that determines whether all characters in a string are unique or not. Make it case-sensitive, meaning a string with both `'a'` and `'A'` could pass the test.

**Input**: String

**Output**: Boolean

### Examples

```js
isUnique('abcdef'); // -> true
isUnique('89%df#$^a&x'); // -> true
isUnique('abcAdef'); // -> true
isUnique('abcaef'); // -> false
```

### solution

```js
function isUnique(str) {
    return new Set(str).size === str.length;
}
```

## 数组扁平化-Flatten Array

### Instructions

Write a function that will take an array of deeply nested arrays and extract every item, flattening the array. It should return a new array that contains the items of each internal array, preserving order.

**Input**: Array

**Output**: Array

### Examples:

```js
flatten([ [ [ [1], 2], 3], [4], [], [[5]]]);
// -> [1, 2, 3, 4, 5]

flatten(['abc', ['def', ['ghi', ['jkl']]]]);
// -> ['abc', 'def', 'ghi', 'jkl']
```

### solution

```js
function flatten(nestedArray) {
  return [].concat(...nestedArray.map(item => Array.isArray(item) ? flatten(item) : item))
}
```

## 字符串去重-Remove Dupes

### Instructions

Write a function that takes in a string and returns a new string. The new string should be the same as the original with every duplicate character removed.

**Input**: String

**Output**: String

### Examples

```
'abcd' -> 'abcd'
'aabbccdd' -> 'abcd'
'abcddbca' -> 'abcd'
'abababcdcdcd' -> 'abcd'
```

### solution

```js
function removeDupes(str) {
    return Array.from(new Set(str)).join("")
}
```

## 最高频率-Highest Frequency

### Instructions

Write a function that takes an array of strings and returns the most commonly occurring string in that array.

If there are multiple strings with the same high frequency, return the one that finishes its occurrences first, while going left to right through the array.

**Input**: Array of Strings

**Output**: String

### solution

```js
function highestFrequency(strings) {
    const frequencies = {};
    let maxFrequency = 0;
    let mostFrequentString = strings[0];
  
    for(let i = 0; i < strings.length; i++) {
        const thisStr = strings[i];
        
        if(frequencies[thisStr] === undefined) {
            frequencies[thisStr] = 1;
        } else {
            frequencies[thisStr]++;
        }
      
        if(frequencies[thisStr] > maxFrequency) {
            maxFrequency = frequencies[thisStr];
            mostFrequentString = thisStr;
        }
    }
    
    return mostFrequentString;
}
```

重点在于实时更新出现最多的个数和对应的字符串。

## 字符串旋转-String Rotation

### Instructions

Create a function that takes in 2 strings as parameters.

Return `true` if the strings are rotations of each other. Otherwise, return `false`.

**Input**: String, String

**Output**: Boolean

### Examples

The following sets of strings are rotations:

```
"rotation"  "tationro" "tionrota"

"javascript"  "scriptjava"  "iptjavascr"

"RotateMe"  "teMeRota"  "eRotateM"
```

### solution

```js
function stringRotation(str1, str2) {
    return str1.length === str2.length && (str1 + str1).includes(str2);
}
```

这是一个讨巧的做法，既然字符串是按顺序旋转的，那么两个一样的字符串合并，中间一定会有符合条件的。

"rotationrotation"里面啥都有了。