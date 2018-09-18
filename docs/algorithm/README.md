# 算法

## [Fisher–Yates shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)

用于生成有限序列的随机排列。该算法有效地将所有元素放入帽子中;它通过从帽子中随机抽取一个元素来不断地确定下一个元素，直到没有元素剩下为止。

### Modern method

We'll now do the same thing using [Durstenfeld's version](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm) of the algorithm: this time, instead of striking out the chosen numbers and copying them elsewhere, we'll swap them with the last number not yet chosen. We'll start by writing out the numbers from 1 to 8 as before:

| Range | Roll | Scratch         | Result |
| ----- | ---- | --------------- | ------ |
|       |      | 1 2 3 4 5 6 7 8 |        |

For our first roll, we roll a random number from 1 to 8: this time it is 6, so we swap the 6th and 8th numbers in the list:

| Range | Roll | Scratch           | Result |
| ----- | ---- | ----------------- | ------ |
| 1–8   | 6    | 1 2 3 4 5 **8** 7 | **6**  |

The next random number we roll from 1 to 7, and turns out to be 2. Thus, we swap the 2nd and 7th numbers and move on:

| Range | Roll | Scratch         | Result  |
| ----- | ---- | --------------- | ------- |
| 1–7   | 2    | 1 **7** 3 4 5 8 | **2** 6 |

The next random number we roll is from 1 to 6, and just happens to be 6, which means we leave the 6th number in the list (which, after the swap above, is now number 8) in place and just move to the next step. Again, we proceed the same way until the permutation is complete:

| Range | Roll | Scratch     | Result            |
| ----- | ---- | ----------- | ----------------- |
| 1–6   | 6    | 1 7 3 4 5   | **8** 2 6         |
| 1–5   | 1    | **5** 7 3 4 | **1** 8 2 6       |
| 1–4   | 3    | 5 7 **4**   | **3** 1 8 2 6     |
| 1–3   | 3    | 5 7         | **4** 3 1 8 2 6   |
| 1–2   | 1    | **7**       | **5** 4 3 1 8 2 6 |

At this point there's nothing more that can be done, so the resulting permutation is 7 5 4 3 1 8 2 6.

<iframe height='324' scrolling='no' title='Fisher–Yates shuffle' src='//codepen.io/athena0304/embed/vzQYER/?height=324&theme-id=0&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/athena0304/pen/vzQYER/'>Fisher–Yates shuffle</a> by Athena (<a href='https://codepen.io/athena0304'>@athena0304</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

```javascript
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// counts of appearances for all possible permutations
let count = {
  '123': 0,
  '132': 0,
  '213': 0,
  '231': 0,
  '321': 0,
  '312': 0
};

for (let i = 0; i < 1000000; i++) {
  let array = [1, 2, 3];
  shuffle(array);
  count[array.join('')]++;
}

// show counts of all possible permutations
for (let key in count) {
  alert(`${key}: ${count[key]}`);
}
```

```javascript
123: 166693
132: 166647
213: 166628
231: 167517
312: 166199
321: 166316
```