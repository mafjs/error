require('../initGlobal'); // 'maf-error/initGlobal'

var MyError = Error.create('MyError', {
    OMG: 'something go wrong: %msg%',
    ALLRIGHT: 'goood'
});

var logger = require('log4js-nested').getLogger();

try {
    var error = new MyError(MyError.CODES.OMG);
    error.bind({msg: 'shit happens'});
    throw error;

} catch (e) {

    Error.ensureCheckChain(e, logger)
        .ifCode(MyError.CODES.ALLRIGHT, function (error) {
            logger.error(error);
        })
        .ifCode(MyError.CODES.OMG, function (error) {
            logger.error(error);
        })
        .else(function (error) {
            logger.fatal(error);
        })
        .check();

}
