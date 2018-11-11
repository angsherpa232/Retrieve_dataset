const axios = require('axios');
const Sherlock = require('sherlockjs');

//MODEL FOR GeoJSON
const gfsModel = require('../Models/gfModel');

//THEME ENLISTED
const themed = ['population', 'crime'];

//MIDDLEWARE
const {parseTime} = require('./timevalidate');
const {getgeoJson} = require('../Middleware/fetch_geojson');

//@desc Theme entered as first parameter and Time as second
function if_theme_first(route) {
    const UTC_based = Sherlock.parse(route[0])
    if ((themed.includes(route.theme) && UTC_based.startDate != null)) return { time: route[0], theme_value: route.theme };
    if ((themed.includes(route.theme) && UTC_based.startDate === null)) return { cityName: route[0], theme_value: route.theme };
    return 'Check for typos in the parameters'
}

//@desc Theme entered as second parameter and Time as first
function if_theme_second(route) {
    const UTC_based = Sherlock.parse(route.theme)
    if ((themed.includes(route[0]) && UTC_based.startDate != null)) return { time: route.theme, theme_value: route[0] };
    if ((themed.includes(route[0]) && UTC_based.startDate === null)) return { cityName: route.theme, theme_value: route[0] };
    return 'Check for typos in the parameters';
}

//@desc Time entered as first parameter and Theme not entered
function if_theme_not_entered(route) {
    const UTC_based = Sherlock.parse(route.theme)
    if (UTC_based.startDate != null) return { time: route.theme, cityName: route[0] };
    if (UTC_based.startDate === null) return { time: route[0], cityName: route.theme };
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
async function file_within_city(cityName, theme_value, req, next) {
    const fetchedCity = await getgeoJson(cityName, req, next);
    const city = (fetchedCity.data)[1].geojson.coordinates;
    gfsModel.themeCity(city, theme_value, (err, file) => {
        if (!file || file.length === 0) {
            req.error = err
            next()
        }
        req.data = file;
        next()
    });
}

//route GET > /theme/* 
//@desc Middleware for two parameter system
let theme_city = function (req, res, next) {
    if ((/\//g).test(req.params[0])) {
        next('route')
    }
    else {
    let cityName, theme_value, time;
    if (themed.includes(req.params.theme)) {
        ({cityName,theme_value,...time} = if_theme_first(req.params))
        //Next time begin from this fn validateTime(time.time,next). Seems like validateTime has to be converted into 
        //independent function inside timevalidate.js file :D
        cityName ? file_within_city(cityName,theme_value,req,next) : parseTime(time.time,req,next)
    } else if (themed.includes(req.params[0])) {
        let {cityName,theme_value, ...time} = if_theme_second(req.params)
        cityName ? file_within_city(cityName,theme_value,req,next) : parseTime(time.time,req,next)
    } else {
        //run the code that checks between time and space
        let {cityName,theme_value, ...time} = if_theme_not_entered(req.params)
        parseTime(time.time, req, next);
    }
    }
}


module.exports = theme_city;