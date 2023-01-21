const db = require('../../libraries/database.js');

class Companies  {

	constructor(data) {

		for (const [key,value] of Object.entries(data)) {
			this[key] = value;
		}
	}
	
	static async getByType({id_user,type}){

		if (!id_user) throw {"error":"bad-query","message":"id_user required"} 

		const result = await db.query("SELECT * FROM company WHERE id_user = ? AND type=? ORDER BY id DESC",[id_user,type]);
		
		return new Companies(result);
	}

	static async getFieldsNamesByType(type){

		if(type === 'company'){
			return [
				'companyName','companyRegistrationNumber','VATNumber',
				'Address','Phone','Email','Bank','Swift','Iban'
			];
		}

		if(type === 'buyer'){
			return [
				'companyName','companyRegistrationNumber','VATNumber',
				'Address','Phone','Email','Bank','Swift','Iban'
			];
		}

		return [];
	}

	static async add(oData) {
		
		const result = await db.replace('company',oData);
		
		return new Companies({...oData,id:result.insertId});

    }

}

module.exports = Companies;
