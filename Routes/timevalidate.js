const Sherlock = require('sherlockjs');

let validateTime = function (req, res, next) {
    const UTC_based = Sherlock.parse(req.params.time);
    if (!UTC_based.endDate){
        var localTZ_based_start = new Date(UTC_based.startDate).toLocaleString('de-DE', {
            timeZone: 'Europe/Berlin'
          });
        var localTZ_based_end = null;
    } else {
        var localTZ_based_end = new Date(UTC_based.endDate).toLocaleString('de-DE', {
            timeZone: 'Europe/Berlin'
          });
          var localTZ_based_start = new Date(UTC_based.startDate).toLocaleString('de-DE', {
            timeZone: 'Europe/Berlin'
          });
    }

    req.startDate = localTZ_based_start;
    req.endDate = localTZ_based_end;
    req.full = UTC_based;
    next();
}

module.exports = validateTime;