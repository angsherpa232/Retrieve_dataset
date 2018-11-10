const axios = require('axios');
const Sherlock = require('sherlockjs');

//MODEL FOR GeoJSON
const gfsModel = require('../Models/gfModel');

//THEME ENLISTED
const themed = ['population', 'crime'];

//MIDDLEWARE
const {parseTime} = require('./timevalidate');


//@desc Theme entered as first parameter and Time as second
function if_theme_first(route) {
    const UTC_based = Sherlock.parse(route[0])
    if ((themed.includes(route.time) && UTC_based.startDate != null)) return { time: route[0], theme_value: route.time, cityName: route[1] };
    else if ((themed.includes(route.time) && UTC_based.startDate === null)) return { time: route[1],theme_value: route.time, cityName: route[0] };
    else console.log('Check for typos in the parameters')
}

//@desc Theme entered as second parameter and Time as first
function if_theme_second(route) {
    const UTC_based = Sherlock.parse(route.time)
    if ((themed.includes(route[0]) && UTC_based.startDate != null)) return { time: route.time, theme_value: route[0], cityName: route[1] };
    if ((themed.includes(route[0]) && UTC_based.startDate === null)) return { time: route[1], theme_value: route[0], cityName: route.time };
    return 'Check for typos in the parameters';
}

//@desc Time entered as first parameter and Theme not entered
function if_theme_third(route) {
    const UTC_based = Sherlock.parse(route[0])
    if ((themed.includes(route[1]) && UTC_based.startDate != null)) return { time: route[0], theme_value: route[1], cityName: route.time };
    if ((themed.includes(route[1]) && UTC_based.startDate === null)) return { time: route.time, theme_value: route[1], cityName: route[0] };
    return 'Check for typos in the parameters'
}

//@desc Aware the user about the potentiality of typos being a problem
function optimizer(req, next) {
    req.data = {
        'error': 'Check for typos in the parameters'
    }
    next()
}

//@desc Loads all the files for chosen theme within the city
function file_within_city(cityName, theme_value, req, next) {
    axios.get(`https://nominatim.openstreetmap.org/search.php?q=${cityName}&polygon_geojson=1&format=json`)
        .then((response) => {
            const city = (response.data)[1].geojson.coordinates;
            gfsModel.themeCity(city, theme_value, (err, file) => {
                if (!file || file.length === 0) {
                    req.error = err
                    next()
                }
                req.data = file;
                next()
            })
        })
        .catch(error => {
            res.send(error);
        });
}

//@desc Loads all the files for chosen theme within the city
function file_within_city_with_time (cityName, theme_value, time, req, next) {
    axios.get(`https://nominatim.openstreetmap.org/search.php?q=${cityName}&polygon_geojson=1&format=json`)
        .then((response) => {
            const city = (response.data)[1].geojson.coordinates;
            req.city = city;
            req.theme_value = theme_value;
            parseTime(time,req,next)
        })
        .catch(error => {
            req.error = error;
            next();
        });
}

//route GET > /theme/*/* 
//@desc Middleware for two parameter system
let three_param_route = function (req, res, next) {
    let time, theme_value, cityName;
    if (themed.includes(req.params.time)) {
        ({time,theme_value,cityName} = if_theme_first(req.params))
        console.log('from theme first')
        if (time || theme_value || cityName === 'undefined') console.log('typos man')
        file_within_city_with_time(cityName,theme_value,time, req,next)
        //gfsModel.themeCity(city, theme_value, (err, file)

        //cityName ? file_within_city(cityName,theme_value,req,next) : parseTime(time.time,req,next)
        //** NEED TO DEVELOP COMPLETELY NEW FUNCTION :D **/
    } else if (themed.includes(req.params[0])) {
        let {time, theme_value, cityName} = if_theme_second(req.params)
        //cityName ? file_within_city(cityName,theme_value,req,next) : parseTime(time.time,req,next)
        //** NEED TO DEVELOP COMPLETELY NEW FUNCTION :D **/
        console.log('from theme sec')
        console.log(time,theme_value,cityName)
    } else {
        //run the code that checks between time and space
        let {time, theme_value, cityName} = if_theme_third(req.params)
        //** NEED TO DEVELOP COMPLETELY NEW FUNCTION :D **/
        console.log('from theme third')
        console.log(time,theme_value,cityName)
        if (time || theme_value || cityName === 'undefined') console.log('typos man')
    }
}


module.exports = three_param_route;