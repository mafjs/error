var t = require('tap');

var CheckChain = require(`${__dirname}/../../../src/CheckChain`);

var createError = function (code, message) {
    var error = new Error(message);
    error.code = code;
    return error;
};

t.test('ifCode check: exec ifCode callback', function (t) {

    var message = 'test message';
    var code = 'test_code';

    var chain = new CheckChain();

    chain
        .ifCode('test_code', function (error) {
            t.equal(error.code, code);
            t.end();
        });

    chain.check(createError(code, message));
});

t.test('ifCode check: exec else callback', function (t) {

    var message = 'test message';
    var code = 'test_code';

    var chain = new CheckChain();

    chain
        .ifCode('test_code_1', function () {
            t.threw(new Error('catched in ifCode'));
        })
        .else(function (error) {
            t.equal(error.code, code);
            t.end();
        });


    chain.check(createError(code, message));
});
