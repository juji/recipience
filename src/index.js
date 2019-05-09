
const Recipience = function(){

  let done = false
  let error = null
  let resolver = null
  let rejector = null
  const cache = []

  const _t = this;

  this.pipe = function(){

    if(done) return;

    const err = arguments.length === 2 ? arguments[0] : null
    const payload = arguments.length === 1 ? arguments[0] : arguments[1]

    if(err) _t.error(err)
    else resolver ? resolver({ value: payload, done: false }) : cache.push(payload);

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
    [Symbol.asyncIterator]() {
      return {
        next() {

          if(cache.length) return Promise.resolve({ value: cache.shift(), done: false })
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
