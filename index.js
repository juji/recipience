function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require("@babel/polyfill");

var Recipience = function Recipience(opt) {
  var done = false;
  var error = null;
  var resolver = null;
  var rejector = null;
  var cache = [];

  var convert = opt && opt.convert ||
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(v) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", v);

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var _t = this;

  this.pipe =
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var err,
        payload,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!done) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return");

          case 2:
            err = _args2.length === 2 ? _args2[0] : null;
            payload = _args2.length === 1 ? _args2[0] : _args2[1];
            if (payload instanceof Error) err = (_readOnlyError("err"), payload);

            if (!err) {
              _context2.next = 9;
              break;
            }

            _t.error(err);

            _context2.next = 23;
            break;

          case 9:
            if (!resolver) {
              _context2.next = 18;
              break;
            }

            _context2.t0 = resolver;
            _context2.next = 13;
            return _t.stream.convert(payload);

          case 13:
            _context2.t1 = _context2.sent;
            _context2.t2 = {
              value: _context2.t1,
              done: false
            };
            (0, _context2.t0)(_context2.t2);
            _context2.next = 23;
            break;

          case 18:
            _context2.t3 = cache;
            _context2.next = 21;
            return _t.stream.convert(payload);

          case 21:
            _context2.t4 = _context2.sent;

            _context2.t3.push.call(_context2.t3, _context2.t4);

          case 23:
            resolver = rejector = null;

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

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

  this.stream = _defineProperty({
    _pipes: [],
    __started: false,
    convert: convert,
    start: function start() {
      var _this = this;

      if (this.__started) return;
      this.__started = true;
      if (!this._pipes.length) throw new Error('Error in starting Stream: No point to start without a pipe.'); // start other Receipience,
      // only when a recipience pipes the data
      // if not, the data will be cached on the recipience,
      // and will be flushed at the appropriate time

      for (var i = this._pipes.length - 1; i > -1; i--) {
        if (this._pipes[i].stream._pipes.length) this._pipes[i].stream.start();
      }

      var listen =
      /*#__PURE__*/
      function () {
        var _ref3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee3() {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _this.next().then(function (res) {
                    console.log(res);

                    if (res.done) {
                      for (var i = 0; i <= _this._pipes.length; i++) {
                        _this._pipes[i].done();
                      }
                    } else {
                      for (var i = 0; i <= _this._pipes.length; i++) {
                        _this._pipes[i].pipe(res.value);
                      }

                      listen();
                    }
                  }).catch(function (e) {
                    for (var i = 0; i <= _this._pipes.length; i++) {
                      _this._pipes[i].error(e);
                    }
                  });

                case 1:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        return function listen() {
          return _ref3.apply(this, arguments);
        };
      }();

      listen();
    },
    pipe: function pipe(recipience) {
      if (recipience.constructor !== Recipience) throw new Error('Error in piping Stream: The pipe needs to be a Recipience');

      this._pipes.push(recipience);

      this.start();
      return recipience.stream;
    },
    fork: function fork(recipience) {
      if (recipience.constructor !== Recipience) throw new Error('Error in forking Stream: The fork needs to be a Recipience');

      this._pipes.push(recipience);

      this.start();
      return this;
    },
    next: function next() {
      this.__started = true;
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
  }, Symbol.asyncIterator, function () {
    return {
      next: function () {
        var _next2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee4() {
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _t.stream.__started = true;

                  if (!cache.length) {
                    _context4.next = 3;
                    break;
                  }

                  return _context4.abrupt("return", Promise.resolve({
                    value: cache.shift(),
                    done: false
                  }));

                case 3:
                  if (!error) {
                    _context4.next = 5;
                    break;
                  }

                  return _context4.abrupt("return", Promise.reject(error));

                case 5:
                  if (!done) {
                    _context4.next = 7;
                    break;
                  }

                  return _context4.abrupt("return", Promise.resolve({
                    done: true
                  }));

                case 7:
                  return _context4.abrupt("return", new Promise(function (r, j) {
                    resolver = r;
                    rejector = j;
                  }));

                case 8:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        function next() {
          return _next2.apply(this, arguments);
        }

        return next;
      }()
    };
  });
};

module.exports = exports = Recipience;
