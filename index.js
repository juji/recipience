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

require("@babel/polyfill"); // This will make sense later


var createCustomError = function createCustomError(props) {
  return (
    /*#__PURE__*/
    function (_Error) {
      _inherits(RecipienceError, _Error);

      function RecipienceError(message, meta) {
        var _this;

        _classCallCheck(this, RecipienceError);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(RecipienceError).call(this, message));
        _this.constructor = RecipienceError;
        _this.__proto__ = RecipienceError.prototype;
        _this.message = message;
        _this.meta = meta;
        props.constructor === Object && Object.entries(props).forEach(function (key, value) {
          key === 'constructor' && key === '__proto__' && key === 'message' || (_this[key] = value);
        });
        return _this;
      }

      return RecipienceError;
    }(_wrapNativeSuper(Error))
  );
}; // This will also, make sense later


var RecipienceError =
/*#__PURE__*/
function (_Error2) {
  _inherits(RecipienceError, _Error2);

  function RecipienceError(message) {
    var _this2;

    _classCallCheck(this, RecipienceError);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(RecipienceError).call(this, message));
    _this2.constructor = RecipienceError;
    _this2.__proto__ = RecipienceError.prototype;
    _this2.message = message;
    _this2.name = 'RecipienceError';
    return _this2;
  }

  return RecipienceError;
}(_wrapNativeSuper(Error)); // this is the thing...
// the receiving end of a data stream
// it has one optional parameter
// an object


var Recipience = function Recipience(opt) {
  // it has states
  var done = false;
  var error = null;
  var resolver = null;
  var rejector = null;
  var cache = []; // this is an id; a pointer to this

  var _t = this;

  var SOUL = {
    pipeOrForked: false
  }; // first option, what should we do with the data?
  // opt.convert
  // it must be a function

  this.convert = opt && opt.convert && opt.convert.constructor === Function && opt.convert || null; // second config
  // custom properties from the user
  // opt.meta

  this.meta = opt && opt.meta || null; // the feature

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
            err = _args.length === 2 ? _args[0] : null;
            payload = _args.length === 1 ? _args[0] : _args[1]; // payload can be a string, array, or anything. But not an Error.
            // createCustomError in line 4 should help you in creating custom error
            // or extend Recipience.RecipienceError

            if (payload instanceof Error) {
              err = (_readOnlyError("err"), payload);
            }

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
  })); // the feature

  this.isDone = function () {
    return done;
  }; // the feature


  this.done = function () {
    done = true;
    if (!resolver) return;
    resolver({
      done: true
    });
    resolver = rejector = null;
  }; // the feature


  this.error = function (err) {
    error = err;
    done = true;
    if (!rejector) return;
    rejector(err);
    resolver = rejector = null;
  }; // the feature


  this.stream = _defineProperty({
    _pipes: [],
    __started: false,
    // starting the stream, after piping
    start: function () {
      var _start = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var _this3 = this;

        var _callback, _errorCallback, _flow;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.__started) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                if (this._pipes.length) {
                  _context2.next = 4;
                  break;
                }

                throw new RecipienceError('Error in starting Stream: No point to start without a pipe.', _t.meta);

              case 4:
                // set stream
                this.__started = true;
                SOUL.pipeOrForked = true; // start all forks and pipes,

                this._pipes.forEach(function (pipe) {
                  pipe && pipe.stream && pipe.stream._pipes.length && pipe.stream.start();
                }); // redirect stream to all pipes


                _callback = function _callback(data) {
                  _this3._pipes.forEach(function (pipe) {
                    return pipe.pipe(data);
                  });
                };

                _errorCallback = function _errorCallback(e) {
                  _this3._pipes.forEach(function (pipe) {
                    return pipe.error(e);
                  });
                }; // the flow
                //


                _flow = function _flow() {
                  // get next value
                  return _this3.next(SOUL) // do with value
                  .then(function (v) {
                    if (v.done) return v;

                    _callback(v.value);

                    return new Promise(function (r) {
                      return setTimeout(function () {
                        return r(_flow());
                      });
                    });
                  }) // handle error
                  .catch(_errorCallback);
                }; // start the flow


                _context2.next = 12;
                return _flow();

              case 12:
                // after the stream ends
                this._pipes.forEach(function (pipe) {
                  pipe.done();
                });

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function start() {
        return _start.apply(this, arguments);
      }

      return start;
    }(),
    pipe: function pipe(recipience, opt) {
      if (recipience.constructor !== Recipience) throw new RecipienceError('Error in piping Stream: The pipe needs to be a Recipience', _t.meta);
      opt = _objectSpread({
        start: true
      }, opt || {});

      this._pipes.push(recipience);

      opt.start && this.start();
      return recipience.stream;
    },
    fork: function fork(recipience, opt) {
      if (recipience.constructor !== Recipience) throw new RecipienceError('Error in forking Stream: The fork needs to be a Recipience', _t.meta);
      opt = _objectSpread({
        start: true
      }, opt || {});

      this._pipes.push(recipience);

      opt.start && this.start();
      return this;
    },
    each: function each(fn) {
      var _this4 = this;

      return this.next().then(function (v) {
        if (!v.done) {
          fn(v.value);
          return _this4.each(fn);
        } else {
          return v;
        }
      });
    },
    next: function next() {
      if (SOUL.pipeOrForked && !arguments[0] || SOUL.pipeOrForked && arguments[0] !== SOUL) return Promise.reject(new RecipienceError('Cannot redirect flow from the plumbing, Create a fork instead.', _t.meta));
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
      next: _t.stream.next
    };
  });
};

Recipience.RecipienceError = RecipienceError;
Recipience.CustomError = createCustomError;
module.exports = exports = Recipience;
