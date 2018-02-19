# lazy-getter #

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

console.log(x.expensive);
console.log(x.expensive);
```
