var ErrorCheckChain = require('./CheckChain');

module.exports = function (errorClass) {

    errorClass.prototype.stackTraceLimit = 50;

    errorClass.prototype.checkable = true;

    errorClass.prototype.entity = null;

    errorClass.prototype.getCheckChain = function (defaultResponseFn, logger) {

        var chain = new ErrorCheckChain(this);

        if (defaultResponseFn) {
            chain.setDefault(defaultResponseFn);
        }

        if (logger) {
            chain.setLogger(logger);
        }

        return chain;
    };

    return errorClass;

};
