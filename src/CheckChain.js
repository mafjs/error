/**
 * @param {logger} logger
 */
function CheckChain (logger) {
    this._logger = logger;
    this._error = null;
    this._checks = [];
}

/**
 * set error for check
 *
 * @param {Error} error
 * @return {this}
 */
CheckChain.prototype.setError = function (error) {
    this._error = error;
    return this;
};

/**
 * check error is instanceof class and checkCodes
 *
 * @param {Error} ErrorClass
 * @param {Object|Function} codeChecks
 * @return {this}
 */
CheckChain.prototype.if = function (ErrorClass, codeChecks) {

    var that = this;

    this._checks.push(function (error) {

        if (that._isInstanceOf(ErrorClass, error) === false) {
            return false;
        }

        if (typeof codeChecks === 'function') {
            codeChecks(error);
            return true;
        }

        if (that._processCodes(error, codeChecks) === true) {
            return true;
        }

        return false;

    });

    return this;
};

/**
 * check error code
 *
 * @param {String} code
 * @param {Function} cb
 * @return {this}
 */
CheckChain.prototype.ifCode = function (code, cb) {

    var that = this;

    this._checks.push(function (error) {

        if (that._ifCode(error, code)) {
            cb(error);
            return true;
        }

        return false;

    });

    return this;

};

/**
 * set error fallback
 *
 * @param {Function} cb
 * @return {this}
 */
CheckChain.prototype.else = function (cb) {
    var that = this;

    this._checks.push(function (error) {
        that._debug(`else fallback`);
        cb(error);
        return true;
    });

    return this;
};

/**
 * check error
 *
 * @param {Error} error
 * @return {Boolean}
 * @throw {Error}
 */
CheckChain.prototype.check = function (error) {

    if (!error) {
        if (this._error) {
            error = this._error;
        } else {
            throw new Error('maf-error: no error for check');
        }
    }

    this._debug(`maf-error: run checks`);

    var errorProcessed = false;

    for (var i in this._checks) {

        this._debug('step ' + i);

        var check = this._checks[i];

        var callbackTriggered = check(error);

        if (callbackTriggered) {
            errorProcessed = true;
            break;
        }

    }

    if (!errorProcessed) {
        this._debug('no checks triggered, throw error');
        throw error;
    }

    return true;
};

/**
 * @private
 * @param {Error} ErrorClass
 * @param {Error} error
 * @return {Boolean}
 */
CheckChain.prototype._isInstanceOf = function (ErrorClass, error) {

    this._debug(`check instanceof: (error instanceof ${ErrorClass.name})`);

    var bool = (error instanceof ErrorClass);

    this._debug(`(error instanceof ${ErrorClass.name}) = ${bool}`);

    return bool;
};

/**
 * @private
 * @param {Error} error
 * @param {String} code
 * @return {Boolean}
 */
CheckChain.prototype._ifCode = function (error, code) {

    this._debug(`check code: (error.code === ${code})`);

    var result = (error.code === code);

    this._debug(`(${error.code} === ${code}) = ${result}`);

    if (result) {
        this._debug(`exec callback on check (error.code === ${code})`);
        return true;
    }

    return false;

};

/**
 * @private
 * @param {Error} error
 * @param {Object} codeChecks
 * @return {Boolean}
 */
CheckChain.prototype._processCodes = function (error, codeChecks) {

    for (var code in codeChecks) {
        var cb = codeChecks[code];

        if (this._ifCode(error, code) === true) {
            cb(error);
            return true;
        }

    }

    return false;

};

/**
 * @private
 */
CheckChain.prototype._debug = function () {

    if (
        this._logger &&
        this._logger.debug &&
        typeof this._logger.debug === 'function'
    ) {
        this._logger.debug.apply(this._logger, arguments);
    }

};

module.exports = CheckChain;
