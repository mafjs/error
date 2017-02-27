var logger = require('log4js-nested').getLogger();

// add getCheckChain to global Error class
require('../modifyGlobalError');

// mafError - slightly customized terror object
var mafError = require('../index');

var MyError = mafError.create('MyError', {
    OMG: 'something go wrong: %msg%',
    ALLRIGHT: 'goood'
});

var TaskError = mafError.create('TaskError', {
    INVALID: 'invalid task'
});

TaskError.entity = 'task';

var logGood = function (error) {
    logger.error(error.message);
    console.log('all good, exit code = 0');
};

var logBad = function (error) {
    logger.fatal(error);
    process.exit(1);
};

try {

    throw new TaskError(TaskError.CODES.INVALID);
    // throw new MyError(MyError.CODES.OMG);

} catch (e) {

    e.getCheckChain()
        // set default error callback
        .setDefault(logBad)
        // .setLogger(logger)
        .ifEntity('task')
        .ifCode(TaskError.CODES.INVALID, logGood)
        .end()
        .ifCode(MyError.CODES.ALLRIGHT, logGood)
        .ifCode(MyError.CODES.OMG, logBad)
        .check();

}
