const Controller = require('./invoice.controller');
const View = require('../../middlewares/View.js');
const InvoiceAPI = {
	get:{
		handler: async (request,reply) => {
			
			if(request.auth == null){
				return reply.redirect('/users/login');
			}

			return new View(request,reply)
			.addCss('invoice.css')
			.addCss('bulma-calendar.min.css')
			.addJs('bulma-calendar.min.js')
			.send('invoice/index.eta',await Controller.getDefault({
				auth: request.auth
			}));

		},
		url:'/'
	},
	postAdd:{
		handler: async (request,reply) => {

			if(request.auth == null){
				return reply.redirect('/',200);
			}

			const oData = {
				id_user: request.auth.user.id,
				id_company: request.body.id_company,
				id_buyer: request.body.id_buyer,
				number: request.body.number,
				currency: request.body.currency,
				date: new Date(request.body.date),
				due_date: new Date(request.body.due_date),
				products: JSON.stringify(request.body.products)
			};

			const response = await Controller.add(oData);
			
			return {
				state: 'success',
				data: response
			}
		},
		url:'/invoice/'
	},

	deleteInvoice:{
		handler: async (request,reply) => {

			if(request.auth == null){
				return reply.redirect('/',200);
			}
			
			const response = await Controller.delete(request.params.id);
			
			return {
				state: 'success',
				data: response
			}
		},
		url:'/invoice/:id'
	}
}
module.exports = InvoiceAPI;
