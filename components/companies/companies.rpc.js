const rpc = require('../../middlewares/Rpc');
const Controller = require('./companies.controller');
// can be either class or function

function handlers(namespace) {
	rpc.setNamespace(namespace)
	.register('getByType', async ({idUser,type}) => await Controller.getByType({idUser,type}))
	.register('getFieldsNamesByType', async (type) => await Controller.getFieldsNamesByType(type))
	.register('add', async (data) => await Controller.add(data))
	.register('getCurrencies', async () => await Controller.getCurrencies())
}

module.exports = handlers
