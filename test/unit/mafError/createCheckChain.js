var t = require('tap');

var CheckChain = require(__dirname + '/../../../src/CheckChain');
var mafError = require(__dirname + '/../../../src/mafError');

t.ok(typeof mafError.createCheckChain === 'function');

t.test('should create CheckChain', function (t) {
    var chain = mafError.createCheckChain();

    t.ok(chain instanceof CheckChain);
    t.end();
});
