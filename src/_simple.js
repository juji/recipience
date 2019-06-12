// dont mind this
console.log(`using ${process.argv[2] || './index'}`);
const Recipience = require(process.argv[2] || './index')
const recipience = new Recipience({
  meta: 'main',
  convert: function(v){
    return this.meta + ' ' + v
  }
})

// existing stream
const someStream = {
  on: (str, fn) => { this[str] = fn },
  write: (err, data) => err ?
    this.error && this.error(err) :
      data !== null ?
        this.data && this.data(data) :
          this.finish && this.finish()
}

someStream.on('data', recipience.pipe)
someStream.on('error', recipience.error)
someStream.on('finish', recipience.done)

//
const MAX_WRITE = 0;
let NUM_WRITE = 0;
const listen = async (r) => {

  await r.stream.each(v => console.log({ v }))
    .catch((e) => console.error({ e }))

  console.log({ done: r.meta })

}

const write = () => {
  if(MAX_WRITE && NUM_WRITE >= MAX_WRITE) return;
  someStream.write(null, NUM_WRITE++)
  setInterval(write)
}

listen(recipience)
write()
