
const {expect} = require('chai');

const {src} = require('../spec-helper');

const {injectLazyGetter} = src.require('./index.js');


describe('injectLazyGetter', function() {

  const PROP = "foo";

  it('injects a getter into the object', function() {
    const x = {};

    // Confirm that the property does not exist yet
    expect(Object.getOwnPropertyDescriptor(x, PROP)).to.equal(undefined);

    injectLazyGetter(x, PROP, function() {
      return 3;
    });

    const desc = Object.getOwnPropertyDescriptor(x, PROP);
    expect(desc.value).to.equal(undefined); // It's not a property
    expect(desc.get).to.not.equal(undefined); // It's a getter
  });

  context('getter has been injected', function() {

    beforeEach(function() {
      this.x = {};
      injectLazyGetter(this.x, PROP, function() {
        return 3;
      });
    });


    it('allows the getter to be deleted', function() {
      const desc = Object.getOwnPropertyDescriptor(this.x, PROP);

      expect(desc.configurable).to.be.true;

      delete this.x[PROP];

      expect(Object.getOwnPropertyDescriptor(this.x, PROP)).to.equal(undefined);
    });


    it('replaces the getter w/ a property once it has been called', function() {
      expect(this.x[PROP]).to.equal(3);

      const desc = Object.getOwnPropertyDescriptor(this.x, PROP);

      expect(desc.get).to.equal(undefined); // It's no longer a getter
      expect(desc.value).to.equal(3); // It's a property
    });

  });


  // This spec is a bit redundant, but still good to check
  it('only invokes the getter once', function() {
    let calls = 0;
    const x = {};
    injectLazyGetter(x, PROP, function() {
      ++calls;
      return 5;
    });

    expect(calls).to.equal(0);

    expect(x[PROP]).to.equal(5);
    expect(calls).to.equal(1);

    expect(x[PROP]).to.equal(5);
    expect(calls).to.equal(1);
  });

});
