const Controller = require('./invoice.controller');
const View = require('../../middlewares/View.js');

var pdf = require("pdf-creator-node");
var fs = require("fs");

const InvoiceAPI = {
	get:{
		handler: async (request,reply) => {
			
			if(request.auth == null){
				return reply.redirect('/users/login');
			}

// 			const filePath = require('path').join(
//     __dirname,
//     '../../output.pdf'
//   );

// 			const stream = require('fs').createReadStream(filePath)
//   reply.header(
//     'Content-Disposition',
//     'attachment; filename=foo.pdf'
//   )
//   return reply.send(stream).type('application/sql').code(200);


			// Read HTML Template
			var view = new View(request,reply)
			.setLayout('layouts/clean.eta')
			.addCss('invoice.css')
			.render('../invoice/invoice_rendered.html',await Controller.getDefault({
				auth: request.auth
			}))

			
			const html = await view;

			var options = {
				format: "A4",
				orientation: "portrait"
			}
			var document = {
				html: html,
				data: {
					
				},
				path: "./output.pdf",
				type: "",
			};
			
			pdf
			.create(document, options)
			.then((res) => {
				console.log(res);
			})
			.catch((error) => {
				console.error(error);
			});
return reply
.headers({'content-type': 'text/html; charset=utf-8'})
.send(html)
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
