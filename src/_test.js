


console.log(`using ${process.argv[2] || './index'}`);
const Recipience = require(process.argv[2] || './index')
const recipience = new Recipience()

// console.log(recipience)

// we have a stream of data
const someStream = {
  on: (str, fn) => { this[str] = fn },
  write: (err, data) => err ? this.error(err) : data !== null ? this.data(data) : this.finish()
}

someStream.on('data', recipience.pipe)
someStream.on('error', recipience.error)
someStream.on('finish', recipience.done)


// what happens if error get sent first?
// someStream.write(new Error('pre error'))

// write first, testing robustness
// while i'm drinking robusta
// that's a really bad dad joke
for(let i = -10; i<0; i++)
  someStream.write(null, i)

// send the data on an interval
let payload = 0
const writeData = () => setTimeout(() => {

  if(payload === 10){
    someStream.write(null, null)
    // someStream.write(new Error('test error'))
    return
  }

  someStream.write(null, payload++)
  writeData()

}, 50)


// fork and pipe

const fork1 = new Recipience({
  convert: (d) => `fork1 ${d}`
})

const fork2 = new Recipience({
  convert: (d) => `fork2 ${d}`
})

const pipe1 = new Recipience({
  convert: (d) => `pipe1 ${d}`
})

const pipe2 = new Recipience({
  convert: (d) => `pipe2 ${d}`
})

recipience.stream
  .fork(fork1)
  .fork(fork2)
  .pipe(pipe1)
  .pipe(pipe2)
;

writeData()

// start listening to incoming data
const listen = async ( recip ) => {

  const then = new Date()
  await recip.stream.each(data => {
    console.log('data', data, 'time', new Date() - then)
  }).catch(e => {
    console.log('ERROR CAPTURED:')
    console.error(e)
  })

  console.log('Is it DONE?', recip.isDone())
  console.log('ERROR, or DONE have been called')

};




// start listens
// listen(recipience)
listen(fork1)
listen(fork2)
listen(pipe2)
