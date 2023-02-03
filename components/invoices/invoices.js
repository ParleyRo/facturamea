const db = require('../../libraries/database.js');

class Invoices  {

	constructor(data) {

		for (const [key,value] of Object.entries(data)) {
			this[key] = value;
		}
	}
	
	static async get({idUser}){
		
		if (!idUser) throw {"error":"bad-query","message":"idUser required"} 

		const result = await db.query("SELECT * FROM invoice WHERE id_user = ? ORDER BY date DESC",[idUser]);
		
		return new Invoices(result);
	}

}

module.exports = Invoices;
