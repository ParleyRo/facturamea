const rpc = require('../../middlewares/Rpc');
const Invoice = require('./invoice');

module.exports = {

	async getDefault(params) {
			
		const oData = {
			auth: params.auth,
		}

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

		oData['availableCurrencies'] = await Invoice.getCurrencies();
		
		return oData
	},

	async add(oData){
		return await Invoice.add(oData);
	}


}
