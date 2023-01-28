const Company = require('./company');

module.exports = {

	async getByType({idUser,type}){
		return await Company.getByType({id_user: idUser,type});
	},
	
	async getFieldsNamesByType(type){
		return await Company.getFieldsNamesByType(type);
	},

	async add(oData){
		return await Company.add(oData);
	}

}
