var logger = require('log4js-nested').getLogger();

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

    var error = new MyError(MyError.CODES.OMG);
    error.bind({msg: 'shit happens'});
    throw error;

} catch (e) {
    //
    if (!e.checkable) {
        // not maf-error object
        // log and exit
        // or throw higher
        throw e;
    }

    // pass default error callback in getCheckChain
    e.getCheckChain(logBad)
        .ifCode(MyError.CODES.ALLRIGHT, logGood)
        .ifCode(MyError.CODES.OMG, logBad)
        .check();

}
