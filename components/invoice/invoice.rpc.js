const rpc = require('../../middlewares/Rpc');
const Controller = require('./invoice.controller');
// can be either class or function

function handlers(namespace) {
	rpc.setNamespace(namespace)
	.register('getCurrencies', async () => await Controller.getCurrencies())
}

module.exports = handlers
