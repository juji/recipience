# Recipience

![Recipience](https://i.imgur.com/BH5uij0.png)

Recipience, minimize the need to write callbacks on the receiving-end of a data-stream system.

It converts a callback-based workflow into an [AsyncIterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator) workflow.

## Install
```
npm install recipience
```

## About

Instead of writing this:
```js
someStream.on('data', data => { doStuff( data ) })
someStream.on('error', err => { propagateError( err ) })
someStream.on('finish', () => { closeApp() })
```

We write this:
```js
Recipience = require('recipience')

const recipience = new Recipience()
someStream.on('data', recipience.pipe)
someStream.on('error', recipience.error)
someStream.on('finish', recipience.done)

try{
  for await (const data of recipience.stream)
    doStuff( data )

  closeApp()
}catch(e){
  propagateError( e )
}
```

## Why?
Borrowing jargons from *message-broker* systems, The word *Producer* and *Consumer* are being used here.

- instead of **asking** for a function as a callback handler, the Producer **gives** the Consumer a `RecipienceStream`. To give a Consumer a stream, means giving freedom to handle the stream in anyway possible to the Consumer.

- It is time to minimize writing callbacks. I personally think it was a hack on dealing with asynchronous incoming data stream. Consumer should not worry about callbacks. They should worry about data-stream. The stream will automatically finish or throw error.

- Consumers can have a clear visual flow of the system, as they intended (try...catch...finally).

- Separating concerns between Consumer and Producer.


## Usage and References
```js
const Recipience = require('recipience')
// import Recipience from 'recipience'
```

### Initialize
```js
const recipience = new Recipience()
```

A Recipience instance, have the following properties:
#### recipience.pipe
A pipe, like the name implies, is where the stream flows. Technically, it's a `Function`.

The pipe, takes either one or two arguments:
```js
recipience.pipe [Function( data )]
recipience.pipe [Function( err, data )]
```

It is to be used as a callback for the original event-based `.on()` call. For example:
```js
// someStream.on('data', data => recipience.pipe(data))
someStream.on('data', recipience.pipe)

// connectToLogService((err, data) => recipience.pipe(err, data))
connectToLogService(recipience.pipe)
```

A pipe can be used anytime. A Consumer can have an async process before they decided to receive data from pipe. In that case, they will receive all data coming into the pipe, from the start. Example:
```js
const startReceiveData = async () => {
  for await (const data of recipience.stream)
    console.log( data )
}

someStream.on('data', recipience.pipe)
someStream.write(-2)
someStream.write(-1)

startReceiveData()

someStream.write(0)
someStream.write(1)

/* result
-2
-1
0
1
*/
```

So, **incoming data are cached**. The cache will be empty when the consumer starts to listen to data.

#### recipience.error
A callback to handle error, we can use this if `pipe` is only receiving one parameter.
```
someStream.on('data', recipience.pipe)
someStream.on('error', recipience.error)
```

`recipience.error` takes only one argument.
```
recipience.error [Function(err)]
```

An `error` means the end of the stream. If an error happens, the stream is marked as `done`. No data will come out from the stream after error happens. In effect, the consumer system will follow the `catch` flow, and continues.

#### recipience.done
As in `recipience.error`:
```js
someStream.on('data', recipience.pipe)
someStream.on('error', recipience.error)
someStream.on('finish', recipience.done)
```

`recipience.done` does not take any argument.
```
recipience.done [Function()]
```

If a stream is marked as done, it will not produce any data. All data coming to the pipe after `done`, is discarded. The Consumer will stop iterating and the flow will continue.

Producer can also use this to their preference, calling whenever it is needed. Example:
```js
// notice, we don't need to call recipience.error
connectToLogService((err, data) => {
  if(typeof data !== 'undefined' && data === null) recipience.done()
  else recipience.pipe(err, data)
})
```

#### recipience.stream
This is the object we can give to the consumer. Consumer can **iterate** incoming data:
```js
for await (const data of recipience.stream)
    console.log( data )
```

Another example with control flow:
```js
try{

  for await (const data of recipience.stream)
    console.log( data )

  console.log('The stream is DONE')

}catch(e){

  console.log('The stream has error')
  console.error(e)

}

console.log('do things after done or error')
```

#### recipience.isDone
a `Function`
```
recipience.isDone [Function()]
```
Will return a boolean, that indicates wether a Recipience is marked as `done` or not.



## What changes?
Before:
```
Producer: i have incoming data, please provide a function to take care of this data.
Consumer: here you go.
```

After:
```
Producer: i have incoming data, Here you go.
Consumer: ok.
```

We can have separation of concerns.

Cheers,
[https://jujiyangasli.com](jujiyangasli.com)
