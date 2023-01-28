const rpc = require('../../middlewares/Rpc');
const Controller = require('./users.controller');
// can be either class or function

function handlers(namespace) {
	rpc.setNamespace(namespace)
	.register('createUser', async (objValue) => await Controller.createUser(objValue))
	.register('login', async (username,password) => await Controller.login(username,password))
}

module.exports = handlers
