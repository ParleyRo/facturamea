const Invoices = require('./invoices');
const rpc = require('../../middlewares/Rpc');

module.exports = {

	async getDefault(params) {
			
		const oData = {
			auth: params.auth,
		}

		oData['invoicesData'] = await Invoices.get({
			idUser: params.auth?.user?.id
		});

		oData['companiesData'] = {};

		const oCompaniesData = await rpc.companies.getByType({idUser: params.auth?.user?.id, type: 'company'});

		for( let index in oCompaniesData){
			oData['companiesData'][oCompaniesData[index].id] = oCompaniesData[index]
		}

		oData['buyersData'] = {};

		const oBuyersData =await rpc.companies.getByType({idUser: params.auth?.user?.id, type: 'buyer'});

		for( let index in oBuyersData){
			oData['buyersData'][oBuyersData[index].id] = oBuyersData[index]
		}
		
		oData['availableFieldsCompany'] = await rpc.companies.getFieldsNamesByType('company');
		oData['availableFieldsBuyer'] = await rpc.companies.getFieldsNamesByType('buyer');

		oData['availableCurrencies'] = await rpc.invoice.getCurrencies();

		return oData
	},
	async get({idUser,limit = false,id = false,orderBy = 'date Desc'}){
		return await Invoices.get({idUser,limit,id,orderBy})
	},
	async search({idUser,needle}){
		return await Invoices.search({idUser,needle})
	}


}
