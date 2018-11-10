const gfsModel = require('../Models/gfModel');

let testing = function (req,res) {
    // console.log('from test ',req.city)
    // console.log('from test date',req.startDate)
    console.log('theme', req.theme_value)
    console.log('time ', req.startDate)
    gfsModel.filterTimeThemeSpace(req.startDate, req.theme_value, req.city, (err, file) => {
        if (err) status(400).json({'err': req.err});
        res.send(file)
    })
}

module.exports = testing;