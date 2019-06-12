require("@babel/polyfill");

// This will make sense later
const createCustomError = (props) => class RecipienceError extends Error {
   constructor (message, meta) {
      super (message)
      this.constructor = RecipienceError
      this.__proto__   = RecipienceError.prototype
      this.message     = message

      this.meta = meta;

      props.constructor === Object &&
      Object.entries(props).forEach((key, value) => {
        (

          key === 'constructor' &&
          key === '__proto__' &&
          key === 'message'

        ) || (

          this[key] = value

        )
      });

   }
}

// This will also, make sense later
const RecipienceError = class RecipienceError extends Error {
   constructor (message) {
      super (message)
      this.constructor = RecipienceError
      this.__proto__   = RecipienceError.prototype
      this.message     = message
      this.name        = 'RecipienceError'
    }
}


// this is the thing...
// the receiving end of a data stream
// it has one optional parameter
// an object
const Recipience = function( opt ){

  // it has states
  let done = false
  let error = null
  let resolver = null
  let rejector = null
  const pipes = []
  const cache = []

  // this is an id; a pointer to this
  const _t = this;
  const SOUL = { pipeOrForked: false };

  // first option, what should we do with the data?
  // opt.convert
  // it must be a function
  this.convert = (
    opt && opt.convert && opt.convert.constructor === Function && opt.convert
  ) || null;

  // second config
  // custom properties from the user
  // opt.meta
  this.meta = (
    opt && opt.meta
  ) || null;

  // the feature
  this.pipe = async function(){

    if(done) return;
    const err = arguments.length === 2 ? arguments[0] : null;
    const payload = arguments.length === 1 ? arguments[0] : arguments[1];

    // payload can be a string, array, or anything. But not an Error.
    // createCustomError in line 4 should help you in creating custom error
    // or extend Recipience.RecipienceError
    if(payload instanceof Error) { err = payload; }

    if(err) { _t.error(err); }

    // conditions where the stream flows
    else {

      const data = _t.convert ? await _t.convert(payload) : payload;

      resolver ? resolver({
        value: data,
        done: false
      }) : cache.push(data);

    }

    resolver = rejector = null

  }

  // the feature
  this.isDone = () => done

  // the feature
  this.isPiped = () => pipes.length

  // the feature
  this.done = function(){
    done = true
    if(!resolver) return;
    resolver({ done: true })
    resolver = rejector = null
  }

  // the feature
  this.error = function(err){
    error = err
    done = true
    if(!rejector) return;
    rejector(err)
    resolver = rejector = null
  }

  // needed
  const internalIterator = {
    [Symbol.asyncIterator](){
      return {
        next(){

          _t.stream.__started = true;

          if(cache.length) return Promise.resolve({
            value: cache.shift(),
            done: false
          });

          if(error) return Promise.reject(error);
          if(done) return Promise.resolve({ done: true });

          return new Promise((r,j) => {
            resolver = r;
            rejector = j;
          })

        }
      }
    }
  }

  // the feature
  this.stream = {
    __started: false,

    // starting the stream, after piping
    async start(){

      // this === stream
      // ...
      if(this.__started) return;
      if(!pipes.length)
      throw new RecipienceError(
        'Error in starting Stream: No point to start without a pipe.',
        _t.meta
      )

      // set stream
      this.__started = true;
      SOUL.pipeOrForked = true;


      // start all forks and pipes,
      pipes.forEach(pipe => {

        pipe && pipe.stream &&
        pipe.isPiped() &&
        pipe.stream.start()

      })

      // redirect stream to all pipes
      const _callback = (data) => { pipes.forEach(pipe => pipe.pipe(data)) }
      const _errorCallback = e => { pipes.forEach(pipe => pipe.error(e)) }

      try{
        for await (const v of internalIterator){
          pipes.forEach(pipe => pipe.pipe(v))
        }
      }catch(e){
        pipes.forEach(pipe => pipe.error(e))
      }

      // after the stream ends
      pipes.forEach(pipe => { pipe.done() })

    },
    pipe( recipience, opt ){

      if(recipience.constructor !== Recipience)
        throw new RecipienceError(
          'Error in piping Stream: The pipe needs to be a Recipience',
          _t.meta
        )

      opt = {
        start: true,
        ...(opt||{})
      };

      pipes.push(recipience)
      opt.start && this.start();
      return recipience.stream;
    },
    fork( recipience, opt ){
      if(recipience.constructor !== Recipience)
        throw new RecipienceError(
          'Error in forking Stream: The fork needs to be a Recipience',
          _t.meta
        )

      opt = {
        start: true,
        ...(opt||{})
      };

      pipes.push(recipience)
      opt.start && this.start();
      return this
    },
    async each(fn){
      for await (const v of this){
        fn(v)
      }
    },
    next() {

      // if redirected
      if( pipes.length ) return Promise.reject(
        new RecipienceError(
          'Cannot redirect flow from the plumbing, Create a fork instead.',
          _t.meta
        )
      );

      this.__started = true;

      if(cache.length) return Promise.resolve({
        value: cache.shift(),
        done: false
      });

      if(error) return Promise.reject(error);
      if(done) return Promise.resolve({ done: true });

      return new Promise((r,j) => {
        resolver = r;
        rejector = j;
      })

    },
    [Symbol.asyncIterator]() {
      return {
        next: _t.stream.next
      }
    }
  }
}

Recipience.RecipienceError = RecipienceError;
Recipience.CustomError = createCustomError;

module.exports = exports = Recipience
