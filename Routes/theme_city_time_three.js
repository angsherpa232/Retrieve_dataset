const axios = require('axios');
const Sherlock = require('sherlockjs');

//MODEL FOR GeoJSON
const gfsModel = require('../Models/gfModel');

//THEME ENLISTED
const themed = ['population', 'crime', 'migration','transport','economy','landuse','air quality'];

//MIDDLEWARE
const {parseTime} = require('./timevalidate');
const {getgeoJson} = require('../Middleware/fetch_geojson');

//@desc Theme entered as first parameter and Time as second
function if_theme_first(route) {
    const UTC_based = Sherlock.parse(route[0])
    if ((themed.includes((route.time).toLowerCase()) && UTC_based.startDate != null)) return { time: route[0], theme_value: route.time, cityName: route[1] };
    else if ((themed.includes((route.time).toLowerCase()) && UTC_based.startDate === null)) return { time: route[1],theme_value: route.time, cityName: route[0] };
    else console.log('Check for typos in the parameters')
}

//@desc Theme entered as second parameter and Time as first
function if_theme_second(route) {
    const UTC_based = Sherlock.parse(route.time)
    if ((themed.includes(route[0].toLowerCase()) && UTC_based.startDate != null)) return { time: route.time, theme_value: route[0], cityName: route[1] };
    if ((themed.includes(route[0].toLowerCase()) && UTC_based.startDate === null)) return { time: route[1], theme_value: route[0], cityName: route.time };
    return 'Check for typos in the parameters';
}

//@desc Time entered as first parameter and Theme not entered
function if_theme_third(route) {
    const UTC_based = Sherlock.parse(route[0])
    if ((themed.includes(route[1].toLowerCase()) && UTC_based.startDate != null)) return { time: route[0], theme_value: route[1], cityName: route.time };
    if ((themed.includes(route[1].toLowerCase()) && UTC_based.startDate === null)) return { time: route.time, theme_value: route[1], cityName: route[0] };
    return 'Check for typos in the parameters'
}

//@desc Aware the user about the potentiality of typos being a problem
function optimizer(req, next) {
    req.data = {
        'error': 'Check for typos in the parameters'
    }
    next()
}

//@desc Loads the geojson for city polygon
async function file_within_city_with_time(cityName, theme_value, time, req, next) {
    const fetchedCity = await getgeoJson(cityName, req, next);
    if (fetchedCity.data.length === 0) {
        req.error = 'Enter proper city Name.'
        req.theme_value = theme_value;
        parseTime(time, req, next);
    } else {
        try{
            req.city = (fetchedCity.data)[1].geojson.coordinates;
            req.theme_value = theme_value;
            parseTime(time, req, next,req.city,theme_value);
        } catch (e) {
            req.error = e;
            next()
        }
    }
}

//route GET > /theme/*/* 
//@desc Middleware for two parameter system
let three_param_route = function (req, res, next) {
    let time, theme_value, cityName;
    if (themed.includes((req.params.time).toLowerCase())) {
        ({time,theme_value,cityName} = if_theme_first(req.params))
        console.log('from theme first')
        
        file_within_city_with_time(cityName,theme_value,time, req,next)
        //gfsModel.themeCity(city, theme_value, (err, file)

        //cityName ? file_within_city(cityName,theme_value,req,next) : parseTime(time.time,req,next)
        //** NEED TO DEVELOP COMPLETELY NEW FUNCTION :D **/
    } else if (themed.includes(req.params[0])) {
        ({time, theme_value, cityName} = if_theme_second(req.params))
        //cityName ? file_within_city(cityName,theme_value,req,next) : parseTime(time.time,req,next)
        //** NEED TO DEVELOP COMPLETELY NEW FUNCTION :D **/
        console.log('from theme sec')
        file_within_city_with_time(cityName,theme_value,time, req,next)
    } else {
        //run the code that checks between time and space
        ({time, theme_value, cityName} = if_theme_third(req.params))
        //** NEED TO DEVELOP COMPLETELY NEW FUNCTION :D **/
        console.log('from theme third')
        file_within_city_with_time(cityName,theme_value,time, req,next)
    }
}


module.exports = three_param_route;