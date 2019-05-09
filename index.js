function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Recipience = function Recipience() {
  var done = false;
  var error = null;
  var resolver = null;
  var rejector = null;
  var cache = [];

  var _t = this;

  this.pipe = function () {
    if (done) return;
    var err = arguments.length === 2 ? arguments[0] : null;
    var payload = arguments.length === 1 ? arguments[0] : arguments[1];
    if (err) _t.error(err);else resolver ? resolver({
      value: payload,
      done: false
    }) : cache.push(payload);
    resolver = rejector = null;
  };

  this.isDone = function () {
    return done;
  };

  this.done = function () {
    done = true;
    if (!resolver) return;
    resolver({
      done: true
    });
    resolver = rejector = null;
  };

  this.error = function (err) {
    error = err;
    done = true;
    if (!rejector) return;
    rejector(err);
    resolver = rejector = null;
  };

  this.stream = _defineProperty({}, Symbol.asyncIterator, function () {
    return {
      next: function next() {
        if (cache.length) return Promise.resolve({
          value: cache.shift(),
          done: false
        });
        if (error) return Promise.reject(error);
        if (done) return Promise.resolve({
          done: true
        });
        return new Promise(function (r, j) {
          resolver = r;
          rejector = j;
        });
      }
    };
  });
};

module.exports = exports = Recipience;