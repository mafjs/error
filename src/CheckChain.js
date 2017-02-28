/**
 * error check chain
 */
class CheckChain {

    /**
     * @param {logger} logger
     */
    constructor (logger) {
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
    setError (error) {
        this._error = error;
        return this;
    }

    /**
     * check error is instanceof class and checkCodes
     *
     * @param {Error} ErrorClass
     * @param {Object|Function} codeChecks
     * @return {this}
     */
    if (ErrorClass, codeChecks) {

        this._checks.push((error) => {

            if (this._isInstanceOf(ErrorClass, error) === false) {
                return false;
            }

            if (typeof codeChecks === 'function') {
                codeChecks(error);
                return true;
            }

            if (this._processCodes(error, codeChecks) === true) {
                return true;
            }

            return false;

        });

        return this;
    }

    /**
     * check error code
     *
     * @param {String} code
     * @param {Function} cb
     * @return {this}
     */
    ifCode (code, cb) {

        this._checks.push((error) => {

            if (this._ifCode(error, code)) {
                cb(error);
                return true;
            }

            return false;

        });

        return this;

    }

    /**
     * set error fallback
     *
     * @param {Function} cb
     * @return {this}
     */
    else (cb) {
        this._checks.push((error) => {
            this._debug(`else fallback`);
            cb(error);
            return true;
        });

        return this;
    }

    /**
     * check error
     *
     * @param {Error} error
     * @return {Boolean}
     * @throw {Error}
     */
    check (error) {

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
    }

    /**
     * @private
     * @param {Error} ErrorClass
     * @param {Error} error
     * @return {Boolean}
     */
    _isInstanceOf (ErrorClass, error) {
        var ErrorClassName = ErrorClass.prototype.name;

        this._debug(`check instanceof: (error.name === ${ErrorClassName})`);

        var bool = (ErrorClassName === error.name);

        this._debug(`(${error.name} === ${ErrorClassName}) => ${bool}`);

        return bool;
    }

    /**
     * @private
     * @param {Error} error
     * @param {String} code
     * @return {Boolean}
     */
    _ifCode (error, code) {

        this._debug(`check code: (error.code === ${code})`);

        var result = (error.code === code);

        this._debug(`(${error.code} === ${code}) => ${result}`);

        if (result) {
            this._debug(`exec callback on check (error.code === ${code})`);
            return true;
        }

        return false;

    }

    /**
     * @private
     * @param {Error} error
     * @param {Object} codeChecks
     * @return {Boolean}
     */
    _processCodes (error, codeChecks) {

        for (var code in codeChecks) {
            var cb = codeChecks[code];

            if (this._ifCode(error, code) === true) {
                cb(error);
                return true;
            }

        }

        return false;

    }

    /**
     * @private
     */
    _debug () {

        if (
            this._logger &&
            this._logger.debug &&
            typeof this._logger.debug === 'function'
        ) {
            this._logger.debug.apply(this._logger, arguments);
        }

    }

}

module.exports = CheckChain;
