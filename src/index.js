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
  let pipes = []
  const cache = []

  // this is an id; a pointer to 'this'
  const _t = this; // an id the outside world can access
  const SOUL = { pipeOrForked: false }; // an id only this scope can access

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
    // Recipience.CustomError should help you in creating custom error
    // or extend Recipience.RecipienceError
    if(payload instanceof Error) { err = payload; }

    console.log({
      done,
      err, payload
    })

    if(err) {
      _t.error(err);
    }

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
  // expose 'done' to user
  this.isDone = () => done

  this.hasPipes = () => pipes.length && pipes.length

  // the feature
  // mark this recipience as done
  this.done = function(){
    done = true
    if(!resolver) return;
    resolver({ done: true })
    resolver = rejector = null
  }

  // the feature
  // mark this recipience as error
  // flow will not run after this
  this.error = function(err){
    error = err
    done = true
    if(!rejector) return;
    rejector(err)
    resolver = rejector = null
  }

  // the feature
  this.stream = {

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
      // and marked it as piped
      this.__started = true;


      // start all forks and pipes,
      pipes.length && pipes.forEach(pipe => {

        pipe && pipe.stream &&
        pipe.hasPipes() &&
        pipe.stream.start()

      })


      // start stream
      try{
        for await (const value of this){
          console.log({value})
          pipes.length && pipes.forEach(pipe => pipes.pipe && pipes.pipe(value))
        }
      }catch(e){
        pipes.length && pipes.forEach(pipe => pipes.pipe && pipes.error(e))
      }

      // after the stream ends
      pipes.length && pipes.forEach(pipe => { pipe.done() })

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

      pipes.push(recipience);
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

      pipes.push(recipience);
      opt.start && this.start();
      return this
    },
    async each(fn){
      for await (const value of _t.stream){
        fn(value)
      }
    },
    next() {

      // console.log(arguments.callee.toString())

      const isRedirected = false
      if(isRedirected) return Promise.reject(
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
