// dont mind this
console.log(`using ${process.argv[2] || './index'}`);
const Recipience = require(process.argv[2] || './index')
const recipience = new Recipience({ meta: 'main' })

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
let LOG = null;
let MESSAGE_NUM = 0;
let NUM_WRITE = 0;
const listen = async (r) => {

  await r.stream.each(v => console.log({ v }))
    .catch((e) => console.error({ e }))

  console.log({ done: r.meta })

}

const write = () => {
  someStream.write(NUM_WRITE++)
  console.log({ NUM_WRITE })
  setInterval(write)
}

listen(recipience)
write()
