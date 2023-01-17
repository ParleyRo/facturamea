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

			const aData = {
				id_user: request.auth.user.id,
				type: request.params.type,
				name: request.body.companyName,
				data: JSON.stringify({
					companyName: request.body.companyName,
					companyRegistrationNumber: request.body.companyRegistrationNumber,
					VATNumber: request.body.VATNumber,
					Address: request.body.Address,
					Phone: request.body.Phone,
					Email: request.body.Email,
					Bank: request.body.Bank,
					Swift: request.body.Swift,
					Iban: request.body.Iban
				})
			}

			let response = Controller.addCompany(aData);

			return {
				state: 'success'
			}
		},
		url:'/settings/add/:type'
	
	}

}
module.exports = SettingsAPI;
