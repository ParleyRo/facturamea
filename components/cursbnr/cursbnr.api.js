const xml2js = require('xml2js');
const moment = require('moment')

const HomeAPI = {
	get:{
		handler: async (request,reply) => {
			
			if(request.auth == null){
				return reply.redirect('/users/login');
			}
			const currency = (request.params.currency || 'eur').toLowerCase();

			const year = request.params.year;
			const month = ("0" + request.params.month).slice(-2);
			const day = ("0" + request.params.day).slice(-2);

			if(!moment(`${year}-${month}-${day}`, 'YYYY-MM-DD',true).isValid()){
				return{
					error:{
						msg: 'Invalid date format!'
					}
				}
			}

			const res = await fetch(
				`https://bnr.ro/files/xml/years/nbrfxrates${year}.xml`,
				{
					method: 'GET'
				}
			);
			const sCursBnr = await res.text();

			const oXmlParser = new xml2js.Parser(/* options */);

			const oCursBnr = await oXmlParser.parseStringPromise(sCursBnr);

			let rateDay = [];
			let oDate = new Date(year,parseInt(month)-1,day,2)
			let countDays = 1;

			while(!rateDay.length && (countDays <= 10)){

				rateDay = oCursBnr.DataSet.Body[0].Cube.filter(days => {
					return days['$']?.date === `${oDate.getFullYear()}-${('0'+(oDate.getMonth()+1)).slice(-2)}-${('0'+oDate.getDate()).slice(-2)}`;
				});

				if(!rateDay.length){
					oDate.setDate(oDate.getDate()-1);
				}
				countDays++;
			}

			if(!rateDay.length){
				return{
					error:{
						msg: 'Nothing found!'
					}
				}
			}

			const rate = rateDay[0].Rate.filter(rate => {
				return rate['$'].currency.toLowerCase() === currency
			});

			if(!rate.length){
				return{
					error:{
						msg: 'Nothing found!'
					}
				}
			}

			return {
				date: `${oDate.getFullYear()}-${('0'+(oDate.getMonth()+1)).slice(-2)}-${('0'+oDate.getDate()).slice(-2)}`,
				currency: currency,
				rate: parseFloat(rate[0]['_'])
			}
			

		},
		url:'/cursbnr/:year/:month/:day/:currency?'
	}

}
module.exports = HomeAPI;


