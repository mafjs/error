# maf-error Public API

**init version:** 0.9.0

## maf-error

### using

```js
var mafError = require('maf-error');
```

>mafError is slightly modified <a href="https://github.com/nodules/terror" target="_blank">**terror**</a> object

### mafError object - new methods

```js

// all terror interface

// +

/**
 * create new CheckChain object
 *
 * @param {?Logger} logger
 * @return {CheckChain}
 */
mafError.createCheckChain = function (logger) {};

```

### created terror Error object - new methods

```js
var MyError = mafError.create('MyError', {});

// all terror Error object interface

// +

/**
 * ensure is error checkable and has getCheckChain method
 * if not - create new CheckChain for error
 *
 * @param {Error} error
 * @param {?Logger} logger
 * @return {CheckChain}
 */
MyError.ensureCheckChain = function (error, logger) {};
```


### new terror Error instance - new methods and props

```js
var MyError = mafError.create('MyError', {});

var error = new MyError();

// all terror new Error instance interface

// +

/**
 * flag - error checkable and has getCheckChain method
 *
 * @type {Boolean}
 */
error.checkable = true;

/**
 * return CheckChain object for error
 *
 * @param {?Logger} logger
 * @return {CheckChain}
 */
error.getCheckChain = function (logger) {};
```






## extended global Error


### using

```js

// extend global Error object
require('maf-error/initGlobal');

```

### 1. global Error object will be extended with "static" methods

```js

// global Error interface

// +

/**
 * ensure is error checkable and has getCheckChain method
 * if not - create new CheckChain for error
 *
 * @param {Error} error
 * @param {?Logger} logger
 * @return {CheckChain}
 */
Error.ensureCheckChain = function (error, logger) {};

/**
 * just an alias to terror.create method
 *
 * @param {String} name
 * @param {?Object} codes
 * @return {Error}
 */
Error.create = function (name, codes) {};

/**
 * create new CheckChain object
 *
 * @param {?Logger} logger
 * @return {CheckChain}
 */
Error.createCheckChain = function (logger) {};
```

### 2. every new global Error instance will be extended with props and methods

```js
var error = new Error('some text');

// global Error new instance interface

// +

/**
 * flag - error checkable and has getCheckChain method
 *
 * @type {Boolean}
 */
error.checkable = true;

/**
 * return CheckChain object for error
 *
 * @param {?Logger} logger
 * @return {CheckChain}
 */
error.getCheckChain = function (logger) {};

```





## CheckChain

every method return `this` for chaining methods

```js
class CheckChain {

    /**
     * @param {?logger} logger
     */
    constructor (logger) {}

    /**
     * set error for usage in check method call without error arg
     *
     * @param {Error} error
     * @return {this}
     */
    setError (error) {}

    /**
     * check instanceof Error class and codes
     *
     * @param {Error} ErrorClass
     * @param {Object|Function} codeChecks
     * @return {this}
     */
    if (ErrorClass, codeChecks) {}

    /**
     * check if code === error.code
     *
     * @param {String} code
     * @param {Function} cb
     * @return {this}
     */
    ifCode(code, cb) {}

    /**
     * error fallback
     *
     * @param {Function} cb
     * @return {this}
     */
    else (cb) {}

    /**
     * check error by chain
     *
     * @param {?Error} error
     * @return {Boolean}
     */
    check (error) {}

}
```


## usage


### maf-error/initGlobal

```js
require('maf-error/initGlobal');

var TaskError = Error.create('TaskError', {
    INVALID: 'invalid task data',
    DUPLICATE: 'duplicate task: id = %id%'
});

var ListError = Error.create('ListError', {
    INVALID: 'invalid list data'
});

try {
    throw (new TaskError(TaskError.CODES.DUPLICATE)).bind({id: 100500});
} catch (e) {

    // using global Error ensureCheckChain method
    Error.ensureCheckChain(e)
        .if(TaskError, {
            [TaskError.CODES.INVALID]: function (error) {},
            [TaskError.CODES.DUPLICATE]: function (error) {},
        })
        .if(ListError, {
            [ListError.CODES.INVALID]: function (error) {}
        })
        .else(function (error) {
            // error fallback
        })
        .check();

}

```
