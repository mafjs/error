var t = require('tap');

var mafError = require(__dirname + '/../../../src/mafError');
var CheckChain = require(__dirname + '/../../../src/CheckChain');

t.test('created error should has checkable prop and getCheckChain method', function (t) {
    var TestError = mafError.create('TestError');

    var error = new TestError();

    t.ok(error.checkable);
    t.ok(typeof error.getCheckChain === 'function');

    var chain = error.getCheckChain();

    t.ok(chain instanceof CheckChain);
    t.end();
});

t.test('ensureCheckChain: should get CheckChain from error', function (t) {

    var TestError = mafError.create('TestError', {
        TEST_CODE: 'test code'
    });

    var error = new TestError(TestError.CODES.TEST_CODE);

    var chain = TestError.ensureCheckChain(error);

    t.ok(chain instanceof CheckChain);
    t.ok(chain._error.code === TestError.CODES.TEST_CODE);
    t.end();
});

t.test('ensureCheckChain: should create new CheckChain if error object has no', function (t) {

    var TestError = mafError.create('TestError');

    var error = new Error('test error message');

    var chain = TestError.ensureCheckChain(error);

    t.ok(chain instanceof CheckChain);
    t.ok(chain._error.message === 'test error message');
    t.end();
});
