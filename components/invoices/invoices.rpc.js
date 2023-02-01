const rpc = require('../../middlewares/Rpc');
const Controller = require('./invoices.controller');
// can be either class or function

function handlers(namespace) {
	rpc.setNamespace(namespace)
	.register('get', async ({idUser}) => await Controller.get({idUser}))
}

module.exports = handlers
