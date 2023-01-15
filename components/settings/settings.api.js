const Controller = require('./settings.controller');
const View = require('../../middlewares/View.js');

const SettingsAPI = {
	get:{
		handler: async (request,reply) => {
			
			if(request.auth == null){
				return reply.redirect('/',200);
			}

			return new View(request,reply)
			.send('settings/index.eta',await Controller.getDefault({
				auth: request.auth
			}));

		},
		url:'/settings'
	}

}
module.exports = SettingsAPI;
