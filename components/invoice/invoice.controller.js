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
	}


}
