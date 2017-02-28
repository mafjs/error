var CheckChain = require('./CheckChain');

module.exports = function (terror) {

    var ensureCheckChain = function (error, logger) {

        var chain = null;

        if (error.checkable) {
            chain = error.getCheckChain(logger);
        } else {
            chain = terror.createCheckChain(logger);
            chain.setError(error);
        }

        return chain;
    };

    var createCheckChain = function (logger) {
        return new CheckChain(logger);
    };


    // terror object modifications

    terror.createCheckChain = terror.prototype.createCheckChain;

    terror._create = terror.create;

    terror.create = function (name, codes) {
        var Inheritor = this._create(name, codes);

        Inheritor.ensureCheckChain = ensureCheckChain;

        return Inheritor;
    };


    // terror instance modifications

    terror.prototype.stackTraceLimit = 50;

    terror.prototype.checkable = true;

    terror.prototype.getCheckChain = function (logger) {

        var chain = new CheckChain(logger);

        chain.setError(this);

        return chain;
    };

    terror.prototype.createCheckChain = createCheckChain;

    return terror;

};