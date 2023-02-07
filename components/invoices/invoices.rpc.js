const rpc = require('../../middlewares/Rpc');
const Controller = require('./invoices.controller');
// can be either class or function

function handlers(namespace) {
	rpc.setNamespace(namespace)
	.register('get', async ({idUser,id,orderBy,limit}) => await Controller.get({idUser,id,orderBy,limit}))
}

module.exports = handlers
