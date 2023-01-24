const Controller = require('./invoice.controller');
const View = require('../../middlewares/View.js');

const InvoiceAPI = {
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
			.send('invoice/index.eta',await Controller.getDefault({
				auth: request.auth
			}));

		},
		url:'/invoice'
	}

}
module.exports = InvoiceAPI;
