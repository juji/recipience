


console.log(`using ${process.argv[2] || './index'}`);
const Recipience = require(process.argv[2] || './index')
const recipience = new Recipience({ meta: 'main' })

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
let cycle = 0;
const writeData = () => setTimeout(() => {

  // if(payload === 10){
  //   someStream.write(null, null)
  //   // someStream.write(new Error('test error'))
  //   return
  // }

  someStream.write(null, payload++)
  writeData()

}, 0)


// fork and pipe

const fork1 = new Recipience({
  meta: 'fork1',
  convert: (d) => `fork1 ${d}`
})

const fork2 = new Recipience({
  meta: 'fork2',
  convert: (d) => `fork2 ${d}`
})

const pipe1 = new Recipience({
  meta: 'pipe1',
  convert: (d) => `pipe1 ${d}`
})

const pipe2 = new Recipience({
  meta: 'pipe2',
  convert: function(d){ return `${this.meta} ${d}` }
})

recipience.stream
  .fork(fork1)
  .fork(fork2)
  .pipe(pipe1)
  .pipe(pipe2)
;

writeData()

// start listening to incoming data
let TestThis = () => { console.log('Fake function called') };
const listen = async ( recip ) => {

  const then = new Date()
  const Test = new Recipience({
    meta: 'test',
    convert: data => ({
      payload: data,
      time: new Date() - then
    })
  })
  const Screen = new Recipience({
    meta: 'screen',
    convert: data => [
      'data', data,
      'time', new Date() - then
    ].join(' ')
  })

  // send them to test
  await recip.stream
    .fork(Test)
    .fork(Screen)

  await Promise.all([
    Screen.stream.each(console.log),
    Test.stream.each(TestThis(recip)),
  ]).catch(e => {
    console.error('Recipience ERROR')
    console.error('This should not happen. Something needs to be fixed.')
    throw e
  })

  // done
  console.log('DONE', recip.meta, recip.isDone())

};

TestThis = (recipient) => {

  const negativeTrends = 0;
  const checkTimeSlope = () => {}

  return (data) => {
    console.log('TEST', data)
  }

}


// redirecting stream on a plumbing should throw error
// but the flow continues
recipience.stream.each(console.log)
  .catch(console.error)

// start listens
listen(fork1)
listen(fork2)
listen(pipe2)
