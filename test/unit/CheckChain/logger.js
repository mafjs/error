var t = require('tap');
var CheckChain = require(__dirname + '/../../../src/CheckChain');

t.test('use logger.debug method', function (t) {
    var logger = {
        messages: [],
        debug: function (message) {
            this.messages.push(message);
        }
    };

    var chain = new CheckChain(logger);

    var error = new Error();

    chain.else(function () {
        t.equal(logger.messages[0], 'maf-error: run checks');
        t.end();
    });

    chain.check(error);
});
