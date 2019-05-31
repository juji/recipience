


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
let TestThis = () => { console.log('Fake function called') };
const listen = async ( recip ) => {

  const then = new Date()
  const Test = new Recipience({
    convert: data => ({
      payload: data,
      time: new Date() - then
    })
  })
  const Screen = new Recipience({
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
    Test.stream.each(TestThis()),
  ]).catch(e => {
    console.error('Recipience ERROR')
    console.error('This should not happen. Something needs to be fixed.')
    throw e
  })

  // done
  console.log('DONE', recip.isDone())
  console.log('OK ERROR or DONE have been called')

};

TestThis = () => {

  const negativeTrends = 0;
  const checkTimeSlope = () => {}
  return (data) => {

  }

}


// start listens
// listen(recipience)
listen(fork1)
listen(fork2)
listen(pipe2)
