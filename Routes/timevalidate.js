const Sherlock = require('sherlockjs');
const watson = require('./wat');
const date_validator = require("DateValidator").DateValidator;

//A formatter that is used when only startDate is given
function dateFormatter() {
	return this.getFullYear() + '-' + ('0'+(this.getMonth()+1)).slice(-2)+ '-' +(('0'+this.getDate()).slice(-2));
}

//A formatter for endDate. It adds 1 day from given end day to satisfy mongo less than query
function dateFormatterEnd() {
	return this.getFullYear() + '-' + ('0'+(this.getMonth()+1)).slice(-2)+ '-' +(('0'+(this.getDate()+1)).slice(-2));
}

//A formatter for startDate. It reduces 1 day from given start day to satisfy mongo greater than query
function dateFormatterStart() {
	return this.getFullYear() + '-' + ('0'+(this.getMonth()+1)).slice(-2)+ '-' +(('0'+(this.getDate()-1)).slice(-2));
}

let parseTime = function (enteredTime,req, next, city,theme_value) {
    const UTC_based = Sherlock.parse(enteredTime);
    console.log('the utc based is ', UTC_based)
        if (UTC_based.startDate === null) {
            const is_valid = date_validator.validate(UTC_based.startDate);
            req.is_valid = is_valid;
            next()
        } else {
        if (!UTC_based.endDate){
            console.log('from not end date')
            const localTZ_based_start = dateFormatter.call(new Date(UTC_based.startDate));
            const localTZ_based_end = null;
            req.startDate = localTZ_based_start;
            req.endDate = localTZ_based_end;
            req.full = UTC_based;
            req.is_valid = true;
            req.city = city;
            req.theme_value = theme_value;
            next();
        } else if (UTC_based.endDate){
            console.log('from with end date')
            const localTZ_based_end = dateFormatterEnd.call(new Date(UTC_based.endDate));
            const localTZ_based_start = dateFormatterStart.call(new Date(UTC_based.startDate));
            req.startDate = localTZ_based_start;
            req.endDate = localTZ_based_end;
            req.full = UTC_based;
            req.is_valid = true;
            req.city = city;
            req.theme_value = theme_value;
            next();
        }
    }
}

let validateTime = function (req, res, next) {
        parseTime(req.params.time, req, next);
}

module.exports = {validateTime, parseTime};