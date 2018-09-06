<template>
  <div>a=”123”; a.duplicate(); //返回”123123”</div>
</template>
<script>
  String.prototype.duplicate = function () {
    console.log(this + this)
    return this + this
  }
  // let a = new String("123")
  let a = "123"

  a.duplicate()
</script>