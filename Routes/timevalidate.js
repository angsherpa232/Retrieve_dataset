const Sherlock = require('sherlockjs');


function dateFormatter() {
	return this.getFullYear() + '-' + ('0'+(this.getMonth()+1)).slice(-2)+ '-' +(('0'+this.getDate()).slice(-2));
}

let validateTime = function (req, res, next) {
    const UTC_based = Sherlock.parse(req.params.time);
    if (!UTC_based.endDate){
        var localTZ_based_start = dateFormatter.call(new Date(UTC_based.startDate));
        var localTZ_based_end = null;
    } else {
        var localTZ_based_end = dateFormatter.call(new Date(UTC_based.endDate));
        var localTZ_based_start = dateFormatter.call(new Date(UTC_based.startDate));
    }

    req.startDate = localTZ_based_start;
    req.endDate = localTZ_based_end;
    req.full = UTC_based;
    next();
}

module.exports = validateTime;