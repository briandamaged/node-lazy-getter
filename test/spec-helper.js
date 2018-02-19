
const path = require('path');

function PathResolver(root) {
  return {
    root: root,

    join(p) {
      return path.join(this.root, p);
    },

    require(p) {
      return require(this.join(p));
    }
  };
}

const src = PathResolver(path.resolve(path.join(__dirname, '..', 'src')));
const test = PathResolver(path.resolve(path.join(__dirname)));


Object.assign(exports, {
  src, test,
});
