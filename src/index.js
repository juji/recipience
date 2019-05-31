require("@babel/polyfill");

const createCustomError = (props) => class RecipienceError extends Error {
   constructor (message) {
      super (message)
      this.constructor = RecipienceError
      this.__proto__   = RecipienceError.prototype
      this.message     = message

      for(var i in props){
        (

          i === 'constructor' &&
          i === '__proto__' &&
          i === 'message'

        ) || (

          this[i] = props[i]

        )

      }
   }
}

const RecipienceError = createCustomError({
  name: 'RecipienceError'
})
const Recipience = function( opt ){

  let done = false
  let error = null
  let resolver = null
  let rejector = null
  const cache = []
  const _t = this;

  const STATE = { pipeOrForked: false };

  this.convert = (
    opt && opt.convert && opt.convert.constructor === Function && opt.convert
  ) || null;

  this.meta = (
    opt && opt.meta
  ) || null;

  this.pipe = async function(){

    if(done) return;

    // if(_t.convert.constructor.name === "AsyncFunction"){
    //   _t.error(new Error('Convert function should not be an async function'))
    // }

    const err = arguments.length === 2 ? arguments[0] : null;
    const payload = arguments.length === 1 ? arguments[0] : arguments[1];
    if(payload instanceof Error) err = payload;

    if(err) _t.error(err);
    else {
      const data = _t.convert ? await _t.convert(payload) : payload;
      resolver ? resolver({
        value: data,
        done: false
      }) : cache.push(data);
    }

    resolver = rejector = null

  }

  this.isDone = () => done

  this.done = function(){
    done = true

    if(!resolver) return;
    resolver({ done: true })
    resolver = rejector = null
  }

  this.error = function(err){
    error = err
    done = true

    if(!rejector) return;
    rejector(err)
    resolver = rejector = null
  }

  this.stream = {
    _pipes: [],
    __started: false,
    async start(){

      if(this.__started) return;
      this.__started = true;

      STATE.pipeOrForked = true;

      if(!this._pipes.length)
        throw new Error('Error in starting Stream: No point to start without a pipe.')

      // start other Receipience,
      // only when a recipience pipes the data
      // if not, the data will be cached on the recipience,
      // and will be flushed at the appropriate time
      for(var i=0;i<this._pipes.length;i++){
        if(this._pipes[i].stream._pipes.length)
          this._pipes[i].stream.start()
      }

      const _callback = (data) => {
        for(var i=0;i<this._pipes.length;i++)
          this._pipes[i].pipe(data)
      }

      const _errorCallback = e => {
        for(var i=0;i<this._pipes.length;i++)
          this._pipes[i].error(e)
      }

      const _run = async () => {
        await this.next(STATE)
        .then(v => {
          if(!v.done) {
            _callback(v.value);
            return _run()
          }else{
            return v;
          }
        })
        .catch(_errorCallback)
      }

      await _run();
      for(var i=0;i<this._pipes.length;i++)
        this._pipes[i].done()

    },
    pipe( recipience, opt ){
      if(recipience.constructor !== Recipience)
        throw new Error('Error in piping Stream: The pipe needs to be a Recipience');

      opt = {
        start: true,
        ...(opt||{})
      };

      this._pipes.push(recipience)
      opt.start && this.start();
      return recipience.stream;
    },
    fork( recipience, opt ){
      if(recipience.constructor !== Recipience)
        throw new Error('Error in forking Stream: The fork needs to be a Recipience');

      opt = {
        start: true,
        ...(opt||{})
      };

      this._pipes.push(recipience)
      opt.start && this.start();
      return this;
    },
    each(fn){
      return this.next()
      .then(v => {
        if(!v.done) {
          fn(v.value);
          return this.each(fn)
        }else{
          return v;
        }
      })
      .catch(e => Promise.reject(e))
    },
    next() {

      // console.log({'STATE':STATE})
      // console.log({'arguments':arguments})
      // console.log({'arguments[0]':arguments[0]})
      // console.log({'arguments[0] === STATE':arguments[0] === STATE})
      //
      // console.log({'if condition' : (
      //   (STATE.pipeOrForked && !arguments[0]) ||
      //   (STATE.pipeOrForked && arguments[0] !== STATE)
      // )});


      if(
        (STATE.pipeOrForked && !arguments[0]) ||
        (STATE.pipeOrForked && arguments[0] !== STATE)
      ) return Promise.reject(new RecipienceError('I can\'t redirect flow from the plumbing'))

      // console.log('next', _t.meta)

      if(arguments[0] && arguments[0].isClosed && arguments[0].isClosed === 'p|f')

      this.__started = true;

      if(cache.length) return Promise.resolve({
        value: cache.shift(),
        done: false
      })
      if(error) return Promise.reject(error)
      if(done) return Promise.resolve({ done: true })

      return new Promise((r,j) => {
        resolver = r;
        rejector = j;
      })

    },
    [Symbol.asyncIterator]() {
      return {
        next: _t.stream.next
        // async next() {
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
      }
    }
  }
}

Recipience.RecipienceError = RecipienceError;
Recipience.CustomError = createCustomError;

module.exports = exports = Recipience
