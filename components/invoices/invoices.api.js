const Controller = require('./invoices.controller');
const View = require('../../middlewares/View.js');

const InvoicesAPI = {
	get:{
		handler: async (request,reply) => {
			
			if(request.auth == null){
				return reply.redirect('/',200);
			}

			return new View(request,reply)
			.addCss('invoice.css')
			.addCss('colors.css')
			.addCss('bulma-calendar.min.css')
			.addJs('bulma-calendar.min.js')
			.send('invoices/index.eta',await Controller.getDefault({
				auth: request.auth
			}));

		},
		url:'/invoices'
	},
	getSearch: {
		handler: async (request,reply) => {

			if(request.auth == null){
				return reply.redirect('/',200);
			}
			
			const response = await Controller.search({
				idUser: request.auth.user.id,
				needle: request.params.needle
			});
			
			return {
				state: 'success',
				data: response
			}
		},
		url:'/invoices/search/:needle'
	}

}
module.exports = InvoicesAPI;
