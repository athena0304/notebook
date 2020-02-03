## 换成named-export

如果每个模块都是以对象导出，在项目内部无法做到tree-shaking，在外部引用的时候，会出现只是用了这个对象的一个方法，但是要引入一整个对象，这个对象可能有十几个方法

## 减少副作用

### common中的getTag更新

在检查副作用语句时，发现common中的baseGetTag的函数参数有副作用，发现注释是来自lodash的，于是去查找了lodash的源码，发现lodash已经弃用这个API了，并且精简了getTag这个API。那么就先看一下baseGetTag是做什么的吧。

```js
const toString = Object.prototype.toString

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return toString.call(value)  
}

export default baseGetTag
```



```js
const objectProto = Object.prototype;
const hasOwnProperty = objectProto.hasOwnProperty;
const toString = objectProto.toString;
const symToStringTag = typeof Symbol !== 'undefined' ?  Symbol.toStringTag : undefined;

function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  if (!(symToStringTag && symToStringTag in Object(value))) {
    return toString.call(value);
  }
  const isOwn = hasOwnProperty.call(value, symToStringTag);
  const tag = value[symToStringTag];
  let unmasked = false;
  try {
    value[symToStringTag] = undefined;
    unmasked = true;
  } catch (e) { }

  const result = toString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

// via lodash.internal.getTag
const dataViewTag = '[object DataView]';
const mapTag = '[object Map]';
const objectTag = '[object Object]';
const promiseTag = '[object Promise]';
const setTag = '[object Set]';
const weakMapTag = '[object WeakMap]';

const dataViewCtorString = `${DataView}`;
const mapCtorString = `${Map}`;
const promiseCtorString = `${Promise}`;
const setCtorString = `${Set}`;
const weakMapCtorString = `${WeakMap}`;

let getTag = baseGetTag;

if ((DataView && getTag(new DataView(new ArrayBuffer(1))) !== dataViewTag)
  || (getTag(new Map()) !== mapTag)
  || (getTag(Promise.resolve()) !== promiseTag)
  || (getTag(new Set()) !== setTag)
  || (getTag(new WeakMap()) !== weakMapTag)) {
  getTag = value => {
    const result = baseGetTag(value);
    const Ctor = result === objectTag ? value.constructor : undefined;
    const ctorString = Ctor ? `${Ctor}` : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
        default:
      }
    }
    return result;
  };
}
```

#### Symbol.toStringTag

The initial value of `Symbol.toStringTag` is the well known symbol @@toStringTag ([Table 1](https://www.ecma-international.org/ecma-262/6.0/#table-1)).

This property has the attributes { [[Writable]]: **false**, [[Enumerable]]: **false**, [[Configurable]]: **false** }.



A String valued property that is used in the creation of the default string description of an object. Accessed by the built-in method `Object.prototype.toString`.



#### Object.prototype.toString ( )

https://www.ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring

When the `toString` method is called, the following steps are taken:

1. If the **this** value is **undefined**, return `"[object Undefined]"`.
2. If the **this** value is **null**, return `"[object Null]"`.
3. Let *O* be [ToObject](https://www.ecma-international.org/ecma-262/6.0/#sec-toobject)(**this** value).
4. Let *isArray* be [IsArray](https://www.ecma-international.org/ecma-262/6.0/#sec-isarray)(*O*).
5. [ReturnIfAbrupt](https://www.ecma-international.org/ecma-262/6.0/#sec-returnifabrupt)(*isArray*).
6. If *isArray* is **true**, let *builtinTag* be `"Array"`.
7. Else, if *O* is an exotic String object, let *builtinTag* be `"String"`.
8. Else, if *O* has an [[ParameterMap]] [internal slot](https://www.ecma-international.org/ecma-262/6.0/#sec-object-internal-methods-and-internal-slots), let *builtinTag* be `"Arguments"`.
9. Else, if *O* has a [[Call]] internal method, let *builtinTag* be `"Function"`.
10. Else, if *O* has an [[ErrorData]] [internal slot](https://www.ecma-international.org/ecma-262/6.0/#sec-object-internal-methods-and-internal-slots), let *builtinTag* be `"Error"`.
11. Else, if *O* has a [[BooleanData]] [internal slot](https://www.ecma-international.org/ecma-262/6.0/#sec-object-internal-methods-and-internal-slots), let *builtinTag* be `"Boolean"`.
12. Else, if *O* has a [[NumberData]] [internal slot](https://www.ecma-international.org/ecma-262/6.0/#sec-object-internal-methods-and-internal-slots), let *builtinTag* be `"Number"`.
13. Else, if *O* has a [[DateValue]] [internal slot](https://www.ecma-international.org/ecma-262/6.0/#sec-object-internal-methods-and-internal-slots), let *builtinTag* be `"Date"`.
14. Else, if *O* has a [[RegExpMatcher]] [internal slot](https://www.ecma-international.org/ecma-262/6.0/#sec-object-internal-methods-and-internal-slots), let *builtinTag* be `"RegExp"`.
15. Else, let *builtinTag* be `"Object"`.
16. Let *tag* be Get (*O*, @@toStringTag).
17. [ReturnIfAbrupt](https://www.ecma-international.org/ecma-262/6.0/#sec-returnifabrupt)(*tag*).
18. If [Type](https://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-data-types-and-values)(*tag*) is not String, let *tag* be *builtinTag*.
19. Return the String that is the result of concatenating `"[object "`, *tag*, and `"]"`.

This function is the %ObjProto_toString% intrinsic object.

NOTEHistorically, this function was occasionally used to access the String value of the [[Class]] [internal slot](https://www.ecma-international.org/ecma-262/6.0/#sec-object-internal-methods-and-internal-slots) that was used in previous editions of this specification as a nominal type tag for various built-in objects. The above definition of `toString` preserves compatibility for legacy code that uses `toString` as a test for those specific kinds of built-in objects. It does not provide a reliable type testing mechanism for other kinds of built-in or program defined objects. In addition, programs can use @@toStringTag in ways that will invalidate the reliability of such legacy type tests.



源码分析：https://juejin.im/post/5ba891366fb9a05d32515119



![image-20191014155251288](/Users/athena/Library/Application Support/typora-user-images/image-20191014155251288.png)

https://github.com/lodash/lodash/commits/master?after=23b2a33e756faad2875bd2c76937431856683eb2+34



### 第三方库axios

把axios设成external和peerDependency，在hotel-vue-kit中打包，在没有副作用的情况下会报找不到axios的错误，但是最终文件能够成功打包。

![image-20191014171034837](/Users/athena/Library/Application Support/typora-user-images/image-20191014171034837.png)

另外fetch文件中的_request有副作用









88kb

86.2Kb