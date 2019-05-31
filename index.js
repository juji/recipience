function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

require("@babel/polyfill");

var createCustomError = function createCustomError(props) {
  return (
    /*#__PURE__*/
    function (_Error) {
      _inherits(RecipienceError, _Error);

      function RecipienceError(message) {
        var _this;

        _classCallCheck(this, RecipienceError);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(RecipienceError).call(this, message));
        _this.constructor = RecipienceError;
        _this.__proto__ = RecipienceError.prototype;
        _this.message = message;

        for (var i in props) {
          i === 'constructor' && i === '__proto__' && i === 'message' || (_this[i] = props[i]);
        }

        return _this;
      }

      return RecipienceError;
    }(_wrapNativeSuper(Error))
  );
};

var RecipienceError = createCustomError({
  name: 'RecipienceError'
});

var Recipience = function Recipience(opt) {
  var done = false;
  var error = null;
  var resolver = null;
  var rejector = null;
  var cache = [];

  var _t = this;

  var STATE = {
    pipeOrForked: false
  };
  this.convert = opt && opt.convert && opt.convert.constructor === Function && opt.convert || null;
  this.meta = opt && opt.meta || null;
  this.pipe =
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var err,
        payload,
        data,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!done) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return");

          case 2:
            // if(_t.convert.constructor.name === "AsyncFunction"){
            //   _t.error(new Error('Convert function should not be an async function'))
            // }
            err = _args.length === 2 ? _args[0] : null;
            payload = _args.length === 1 ? _args[0] : _args[1];
            if (payload instanceof Error) err = (_readOnlyError("err"), payload);

            if (!err) {
              _context.next = 9;
              break;
            }

            _t.error(err);

            _context.next = 18;
            break;

          case 9:
            if (!_t.convert) {
              _context.next = 15;
              break;
            }

            _context.next = 12;
            return _t.convert(payload);

          case 12:
            _context.t0 = _context.sent;
            _context.next = 16;
            break;

          case 15:
            _context.t0 = payload;

          case 16:
            data = _context.t0;
            resolver ? resolver({
              value: data,
              done: false
            }) : cache.push(data);

          case 18:
            resolver = rejector = null;

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
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
        var _this2 = this;

        var i, _callback, _errorCallback, _run;

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
                STATE.pipeOrForked = true;

                if (this._pipes.length) {
                  _context3.next = 6;
                  break;
                }

                throw new Error('Error in starting Stream: No point to start without a pipe.');

              case 6:
                // start other Receipience,
                // only when a recipience pipes the data
                // if not, the data will be cached on the recipience,
                // and will be flushed at the appropriate time
                for (i = 0; i < this._pipes.length; i++) {
                  if (this._pipes[i].stream._pipes.length) this._pipes[i].stream.start();
                }

                _callback = function _callback(data) {
                  for (var i = 0; i < _this2._pipes.length; i++) {
                    _this2._pipes[i].pipe(data);
                  }
                };

                _errorCallback = function _errorCallback(e) {
                  for (var i = 0; i < _this2._pipes.length; i++) {
                    _this2._pipes[i].error(e);
                  }
                };

                _run =
                /*#__PURE__*/
                function () {
                  var _ref2 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee2() {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return _this2.next(STATE).then(function (v) {
                              if (!v.done) {
                                _callback(v.value);

                                return _run();
                              } else {
                                return v;
                              }
                            }).catch(_errorCallback);

                          case 2:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function _run() {
                    return _ref2.apply(this, arguments);
                  };
                }();

                _context3.next = 12;
                return _run();

              case 12:
                for (i = 0; i < this._pipes.length; i++) {
                  this._pipes[i].done();
                }

              case 13:
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
      var _this3 = this;

      return this.next().then(function (v) {
        if (!v.done) {
          fn(v.value);
          return _this3.each(fn);
        } else {
          return v;
        }
      }).catch(function (e) {
        return Promise.reject(e);
      });
    },
    next: function next() {
      // console.log({'STATE':STATE})
      // console.log({'arguments':arguments})
      // console.log({'arguments[0]':arguments[0]})
      // console.log({'arguments[0] === STATE':arguments[0] === STATE})
      //
      // console.log({'if condition' : (
      //   (STATE.pipeOrForked && !arguments[0]) ||
      //   (STATE.pipeOrForked && arguments[0] !== STATE)
      // )});
      if (STATE.pipeOrForked && !arguments[0] || STATE.pipeOrForked && arguments[0] !== STATE) return Promise.reject(new RecipienceError('I can\'t redirect flow from the plumbing')); // console.log('next', _t.meta)

      if (arguments[0] && arguments[0].isClosed && arguments[0].isClosed === 'p|f') this.__started = true;
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

Recipience.RecipienceError = RecipienceError;
Recipience.CustomError = createCustomError;
module.exports = exports = Recipience;
