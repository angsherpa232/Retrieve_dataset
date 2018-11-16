const Sherlock = require('sherlockjs');
const watson = require('./wat');
const date_validator = require("DateValidator").DateValidator;

function dateFormatter() {
	return this.getFullYear() + '-' + ('0'+(this.getMonth()+1)).slice(-2)+ '-' +(('0'+this.getDate()).slice(-2));
}

let parseTime = function (enteredTime,req, next, err) {
    const UTC_based = Sherlock.parse(enteredTime);
    console.log('the utc based is ', UTC_based)
        if (UTC_based.startDate === null) {
            const is_valid = date_validator.validate(UTC_based.startDate);
            console.log(is_valid);
            req.is_valid = is_valid;
            req.error = req.error;
            next()
        } else {
        if (!UTC_based.endDate){
            console.log('from htere')
            const localTZ_based_start = dateFormatter.call(new Date(UTC_based.startDate));
            const localTZ_based_end = null;
            req.startDate = localTZ_based_start;
            req.endDate = localTZ_based_end;
            req.full = UTC_based;
            req.error = err;
            req.is_valid = true;
            req.city = req.city;
            //console.log(UTC_based)
            next();
        } else {
            const localTZ_based_end = dateFormatter.call(new Date(UTC_based.endDate));
            const localTZ_based_start = dateFormatter.call(new Date(UTC_based.startDate));
            req.startDate = localTZ_based_start;
            req.endDate = localTZ_based_end;
            req.full = UTC_based;
            req.error = err;
            req.is_valid = true;
            req.city = req.city;
            // console.log(UTC_based)
            next();
        }
    }
}

let validateTime = function (req, res, next) {
        parseTime(req.params.time, req, next);
}

module.exports = {validateTime, parseTime};