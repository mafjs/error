var t = require('tap');

var mafError = require(`${__dirname}/../../../src/maf-error`);
var CheckChain = require(`${__dirname}/../../../src/CheckChain`);

t.test('should use error from setError', function (t) {
    var TestError = mafError.create('TestError', {
        TEST_CODE: 'test_code'
    });

    var chain = new CheckChain();

    chain.setError(new TestError(TestError.CODES.TEST_CODE));

    chain.ifCode(TestError.CODES.TEST_CODE, function (error) {
        t.equal(error.code, TestError.CODES.TEST_CODE);
        t.end();
    });

    chain.check();
});

t.test('should use error from check arg, if setError passed', function (t) {
    var TestError = mafError.create('TestError', {
        TEST_CODE: 'test_code',
        TEST2_CODE: 'test2_code'
    });

    var chain = new CheckChain();

    chain.setError(new TestError(TestError.CODES.TEST_CODE));

    chain.ifCode(TestError.CODES.TEST_CODE, function () {
        t.threw(new Error('catched in TestError.CODES.TEST_CODE'));
    });

    chain.ifCode(TestError.CODES.TEST2_CODE, function (error) {
        t.equal(error.code, TestError.CODES.TEST2_CODE);
        t.end();
    });

    chain.check(new TestError(TestError.CODES.TEST2_CODE));
});

t.test('setError and use it in check', function (t) {
    var TestError = mafError.create('TestError', {
        TEST_CODE: 'test_code'
    });

    var chain = new CheckChain();

    chain.setError(new TestError(TestError.CODES.TEST_CODE));

    chain.ifCode(TestError.CODES.TEST_CODE, function (error) {
        t.equal(error.code, TestError.CODES.TEST_CODE);
        t.end();
    });

    chain.check();
});

t.test('should throw error if not setError and no error in check call', function (t) {
    var TestError = mafError.create('TestError', {
        TEST_CODE: 'test_code'
    });

    var chain = new CheckChain();

    chain.ifCode(TestError.CODES.TEST_CODE, function (error) {
        t.equal(error.code, TestError.CODES.TEST_CODE);
        t.end();
    });

    t.throws(
        function () {
            chain.check();
        },
        /maf-error: no error for check/
    );

    t.end();
});
