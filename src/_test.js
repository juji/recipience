

const Recipience = require('../index')
// const Recipience = require('./index')
const recipience = new Recipience()

console.log(recipience)

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


writeData()

// start listening to incoming data
;(async () => {

  try{

    const then = new Date()
    for await (const data of recipience.stream)
      console.log('data', data, 'time', new Date() - then)

    console.log('DONE called?', recipience.isDone())

  }catch(e){

    console.log('ERROR CAPTURED:')
    console.error(e)

    console.log('Is it DONE?', recipience.isDone())

  }

  console.log('ERROR, or DONE have been called')

})()
