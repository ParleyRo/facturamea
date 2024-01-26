const rpc = require('../../middlewares/Rpc');
const Invoice = require('./invoice');

module.exports = {

	async getDefault(params) {
			
		const oData = {
			auth: params.auth,
		}

		const oCompaniesData = await rpc.companies.getByType({
			idUser: params.auth?.user?.id,
			type: 'company'
		});

		oData['companiesData'] = {};
		for( let index in oCompaniesData){
			oData['companiesData'][oCompaniesData[index].id] = oCompaniesData[index]
		}

		const oBuyersData =await rpc.companies.getByType({
			idUser: params.auth?.user?.id,
			type: 'buyer'
		});

		oData['buyersData'] = {};
		for( let index in oBuyersData){
			oData['buyersData'][oBuyersData[index].id] = oBuyersData[index]
		}

		oData['availableFieldsCompany'] = await rpc.companies.getFieldsNamesByType('company');
		oData['availableFieldsBuyer'] = await rpc.companies.getFieldsNamesByType('buyer');

		oData['availableCurrencies'] = await Invoice.getCurrencies();
		
		const oInvoicesData = await rpc.invoices.get({
			idUser: params.auth?.user?.id,
			limit: 10
		});

		oData['invoicesData'] = {};
		for( let index in oInvoicesData){
			oData['invoicesData'][oInvoicesData[index].id] = oInvoicesData[index]
		}

		return oData
	},
	async getCurrencies(){
		return await Invoice.getCurrencies();
	},

	async add(oData){
		return await Invoice.add(oData);
	},

	async delete(id){
		return await Invoice.delete(id);
	},

	async generatePdf(data){
		
		const PdfPrinter = require('pdfmake');
		const fonts = {
			Roboto: {
				normal: 'web/assets/default/webfonts/Roboto-Regular.ttf',
				bold: 'web/assets/default/webfonts/Roboto-Medium.ttf',
				italics: 'web/assets/default/webfonts/Roboto-Italic.ttf',
				bolditalics: 'web/assets/default/webfonts/Roboto-MediumItalic.ttf',
			},
		};

		const printer = new PdfPrinter(fonts);
		
		const docDefinition = {

			footer: {
				columns: [
					{ text: `${data.companyData.companyName}\nAddress: ${data.companyData.Address}\nBank: ${data.companyData.Bank}`, style: 'documentFooterLeft' },
					{ text: `Company Registration Number: ${data.companyData.companyRegistrationNumber}\nPhone: ${data.companyData.Phone}\nSwift: ${data.companyData.Swift}`, style: 'documentFooterCenter' },
					{ text: `VAT Number: ${data.companyData.VATNumber}\nEmail: ${data.companyData.Email}\nIban: ${data.companyData.Iban}`, style: 'documentFooterRight' }
				]
			},
			content: [
				// Header
				{
					columns: [
							
						[
							{
								text: 'INVOICE / FACTURĂ', 
								style: ['invoiceTitle','isTurquoise'],
								width: '*'
							},
							{
								stack: [
									{
										columns: [
											{
												text:'Invoice Number / Numar Factura:', 
												style:'invoiceSubTitle',
												width: '*'
												
											}, 
											{
												text: `${data.invoiceData.number}`,
												style:'invoiceSubValue',
												width: 60
											}
										]
									},
									{
										columns: [
											{
												text:'Date Issued / Data Emitere:',
												style:'invoiceSubTitle',
												width: '*'
											}, 
											{
												text: (new Date(data.invoiceData.date)).toLocaleDateString('ro-RO',{year: "numeric", month: "numeric", day: "numeric"}),
												style:'invoiceSubValue',
												width: 60
											}
										]
									},
									{
										columns: [
											{
												text:'Due Date / Data Scadenta:',
												style:'invoiceSubTitle',
												width: '*'
											}, 
											{
												text:(new Date(data.invoiceData.dueDate)).toLocaleDateString('ro-RO',{year: "numeric", month: "numeric", day: "numeric"}),
												style:'invoiceSubValue',
												width: 60
											}
										]
									},
								]
							}
						],
					],
				},
				// Billing Headers
				{
					columns: [
						{
							text: '',
							style:'invoiceBillingTitle',
							
						},
						{
							text: 'Billing To',
							style:'invoiceBillingTitle',
							
						},
					]
				},
				// Billing Details
				{
					columns: [
						{
							text: {text: data.companyData[data.companyFieldsList[0]] + '\n', bold: true, fontSize: 12, style: ['isTurquoise'] },
							style: ['invoiceBillingDetails']
						},
						{
							text: {text: data.buyerData[data.companyFieldsList[0]] + '\n', bold: true, fontSize: 12, style: ['isTurquoise'] },
							style: 'invoiceBillingDetails'
						},
					]
				},
				{
					columns: [
						{
							 stack: data.companyFieldsList.slice(1).map(function (field,index) {
							 	
								if(data.companyData[field].trim() == ''){

									return '';
								}

								const fieldName = field.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
								const fieldNameFinal = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
								
								return { 
									text: [
										{ 
											text: fieldNameFinal + ': ', 
											bold: true 
										},
										data.companyData[field] + '\n'
									] 
								};

							}),
							style: ['invoiceBillingDetails']
						},
						{
							stack: data.buyerFieldsList.slice(1).map(function (field,index) {

								if(data.buyerData[field].trim() == ''){

									return '';
								}

								const fieldName = field.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
								const fieldNameFinal = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
								
								return { 
									text: [
										{ 
											text: fieldNameFinal + ': ',
											bold: true 
										},
										data.buyerData[field] + '\n'
									]
								};

							}),
							style: 'invoiceBillingDetails'
						},
					]
				},

				// Line breaks
				'\n\n',
				// Items
				{
					table: {
						// headers are automatically repeated if the table spans over multiple pages
						// you can declare how many rows should be treated as headers
						headerRows: 1,
						widths: [ '*', 40, 60, 60, 80 ],

						body: [
							// Table Header
							[ 
								{
									text: 'Description \n (Denumirea produselor sau a serviciilor)',
									style: ['itemsHeader','center']
								}, 
								{
									text: 'Unit \n (U.M.)',
									style: [ 'itemsHeader', 'center']
								},
								{
									text: 'Quantity \n (Cantitate)',
									style: [ 'itemsHeader', 'center']
								}, 
								{
									text:[
										`Unit price\n(-${data.currenciesList[data.invoiceData.currency].label}-)`,
										{
											text: data.invoiceData.currency != 'ron' ? '\n(-ron-)' : '',
											fontSize: 10
										}
									],
									style: [ 'itemsHeader', 'center']
								}, 
								{
									text: [
											`Total Amount \n (-${data.currenciesList[data.invoiceData.currency].label}-)`,
											{
												text: data.invoiceData.currency != 'ron' ? '\n(-ron-)' : '',
												fontSize: 10
											}
										],
									style: [ 'itemsHeader', 'center']
								} 
							],
							// Items
							...data.invoiceData.products.map(product=>{
								return [ 
									[
										{
											text: product.name,
											style:'itemTitle'
										},
										{
											text: product.description || '',
											style:'itemSubTitle'
											
										}
									], 
									{
										text: product.unit,
										style:'itemNumber'
									},
									{
										text: product.qty,
										style:'itemNumber'
									},  
									{
										text: [
											{
												text: parseFloat(product.amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
												bold: true
											},
											{
												text: data.invoiceData.currency != 'ron' ? '\n( '+parseFloat(product.amount * data.invoiceData.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' )' : '',
												fontSize: 10
											}
										],
										style:'itemNumber'
									}, 
									{
										text: [
											{
												text: (product.qty * product.amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
												bold: true
											},
											{
												text: data.invoiceData.currency != 'ron' ? '\n( '+parseFloat(product.qty * product.amount * data.invoiceData.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' )' : '',
												fontSize: 10
											}
										],
										style:'itemTotal'
									} 
								]
							})
						]
						// END Items
						
					}, // table
				//  layout: 'lightHorizontalLines'
				},
				// TOTAL
				{
					table: {
					// headers are automatically repeated if the table spans over multiple pages
					// you can declare how many rows should be treated as headers
					headerRows: 0,
					widths: [ '*', 80 ],

					body: [
						[ 
							{
								text:[
									{
										text: `Invoice Total -${data.currenciesList[data.invoiceData.currency].label}-`,
										bold: true
									},
									{
										text: data.invoiceData.currency != 'ron' ? '\n(Valoare totală de plată factura curentă -RON-)' : '',
										fontSize: 10
									}
								],
								style:'itemsFooterTotalTitle'
							}, 
							{
								text: [
									{
										text: data.currenciesList[data.invoiceData.currency].symbol + data.invoiceData.products.reduce(function (total, product) { return total + (product.qty * product.amount); }, 0).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
										bold: true
									},
									{
										text: data.invoiceData.currency != 'ron' ? '\n( ' + data.currenciesList['ron'].symbol + ' ' + data.invoiceData.products.reduce(function (total, product) { return total + (product.qty * product.amount * data.invoiceData.rate); }, 0).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' )': '',
										fontSize: 10
									}
								],
								style:'itemsFooterTotalValue'
							}
						],
					]
					}, // table
					layout: 'lightHorizontalLines'
				},
			],
			styles: {
				// Document Header
				documentHeaderLeft: {
					fontSize: 7,
					margin: [5,5,5,5],
					alignment:'left'
				},
				documentHeaderCenter: {
					fontSize: 7,
					margin: [5,5,5,5],
					alignment:'left'
				},
				documentHeaderRight: {
					fontSize: 7,
					margin: [5,5,5,5],
					alignment:'left'
				},
				// Document Footer
				documentFooterLeft: {
					fontSize: 7,
					margin: [25,5,5,5],
					alignment:'left'
				},
				documentFooterCenter: {
					fontSize: 7,
					margin: [5,5,5,5],
					alignment:'left'
				},
				documentFooterRight: {
					fontSize: 7,
					margin: [5,5,5,5],
					alignment:'left'
				},
				// Invoice Title
				invoiceTitle: {
					fontSize: 18,
					bold: true,
					alignment:'right',
					margin:[0,0,0,15]
				},
				// Invoice Details
				invoiceSubTitle: {
					fontSize: 10,
					alignment:'right'
				},
				invoiceSubValue: {
					fontSize: 10,
					alignment:'right'
				},
				// Billing Headers
				invoiceBillingTitle: {
					fontSize: 10,
					bold: true,
					alignment:'left',
					margin:[0,20,0,5],
				},
				// Billing Details
				invoiceBillingDetails: {
					fontSize: 10,
					alignment:'left'

				},
				invoiceBillingAddressTitle: {
					margin: [0,7,0,3],
					bold: true
				},
				invoiceBillingAddress: {
					
				},
				// Items Header
				itemsHeader: {
					margin: [0,5,0,5],
					bold: true
				},
				// Item Title
				itemTitle: {
					margin: [0,5,0,5],
					fontSize: 12
					// bold: true,
				},
				itemSubTitle: {
					italics: true,
					fontSize: 10
				},
				itemNumber: {
					margin: [0,5,0,5],
					alignment: 'center',
				},
				itemTotal: {
					margin: [0,5,0,5],
					bold: true,
					alignment: 'center',
				},

				// Items Footer (Subtotal, Total, Tax, etc)
				itemsFooterSubTitle: {
					margin: [0,5,0,5],
					bold: true,
					alignment:'right',
				},
				itemsFooterSubValue: {
					margin: [0,5,0,5],
					bold: true,
					alignment:'center',
				},
				itemsFooterTotalTitle: {
					margin: [0,5,0,5],
					alignment:'right',
				},
				itemsFooterTotalValue: {
					margin: [0,5,0,5],
					alignment:'center',
				},
				signaturePlaceholder: {
					margin: [0,70,0,0],   
				},
				signatureName: {
					bold: true,
					alignment:'center',
				},
				signatureJobTitle: {
					italics: true,
					fontSize: 10,
					alignment:'center',
				},
				notesTitle: {
					fontSize: 10,
					bold: true,  
					margin: [0,50,0,3],
				},
				notesText: {
					fontSize: 10
				},
				center: {
					alignment:'center',
				},
				isTurquoise: {
					color: '#358b9d'
				}
			},
			defaultStyle: {
				columnGap: 20,
			}
		};

		const options = {
			// ... your options
		};

		const pdfDoc = printer.createPdfKitDocument(docDefinition, options);

		return new Promise((resolve, reject) => {

			const chunks = [];
			
			pdfDoc.on('data', function (chunk) {
				chunks.push(chunk);
			});

			pdfDoc.on('end', function () {
				const result = Buffer.concat(chunks);
				resolve(result);
			});

			pdfDoc.on('error', function (error) {
				reject(error);
			});

			pdfDoc.end();
		});

	}

}
