# maf-error

checkable errors

[![bitHound Overall Score](https://www.bithound.io/github/mafjs/error/badges/score.svg)](https://www.bithound.io/github/mafjs/error)
[![bitHound Dependencies](https://www.bithound.io/github/mafjs/error/badges/dependencies.svg)](https://www.bithound.io/github/mafjs/error/master/dependencies/npm)
[![Build Status](https://travis-ci.org/mafjs/error.svg?branch=master)](https://travis-ci.org/mafjs/error)
[![Coverage Status](https://coveralls.io/repos/github/mafjs/error/badge.svg?branch=master)](https://coveralls.io/github/mafjs/error?branch=master)

[![NPM](https://nodei.co/npm/maf-error.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/maf-error/)



based on [terror](https://github.com/nodules/terror) package

# install

```js
npm i maf-error
```

# why?

errors usually checks with `if`

```js
// } catch (error) {
    if (error instanceof TaskError) {

        if (error.code === 'some_error_code') {
            // action ...
        } else if (/* ... */) {
            // ...
        } else {
            // ...
        }

    } else {
        // ...
    }

// }
```

[terror](https://github.com/nodules/terror) package allows check error type and code, but `if` is still here

```js
// var TaskError = terror.create('TaskError', {SOME_CODE: 'some error code'});
// } catch (error) {

    error = TaskError.ensureError(error);

    if (TaskError.is(TaskError.CODES.SOME_CODE)) {
        // action ...
    } } else if (/* ... */) {
        // ...
    } else {
        // ...
    }

// }
```

With promises you can write promise chain using different classes, methods, apis with different error types.

And got all error handling in one catch function.

```js
// some method: get all tasks in list

api.lists.get(listId)
    .then((list) => {
        return api.tasks.find({listId: list.id});
    })
    .then((tasks) => {
        res.json(tasks);
    })
    .catch((error) => {
        // here can get ListError, TaskError from apis
        // and other errors

        // and if checks here

        if (error instanceof ListError) {
            if (ListError.is(ListError.CODES.NOT_FOUND, error)) {
                res.status(404).json('not found');
            } else if (ListError.is(/* ... */)) {
                // ...
            } else {
                // ...
            }
        } else if (error instanceof TaskError) {
            // many if here
        } else {
            logger.error(error);
            res.status(500).json('server error');
        }

    });
```

too much `if`, too much code

using `maf-error`

```js
require('maf-error/initGlobal');

// same method and  same promise chain
//
    .catch((error) => {

        Error.ensureCheckChain(error)
            .if(ListError, {
                [ListError.CODES.NOT_FOUND]: (error) => {
                    res.status(404).json('not found');
                },

                [ListError.CODES.FORBIDDEN]: (error) => {
                    // ...
                }
            })
            .if(TaskError, {
                // ...
            })
            .else((error) => {
                logger.error(error);
                res.status(500).json('server error');
            })
            .check();

    });

```

clean and simple imho

# usage

see [examples](https://github.com/mafjs/error/tree/master/examples)

# LICENSE

MIT
