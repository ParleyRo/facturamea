let instance = null;
class Common {
	round(number = 0, decimals = 0) {
		return Number(`${Math.round(`${number}e+${decimals}`)}e-${decimals}`);
	}

    dateFormat(iTimestamp){
       
        function pad(n) {return n<10 ? "0"+n : n}

        const oDate = new Date(parseInt(iTimestamp))

        return pad(oDate.getDate())+', '
            + oDate.toLocaleString('default', { month: 'short' }) + ' '
            + oDate.getFullYear()
            // +pad(oDate.getMonth()+1)+dash
           
            // +oDate.getFullYear()+dash
            // +pad(oDate.getHours())+colon+
            // +pad(oDate.getMinutes())+colon+
            // +pad(oDate.getSeconds())
    }

	static getInstance() {
        if (!instance) {
            instance = new Common();
        }
        return instance;
    }
}
module.exports = Common.getInstance();
