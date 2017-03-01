var t = require('tap');

var CheckChain = require(`${__dirname}/../../../src/CheckChain`);

require(`${__dirname}/../../../initGlobal`);


t.test('global Error should have create method', function (t) {
    t.ok(typeof Error.create === 'function');

    var TestError = Error.create('TestError', {
        TEST_CODE: 'test code'
    });

    t.equal(TestError.CODES.TEST_CODE, 'TEST_CODE');
    t.ok(typeof TestError.ensureCheckChain === 'function');

    t.end();
});

t.test('global Error should have createCheckChain', function (t) {
    t.ok(typeof Error.createCheckChain === 'function');

    var chain = Error.createCheckChain();

    t.ok(chain instanceof CheckChain);

    t.end();
});

t.test('Error.ensureCheckChain: should get CheckChain from error', function (t) {

    var TestError = Error.create('TestError', {
        TEST_CODE: 'test code'
    });

    var error = new TestError(TestError.CODES.TEST_CODE);

    var chain = Error.ensureCheckChain(error);

    t.ok(chain instanceof CheckChain);
    t.ok(chain._error.code === TestError.CODES.TEST_CODE);
    t.end();
});

t.test('ensureCheckChain: should create new CheckChain if error object has no', function (t) {
    var error = new Error('test error message');

    error.checkable = false;

    var chain = Error.ensureCheckChain(error);

    t.ok(chain instanceof CheckChain);
    t.ok(chain._error.message === 'test error message');
    t.end();
});

t.test('new Error should has getCheckChain method', function (t) {
    var error = new Error();

    t.ok(typeof error.getCheckChain === 'function');

    var chain = error.getCheckChain();

    t.ok(chain instanceof CheckChain);
    t.end();
});
