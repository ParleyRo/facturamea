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
	},
	postAdd:{
		handler: async (request,reply) => {

			if(request.auth == null){
				return reply.redirect('/',200);
			}

			const data = {};
			for(let field in request.body){
				data[field] = request.body[field];
			}

			const oData = {
				id_user: request.auth.user.id,
				type: request.params.type,
				name: request.body.companyName,
				data: JSON.stringify(data)
			}

			const response = await Controller.addCompany(oData);
			return {
				state: 'success',
				data: response
			}
		},
		url:'/settings/add/:type'
	
	}

}
module.exports = SettingsAPI;
