const Controller = require('./invoice.controller');
const View = require('../../middlewares/View.js');
const InvoiceAPI = {
	get: {
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
	postAdd: {
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
				rate: request.body.rate,
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

	deleteInvoice: {
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
	},

	postPdf: {
	
		handler: async (request, reply) => {

			try {
				if (request.auth == null) {
					return reply.redirect('/', 200);
				}

				// console.log(request.body)
				// return;
				const fileName = `temp_${Date.now()}.pdf`;
				
				const pdfBuffer = await Controller.generatePdf(request.body);
				
				// Set the appropriate headers for the response
				reply.header('Content-Type', 'application/pdf');
				reply.header('Content-Disposition', `attachment; filename="${fileName}"`);

				// Send the PDF buffer as the response
				reply.send(pdfBuffer);
				

			} catch (error) {
				console.error('Handler error:', error);
				reply.status(500).send('Internal Server Error');
			}

		},
		url:'/invoice/pdf'
	}
}
module.exports = InvoiceAPI;
