var CheckChain = require('./CheckChain');
var mafError = require('./mafError');

module.exports = function (errorClass) {

    if (errorClass.prototype.checkable) {
        return errorClass;
    }

    // static methods

    errorClass.ensureCheckChain = function (error, logger) {

        var chain = null;

        if (error.checkable) {
            chain = error.getCheckChain(logger);
        } else {
            chain = errorClass.createCheckChain(logger);
            chain.setError(error);
        }

        return chain;
    };

    var createCheckChain = function (logger) {
        return new CheckChain(logger);
    };

    errorClass.createCheckChain = createCheckChain;

    errorClass.create = function () {
        return mafError.create.apply(mafError, arguments);
    };

    // new Error object extending

    errorClass.prototype.stackTraceLimit = 50;

    errorClass.prototype.code = null;

    errorClass.prototype.checkable = true;

    errorClass.prototype.getCheckChain = function (logger) {

        var chain = new CheckChain(logger);

        chain.setError(this);

        return chain;
    };


    return errorClass;

};
