var mafError = require('../index');

// here slightly modified terror
var MyError = mafError.create('MyError', {
    TEST: 'test'
});

var logger = require('log4js-nested').getLogger();

try {
    throw new MyError(MyError.CODES.TEST);
} catch (e) {

    MyError.ensureCheckChain(e, logger)
        .if(MyError, {
            [MyError.CODES.TEST]: function (error) {
                console.log(error.message);
            }
        })
        .else(function (error) {
            console.log('else', error.message);
        })
        .check();

}
