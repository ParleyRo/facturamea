const db = require('../../libraries/database.js');
const BaseModel = require('../../abstracts/BaseModel.js');

class Settings extends BaseModel {
	constructor(result) {
		super(result);
	}

	static async addCompany(oData) {
		
		const result = await db.replace('company',oData);
		return new Settings({...oData,id:result.insertId});

    }

}

module.exports = Settings;
