const db = require('../../libraries/database.js');

class Invoice  {

	constructor(data) {

		for (const [key,value] of Object.entries(data)) {
			this[key] = value;
		}
	}
	
	static async getCurrencies(){
		return {
			ron: {
				symbol: 'lei',
				code: 'lei',
				label: 'RON'
			},
			eur: {
				symbol: '€',
				code: '&euro;',
				label: 'EUR'
			},
			usd: {
				symbol: '$',
				code: '&dollar;',
				label: 'USD'
			}
		}
	}

	static async add(oData) {

		const result = await db.insert('invoice',oData);
		
		return new Invoice({...oData,id:result.insertId});

    }

}

module.exports = Invoice;
