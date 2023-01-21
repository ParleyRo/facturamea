const Companies = require('./companies');

module.exports = {

	async getByType({idUser,type}){
		return await Companies.getByType({id_user: idUser,type});
	},
	
	async getFieldsNamesByType(type){
		return await Companies.getFieldsNamesByType(type);
	},

	async add(oData){
		return await Companies.add(oData);
	}

}
