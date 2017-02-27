var terror = require('terror');

var inject = require('./injectCheckChain');

terror = inject(terror);

module.exports = terror;
