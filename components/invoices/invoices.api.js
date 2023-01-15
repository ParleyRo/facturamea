const Controller = require('./invoices.controller');
const View = require('../../middlewares/View.js');

const InvoicesAPI = {
	get:{
		handler: async (request,reply) => {
			
			if(request.auth == null){
				return reply.redirect('/',200);
			}

			return new View(request,reply)
			.send('invoices/index.eta',await Controller.getDefault({
				auth: request.auth
			}));

		},
		url:'/invoices'
	}

}
module.exports = InvoicesAPI;
