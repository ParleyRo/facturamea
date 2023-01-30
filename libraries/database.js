const mysql = require(`mysql2/promise`);
const config = require('../config.js') // eslint-disable-line node/no-unpublished-require

let instance = false;

class Database {

	constructor(conn = false) {
		if (conn) this.connection = conn
	}

	async connect() {
		this.connection = await mysql.createPool({
			host: config.db.host,
			user: config.db.username,
			password: config.db.password,
			database: config.db.database,
			port: config.db.port,
			connectionLimit: 10,
			waitForConnections: true,
			queueLimit: 0,
			decimalNumbers: true,
			bigNumberStrings:true,
			supportBigNumbers:true,
			timezone: '+00:00'
		});

		this.connection.on(`error`, (err) => {
			console.error(`Connection error ${err.code}`);
			this.connect();
		});

	}

	async getRow(sSql,oParams) {
		try {
			const [oResult] = await this.connection.query([sSql,'limit 1'].join(' '),oParams)
			if (!oResult.length) return false;

			return oResult[0];
		} catch (err) {
			console.log(err,sSql);
			throw new Error("Error on row")
		}
		
	}

	async getScalar(sSql,oParams,position = 0) {
		try {
			const oResult = await this.getRow(sSql,oParams);
			if (!oResult) return false;
			return oResult[position];
		} catch (err) {
			console.log(err);
			throw new Error("Error on scalar")
		}
		
	}

	async query(strQuery,oParams) {
		try {
			const [oResult] = await this.connection.query(strQuery,oParams);
			return oResult;
		} catch (err) {
			console.log(err);
			throw new Error("Error on query")
		}
		
	}

	async insert(sTable,oParams) {

		const aUpdate = [];

		for (const [key,value] of Object.entries(oParams)) {
			aUpdate.push(`${key}=VALUES(${key})`);
		}

		try {
			const [oResult] = await this.connection.query(`INSERT INTO ${sTable} SET ? ON DUPLICATE KEY UPDATE ${aUpdate.join(',')}`,oParams);
			return oResult;
			
		} catch (err) {
			console.log('database.insert',err);
			throw new Error("Error on insert")
		}
	}

	async replace(sTable,oParams) {
		try {
			const [oResult] = await this.connection.query(`REPLACE INTO ${sTable} SET ?`,oParams);
			return oResult;
			
		} catch (err) {
			console.log('database.insert',err);
			throw new Error("Error on insert")
		}
	}

	async delete(sTable,oWhere) {
		try {
			const [oResult] = await this.connection.query(`DELETE FROM ${sTable} WHERE ?`,oWhere);
			return oResult;
		} catch (err) {
			console.log('database.delete',err);
			throw new Error("Error on delete")
		}
	}

	async update(sTable,oParams,oWhere) {
		try {
			const aSet = [];
			const aWhere = [];
			const aValues = [];

			for (const [key,value] of Object.entries(oParams)) {
				aSet.push(`${key}=?`);
				aValues.push(value);
			}
			for (const [key,value] of Object.entries(oWhere)) {
				aWhere.push(`${key}=?`);
				aValues.push(value);
			}
			const [oResult] =  await this.connection.query([`UPDATE ${sTable} SET`,aSet.join(','),`WHERE`,aWhere.join(' AND ')].join(' '),aValues);
			return oResult;
			
		} catch (err) {
			console.log(err);
			throw new Error("Error on update")
		}
		
	}

	async beginTransaction() {
		const oResult = await this.connection.getConnection()
		await oResult.beginTransaction()

		return new Database(oResult)
	}

	async commit() {
		return await this.connection.commit()
	}

	async rollback() {
		return await this.connection.rollback()
	}

	async release() {
		return await this.connection.release()
	}

	/**
	* returns a singleton for the class
	* @constructs Database
	* @return {Database}
	*/
	static getInstance() {
		if (!instance) {
			instance = new Database();
		}
		return instance;
	}

}

module.exports = Database.getInstance();
