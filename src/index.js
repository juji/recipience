
const _ = this;
const Recipience = function( opt ){

  let done = false
  let error = null
  let resolver = null
  let rejector = null
  const cache = []
  const convert = (opt && opt.convert) || async function(v){ return v };
  const _t = this;

  this.pipe = async function(){

    this._super = _t;
    this._ = _;

    if(done) return;

    const err = arguments.length === 2 ? arguments[0] : null
    const payload = arguments.length === 1 ? arguments[0] : arguments[1]

    if(err) _t.error(err)
    else resolver ? resolver({
      value: await _t.stream.convert(payload),
      done: false
    }) : cache.push(await _t.stream.convert(payload));

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
    _: _,
    _pipes: [],
    __started: false,
    convert,
    async start(){

      if(this.__started) return;
      this.__started = true;

      if(!this._pipes.length)
        throw new Error('Error in starting Stream: No point to start without a pipe.')

      // start other Receipience,
      // only when a recipience pipes the data
      // if not, the data will be cached on the recipience,
      // and will be flushed at the appropriate time
      for(var i=this._pipes.length-1;i>-1;i--){
        if(this._pipes[i].stream._pipes.length)
          this._pipes[i].stream.start()
      }

      try{
        for await (const v in this)
          for(var i=0;i<=this._pipes.length;i++)
            this._pipes[i].pipe(null,v)
      }catch(e){
        for(var i=0;i<=this._pipes.length;i++)
          this._pipes[i].pipe(e)
      }

      for(var i=0;i<=this._pipes.length;i++)
        this._pipes[i].done()

    },
    pipe( recipience ){
      if(recipience.constructor !== Recipience)
        throw new Error('Error in piping Stream: The pipe needs to be a Recipience');

      this._pipes.push(recipience)
      return this;
    },
    [Symbol.asyncIterator]() {
      return {
        async next() {

          _t.stream.__started = true;

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

        }
      }
    }
  }
}

module.exports = exports = Recipience
