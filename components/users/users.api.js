const Controller = require('./users.controller');
const View = require('../../middlewares/View.js');

const UsersAPI = {
	getLogin:{
		handler: async (request,reply) => {
			
			if(request.auth != null){
				return reply.redirect('/',200);
			}

			return new View(request,reply)
			.setLayout('layouts/clean.eta')
			.send('users/login.eta',await Controller.getDefault({
				auth: request.auth
			}));

		},
		url:'/users/login'
	}

}
module.exports = UsersAPI;


