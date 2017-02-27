var logger = require('log4js-nested').getLogger();

// add getCheckChain to global Error class
require('../modifyGlobalError');

// mafError - slightly customized terror object
var mafError = require('../index');

var MyError = mafError.create('MyError', {
    OMG: 'something go wrong: %msg%',
    ALLRIGHT: 'goood'
});

var logGood = function (error) {
    logger.error(error.message);
    console.log('all good, exit code = 0');
};

var logBad = function (error) {
    logger.fatal(error);
    process.exit(1);
};

try {

    var error = new Error('this is global Error class');
    error.code = MyError.CODES.OMG;

    throw error;


} catch (e) {

    e.getCheckChain()
        // set default error callback
        .setDefault(logBad)
        // .setLogger(logger)
        .ifCode(MyError.CODES.ALLRIGHT, logGood)
        .ifCode(MyError.CODES.OMG, logBad)
        .check();

}
