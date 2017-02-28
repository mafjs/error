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
    process.exit(1);
};

try {
    throw (new MyError(MyError.CODES.OMG)).bind({msg: 'OMG'});
} catch (e) {

    Error.ensureCheckChain(e, logger)
        .if(TaskError, {
            [TaskError.CODES.INVALID]: logGood
        })
        .if(MyError, {
            [MyError.CODES.ALLRIGHT]: logGood,
            [MyError.CODES.OMG]: logGood
        })
        .else(logBad)
        .check();

}
