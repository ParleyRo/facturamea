// const aws = require('./aws').getInstance();
const User = require('./user');


module.exports = {

	async getDefault(params) {
			
		const oData = {
			auth: params.auth,
		}

		return oData
	},
	async login(username,password) {
		
		if (!username) return  {
			"error":"username-required",
			"message":"Username is required"
		};

		if (!password) return {
			"error":"password-required",
			"message":"Password is required"
		};
		
		return await User.login(username,password);
	},
	async createUser(objValue = {}) {
		
		return await User.create(objValue);
	}
	
	

}
