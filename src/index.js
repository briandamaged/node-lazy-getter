
// Wraps a getter and ensures that it only needs
// to be evaluated once.
function UnboundLazyGetter(name, getter) {
  function lazyGetter() {
    const v = getter.apply(this, arguments);
    delete this[name];
    this[name] = v;
    return v;
  }

  return lazyGetter;
}


// For use w/ ES5 and such
function injectLazyGetter(obj, name, getter) {
  return Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: true,
    get: UnboundLazyGetter(name, getter),
  });
}



// For use w/ decorator syntax
function lazyGetter(obj, name, descriptor) {
  descriptor.get = UnboundLazyGetter(name, descriptor.get);

  return descriptor;
}

Object.assign(exports, {
  UnboundLazyGetter, injectLazyGetter, lazyGetter,
});
