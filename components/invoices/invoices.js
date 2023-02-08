const db = require('../../libraries/database.js');

class Invoices  {

	constructor(data) {
		
		for (const [key,value] of Object.entries(data)) {
			this[key] = value;
		}
	}
	
	static async get({idUser,id=false,orderBy = 'date Desc',limit=false}){
		
		if (!idUser) throw {"error":"bad-query","message":"idUser required"} 

		const aParams = [];
		const oSql = {
			select: `SELECT invoice.*`,
			join: ``,
			from: `FROM invoice`,
			where: `WHERE invoice.id_user = ?`,
			and: ``,
			order: ``,
			limit: ``
		}

		if(id !== false){
			oSql['and'] = `AND invoice.id = ?`;
			aParams.push(id);
		}
		if(orderBy !== false){
			oSql['order'] = `ORDER BY ${orderBy}`;
		}
		if(limit !== false){
			oSql['limit'] = `LIMIT ${limit}`;
		}

		const result = await db.query(`
			${oSql.select}
			${oSql.join}
			${oSql.from}
			${oSql.where}
			${oSql.and}
			${oSql.order}
			${oSql.limit}
		`,[idUser]
		);
		
		return new Invoices(result);
	}

	static async search({idUser,needle}){

		const result = await db.query(`
			SELECT * FROM invoice
			WHERE invoice.number = '${needle}'
			OR MONTH(invoice.date) = '${needle}'
			OR YEAR(invoice.date) = '${needle}'
		`,[idUser]
		);
		
		return new Invoices(result);

	}

}

module.exports = Invoices;
