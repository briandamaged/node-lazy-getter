# lazy-getter #

[![npm version](https://badge.fury.io/js/lazy-getter.svg)](https://badge.fury.io/js/lazy-getter) [![GitHub version](https://badge.fury.io/gh/briandamaged%2Fnode-lazy-getter.svg)](https://badge.fury.io/gh/briandamaged%2Fnode-lazy-getter)

Lazily evaluate properties and cache the results.

## Installation ##

```shell
npm install lazy-getter
```

## Usage ##

### Plain-Old Javascript ###

If you're using plain-old Javascript, then you can inject lazy getters into your objects via the `injectLazyGetter(...)` function:

```javascript
const { injectLazyGetter } = require('lazy-getter');

const x = {};

// Notice: this getter is computationally expensive to run!
injectLazyGetter(x, "expensive", function() {
  console.log("Starting calculations");
  let k = 0;
  for(let i = 0; i < 100000; ++i) {
    for(let j = 0; j < 100000; ++j) {
      ++k;
    }
  }

  console.log("Finished expensive calculation!");
  return k;
});


// The getter will be evaluated the first time it is invoked
console.log(x.expensive);  // Super SLOW!


// Now the result is cached.  So, all subsequent calls will
// just be regular property lookups.
console.log(x.expensive);  // Super FAST!
```

### Decorators ###

If you're using [Babel's Decorators Transform](https://babeljs.io/docs/plugins/transform-decorators/), then you can convert your getters to lazy getters via the `@lazyGetter` decorator:

```javascript
const { lazyGetter } = require('lazy-getter');

const x = {
  @lazyGetter
  get expensive() {
    console.log("Starting calculations");
    let k = 0;
    for(let i = 0; i < 100000; ++i) {
      for(let j = 0; j < 100000; ++j) {
        ++k;
      }
    }

    console.log("Finished expensive calculation!");
    return k;
  },
};

console.log(x.expensive); // Super SLOW!
console.log(x.expensive); // Super FAST!
```

## ...Why? ##

Lazy Getters might seem a bit esoteric, but they are definitely very handy in certain scenarios.  Here are a few examples:

### Rarely-needed, but Computationally-Expensive Property ###

For example:

```javascript
class HumongousNumber {

  @lazyGetter
  get primeFactorization() {
    // Algorithm that returns an Array of prime factors
    // for the number.  Might take years to run.
  }
}
```



### Infinite Object Graphs ###

Sometimes, it's useful to model a problem as an infinite graph of Objects.  Obviously, you can't actually _contruct_ this infinite graph since it would require an unlimited about of time and memory.  Fortunately, you can "fake it" using lazy getters:

```javascript

function integerNode(i) {
  return {
    value: i,

    @lazyGetter
    get next() {
      return integerNode(i + 1);
    },
  }
}

const x = integerNode(0);

console.log(x.next.next.next.next.value); // Prints: 4
```

Now the object graph will be constructed as needed.

FYI: [zelda-lists](https://www.npmjs.com/package/zelda-lists) leverages this technique to convert any iterable Object into a linked list. This allows infinite iterators to be converted into infinite object graphs, which makes it significantly easier to implement recursive algorithms.
