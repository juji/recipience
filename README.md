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
```
after that, we can do lots of stuff...

#### We can listen to the stream
```js
try{
    for await (const data of recipience.stream)
        doStuff( data )
}catch(e){
    propagateError( err )
}
closeApp()
```
or,
```js
const listen = () => {
    recipience.stream.next()
    .then(data => {
        doStuff( data )
        listen();
    ))
    .catch(propagateError)
}
listen();
```
or,
```js
await recipience.stream.each(doStuff).catch(propagateError);
closeApp();
```

#### We can fork the stream
```js
recipience.stream
  .fork( new Recipience() )
  .fork( new Recipience() )
  .fork( new Recipience() )

/*
            +- fork1
            |
recipience -+- fork2
            |
            +- fork3
*/
```

#### We can pipe the stream
```js
recipience.stream
  .pipe( new Recipience() )
  .pipe( new Recipience() )
  .pipe( new Recipience() )

/*
recipience -+- pipe1 -+- pipe2 -+- pipe3
*/
```

#### We can also, convert data in the stream
Read on, my friend...

## Usage and References
```js
const Recipience = require('recipience')
// import Recipience from 'recipience'
```

### Initialize
```js
const recipience = new Recipience( options )
```

#### Options

##### options.convert
You can convert data by defining convert function. Async function is supported.
```
const recipience = new Recipience({
  convert: async ( data ) => data + ' converted';
})
```
Please remember that using an async function as `convert` can mess with data ordering in stream.


### The Instance
```js
const recipience = new Recipience( option )
```
A Recipience instance, have the following properties:
#### recipience.pipe
A pipe, like the name implies, is where the stream flows. Technically, it's a `Function`.

The pipe, takes either one or two arguments:
```js
recipience.pipe [Function( data )]
recipience.pipe [Function( err, data )]
```
if the first arguments is an instance of `Error`, it will be regarded as Error, regardles of the number of arguments:
```js
// implementation under the hood:
if(data instanceof Error) err = data;
```

if you throw an error using custom object, please [extend `Error` object](https://javascript.info/custom-errors). So it can be detected as error.


The __pipe__, is to be used as a callback for the original event-based `.on()` call. For example:
```js
// someStream.on('data', data => recipience.pipe(data))
someStream.on('data', recipience.pipe)

// connectToLogService((err, data) => recipience.pipe(err, data))
connectToLogService(recipience.pipe)
```

A pipe can be used anytime. A Receiver can have an async process before they decided to receive data from pipe. In that case, they will receive all data coming into the pipe, from the start. Example:
```js

someStream.on('data', recipience.pipe)

// write data first
someStream.write(-2)
someStream.write(-1)

// start receiving data
recipience.stream.each(console.log)

// write data after listen
someStream.write(0)
someStream.write(1)

/* result
-2
-1
0
1
*/
```

So, **incoming data are cached**. The cache will be flushed to the Stream when the Receiver starts receiving data.

#### recipience.error
A callback to handle error, we can use this if `pipe` is only using one argument.
```
someStream.on('data', recipience.pipe)
someStream.on('error', recipience.error)
```

`recipience.error` takes only one argument.
```
recipience.error [Function(err)]
```

An `error` means the end of the stream. If an error happens, the stream is marked as `done`. No data will come out from the stream after error happens. In effect, the Receiver system will follow the `catch` flow, and continues.

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

If a stream is marked as done, it will not produce any data. All data coming to the pipe after `done`, is discarded. The Receiver will stop iterating and the flow will continue.

A usage example:
```js
// notice, we don't need to call recipience.error
connectToLogService((err, data) => {
  if(typeof data !== 'undefined' && data === null) recipience.done()
  else recipience.pipe(err, data)
})
```

#### recipience.stream
This is where the data lives. Receiver can **iterate** incoming data:
```js
for await (const data of recipience.stream)
    console.log( data )
```

or, simply:
```js
await recipience.stream.each(console.log)
```

Another example with control flow:
```js
try{
  for await (const data of recipience.stream)
    console.log( data )
}catch(e){
  console.error(e)
}

console.log('do things after done or error')
```
...
```js
await recipience.stream.each(console.log)
 .catch(console.error)

console.log('do things after done or error')
```

#### recipience.stream.pipe & recipience.stream.fork
A `RecipienceStream` can be forked, and piped.
```js
recipience.stream.pipe( Recipience [, option ] )
recipience.stream.fork( Recipience [, option ] )
```
##### Option

- __start__ to configure autostart. Default value is `true`
   ```
   { start: true }
   ```
   By default, a stream will start listening to data event when it is piped or forked.

##### The difference:
`stream.fork` and `stream.pipe` **are both chainable**.

- `stream.pipe` returns the next RecipienceStream
- `stream.fork` returns the orginal RecipienceStream

Example:
```
const original = new Recipience()

const pipe1 = new Recipience()
const pipe2 = new Recipience()

const fork1 = new Recipience()
const fork2 = new Recipience()

const result = original.stream
  .fork(fork1)
  .fork(fork2)
  .pipe(pipe1)
  .pipe(pipe2)

// result
/*

original -+- fork1
          |
          +- fork2
          |
          +- pipe1 - pipe2
*/
```

##### Does this affect caching?
YES, glad you asked.

Each recipience in a fork will hold it's own cache as long as receiver does not listen.
So be careful on the receiving end.

Each pipe, however, will only hold cache on the end of the pipe.

So, in the example, cache will be held in `fork1`, `fork2`, and `pipe2`.

##### Note on fork and pipe
You should NOT listen to data events on the original stream if you decided to fork or pipe. Listening to data event on the original stream will redirect data flow to YOUR function, instead of the plumbing.

If you need to debug your data, fork one instead.


#### recipience.stream.start
If you decided to pipe, or fork, It will start automatically.
```
recipience.stream.pipe( new Recipience() )
// will auto start
```

You can stop autostart from happening by setting `option` on fork and pipe.
```
recipience.stream.pipe( new Recipience(), { start: false } )
recipience.stream.fork( new Recipience(), { start: false } )

//do something...
await doSomething()

// start the sream
recipience.stream.start()
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
Producer: i have data for you, please provide a function to take care of this data.
Consumer: here you go.
```

After:
```
Producer: i have data for you. Here, this is the Recipience.
Consumer: ok.
```

We can have separation of concerns.

Cheers,
[jujiyangasli.com](https://jujiyangasli.com)
