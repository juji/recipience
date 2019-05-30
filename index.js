function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

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

  var _t = this;

  this.convert = opt && opt.convert ||
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

  this.pipe =
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var err,
        payload,
        data,
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
            // if(_t.convert.constructor.name === "AsyncFunction"){
            //   _t.error(new Error('Convert function should not be an async function'))
            // }
            err = _args2.length === 2 ? _args2[0] : null;
            payload = _args2.length === 1 ? _args2[0] : _args2[1];
            if (payload instanceof Error) err = (_readOnlyError("err"), payload);

            if (!err) {
              _context2.next = 9;
              break;
            }

            _t.error(err);

            _context2.next = 13;
            break;

          case 9:
            _context2.next = 11;
            return _t.convert(payload);

          case 11:
            data = _context2.sent;
            resolver ? resolver({
              value: data,
              done: false
            }) : cache.push(data);

          case 13:
            resolver = rejector = null;

          case 14:
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
    start: function () {
      var _start = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var _this = this;

        var i, _callback, _errorCallback;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this.__started) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return");

              case 2:
                this.__started = true;

                if (this._pipes.length) {
                  _context3.next = 5;
                  break;
                }

                throw new Error('Error in starting Stream: No point to start without a pipe.');

              case 5:
                // start other Receipience,
                // only when a recipience pipes the data
                // if not, the data will be cached on the recipience,
                // and will be flushed at the appropriate time
                for (i = 0; i < this._pipes.length; i++) {
                  if (this._pipes[i].stream._pipes.length) this._pipes[i].stream.start();
                }

                _callback = function _callback(data) {
                  for (var i = 0; i < _this._pipes.length; i++) {
                    _this._pipes[i].pipe(data);
                  }
                };

                _errorCallback = function _errorCallback(e) {
                  for (var i = 0; i < _this._pipes.length; i++) {
                    _this._pipes[i].error(e);
                  }
                };

                _context3.next = 10;
                return this.each(_callback).catch(_errorCallback);

              case 10:
                for (i = 0; i < this._pipes.length; i++) {
                  this._pipes[i].done();
                }

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function start() {
        return _start.apply(this, arguments);
      }

      return start;
    }(),
    pipe: function pipe(recipience, opt) {
      if (recipience.constructor !== Recipience) throw new Error('Error in piping Stream: The pipe needs to be a Recipience');
      opt = _objectSpread({
        start: true
      }, opt || {});

      this._pipes.push(recipience);

      opt.start && this.start();
      return recipience.stream;
    },
    fork: function fork(recipience, opt) {
      if (recipience.constructor !== Recipience) throw new Error('Error in forking Stream: The fork needs to be a Recipience');
      opt = _objectSpread({
        start: true
      }, opt || {});

      this._pipes.push(recipience);

      opt.start && this.start();
      return this;
    },
    each: function each(fn) {
      var _this2 = this;

      return this.next().then(function (v) {
        if (!v.done) {
          fn(v.value);
          return _this2.each(fn);
        } else {
          return v;
        }
      }).catch(function (e) {
        return Promise.reject(e);
      });
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
      next: _t.stream.next // async next() {
      //
      //   _t.stream.__started = true;
      //
      //   if(cache.length) return Promise.resolve({
      //     value: cache.shift(),
      //     done: false
      //   })
      //   if(error) return Promise.reject(error)
      //   if(done) return Promise.resolve({ done: true })
      //
      //   return new Promise((r,j) => {
      //     resolver = r;
      //     rejector = j;
      //   })
      //
      // }

    };
  });
};

module.exports = exports = Recipience;
