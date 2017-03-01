var t = require('tap');

var CheckChain = require(__dirname + '/../../../src/CheckChain');

t.test('should throw passed error if no checks', function (t) {
    var chain = new CheckChain();

    var error = new Error('thrown error');

    t.throws(
        function () {
            chain.check(error);
        },
        /thrown error/
    );

    t.end();
});

t.test('should throw passed error if no check callbacks called', function (t) {
    var chain = new CheckChain();

    chain.ifCode('test_code', function () {
        t.threw(new Error('catched in ifCode'));
    });

    var error = new Error('thrown error');

    t.throws(
        function () {
            chain.check(error);
        },
        /thrown error/
    );

    t.end();
});
