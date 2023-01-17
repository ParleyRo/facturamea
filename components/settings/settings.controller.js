const Settings = require('./settings');

module.exports = {

	async getDefault(params) {
			
		const oData = {
			auth: params.auth,
		}

		return oData
	},

	async addCompany(oData){

		return await Settings.addCompany(oData);
	
	}

}
