require('../initGlobal');

var MyError = Error.create('MyError', {
    OMG: 'something go wrong: %msg%',
    ALLRIGHT: 'goood'
});

var TaskError = Error.create('TaskError', {
    INVALID: 'invalid task'
});

var logger = require('log4js-nested').getLogger();

var logGood = function (error) {
    logger.error(error);
    console.log('all good, exit code = 0');
};

var logBad = function (error) {
    logger.fatal(error);
    console.log('fatal error');
};

// prepare check chain
var checkChain = Error.createCheckChain(logger)
    .if(TaskError, {
        [TaskError.CODES.INVALID]: logGood
    })
    .if(MyError, {
        [MyError.CODES.ALLRIGHT]: logGood,
        [MyError.CODES.OMG]: logGood
    })
    .else(logBad);

// using for check

checkChain.check(new MyError(MyError.CODES.OMG));
checkChain.check(new TaskError(TaskError.CODES.INVALID));
checkChain.check(new Error('some error message'));
