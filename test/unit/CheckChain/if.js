var t = require('tap');

var mafError = require(__dirname + '/../../../src/mafError');
var CheckChain = require(__dirname + '/../../../src/CheckChain');

t.test('if: check error type, call function callback', function (t) {
    var TestError = mafError.create('TestError', {
        TEST_CODE: 'test_code'
    });

    var error = new TestError(TestError.CODES.TEST_CODE);

    var chain = new CheckChain();

    chain
        .if(TestError, function (error) {
            t.equal(error.code, TestError.CODES.TEST_CODE);
            t.end();
        });

    chain.check(error);
});

t.test('if: check error type, call else', function (t) {
    var TestError = mafError.create('TestError', {
        TEST_CODE: 'test_code'
    });

    var error = new Error('some message');

    var chain = new CheckChain();

    chain
        .if(TestError, function () {
            t.threw(new Error('catched in if'));
        })
        .else(function (error) {
            t.equal(error.message, 'some message');
            t.end();
        });

    chain.check(error);
});

t.test('if: check error type and call code callback', function (t) {
    var TestError = mafError.create('TestError', {
        TEST_CODE: 'test_code',
        NOT_FOUND: 'not found'
    });

    var error = new TestError(TestError.CODES.TEST_CODE);

    var chain = new CheckChain();

    chain
        .if(TestError, {
            'TEST_CODE'/* [TestError.CODES.TEST_CODE]*/: function (error) {
                t.equal(error.code, TestError.CODES.TEST_CODE);
                t.end();
            },
            'NOT_FOUND'/* [TestError.CODES.NOT_FOUND]*/: function () {
                t.threw(new Error('catched on code NODE_FOUND'));
            }
        });

    chain.check(error);
});


t.test('should call else if error.code not checked', function (t) {
    var TestError = mafError.create('TestError', {
        TEST_CODE: 'test_code',
        NOT_FOUND: 'not found'
    });

    var error = new TestError(TestError.CODES.NOT_FOUND);

    var chain = new CheckChain();

    chain
        .if(TestError, {
            'TEST_CODE'/* [TestError.CODES.TEST_CODE]*/: function () {
                t.threw(new Error('catched on code TEST_CODE'));
            }
        })
        .else(function (error) {
            t.equal(error.code, TestError.CODES.NOT_FOUND);
            t.end();
        });

    chain.check(error);
});

t.test('should call else if error not instanceof Error', function (t) {
    var TestError = mafError.create('TestError', {
        TEST_CODE: 'test_code',
        NOT_FOUND: 'not found'
    });

    var error = new Error('test error message');

    var chain = new CheckChain();

    chain
        .if(TestError, {
            'TEST_CODE'/* [TestError.CODES.TEST_CODE]*/: function () {
                t.threw(new Error('catched on code TEST_CODE'));
            }
        })
        .else(function (error) {
            t.equal(error.message, 'test error message');
            t.end();
        });

    chain.check(error);
});
