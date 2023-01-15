const Controller = require('./users.controller');
const View = require('../../middlewares/View.js');

const UsersAPI = {
	getLogin:{
		handler: async (request,reply) => {
			
			if(request.auth != null){
				return reply.redirect('/',200);
			}

			return new View(request,reply)
			.setLayout('layouts/login.eta')
			.send('users/login.eta',await Controller.getDefault({
				auth: request.auth
			}));

		},
		url:'/users/login'
	},
	getUser:{
		handler: async (request,reply) => {

			const oUser = await Controller.getUserById(request.params.id);

			delete oUser.password;

			return oUser;
		},
		url:'/users/:id'
		
	}

}
module.exports = UsersAPI;


