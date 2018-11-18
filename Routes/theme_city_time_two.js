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
function if_theme_first(route,next) {
    console.log('from theme first')
    const UTC_based = Sherlock.parse(route[0])
    if ((themed.includes((route.theme).toLowerCase()) && UTC_based.startDate != null)) return { time: route[0], theme_value: route.theme };
    if ((themed.includes((route.theme).toLowerCase()) && UTC_based.startDate === null)) return { cityName: route[0], theme_value: route.theme };
    return 'Check for typos in the parameters'
}

//@desc Theme entered as second parameter and Time as first
function if_theme_second(route) {
    console.log('from theme second')
    const UTC_based = Sherlock.parse(route.theme)
    if ((themed.includes(route[0].toLowerCase()) && UTC_based.startDate != null)) return { time: route.theme, theme_value: route[0] };
    if ((themed.includes(route[0].toLowerCase()) && UTC_based.startDate === null)) return { cityName: route.theme, theme_value: route[0] };
    return 'Check for typos in the parameters';
}

//@desc Time entered as first parameter and Theme not entered
function if_theme_not_entered(route) {
    console.log('from theme not entered')
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
    console.log('inside city')
    const fetchedCity = await getgeoJson(cityName, req, next);
    if (fetchedCity.data.length === 0) {
        req.error = 'Oops, typos in the parameter.'
        next();
    } else {
        try {
            const city = (fetchedCity.data)[1].geojson.coordinates;
            gfsModel.themeCity(city, theme_value, (err, file) => {
                if (!file || file.length === 0) {
                    if (Array.isArray(file)) {
                        req.length = file.length;
                        req.error = err;
                        next();
                    } else {
                        req.length = '0'
                        req.error = err;
                        next();
                    }
                } else {
                    req.data = file;
                    next()
                }
            });
        } catch (e) {
            req.length = '0'
            req.error = 'No file found in given city.'
            req.error = e;
            next();
        }
    }
}


//@desc Loads all the files for chosen theme within the city
async function getGeoJson(cityName, time, req, next, theme_value) {
    console.log('inside city time scope')
    const fetchedCity = await getgeoJson(cityName, req, next);
    if (fetchedCity.data.length === 0) {
        req.error = 'Oops, typos in the parameter.'
        next();
    } else {
        try {
            const city = (fetchedCity.data)[1].geojson.coordinates;
            req.city = city;
            req.theme_value = theme_value;
            parseTime(time, req, next, req.city, req.theme_value);
        } catch (e) {
            console.log('from two')
            req.length = '0'
            req.error = 'No file found in given city.'
            req.error = e;
            next();
        }
    }
}

//route GET > /theme/* 
//@desc Middleware for two parameter system. If the paramns contains "/" then it is redirected to 3 params route.
let theme_city = function (req, res, next) {
    if ((/\//g).test(req.params[0])) {
        next('route')
    }
    else {
    let cityName, theme_value, time;
    if (themed.includes((req.params.theme).toLowerCase())) {
        //Check if the radius is given or not. If true then nearby algorithm will be executed, if not else statement will be executed
        if (/[=]/g.test(req.params[0])) {
            console.log('aayo gorkhali')
            let radius_and_coord = req.params[0].split("&");
            let radius_text = radius_and_coord[0].match(/[a-zA-Z]/gi).join("")
            //Get the first element and search for numbers only (accepts decimal value as well)
            let radius_value = radius_and_coord[0].match((/(\d+\.)?\d+/g))[0]
            let coord_value = radius_and_coord[1].match((/(\d+\.)?\d+/g))
            let coord_text = radius_and_coord[1].match(/[a-zA-Z]*?,[a-zA-Z]*/gi)[0]
            let long = coord_value[0]
            let lat = coord_value[1]
            if (/^radius$/gi.test(radius_text) && (/^long,lat$/gi.test(coord_text))) {
                req.lat = lat;
                req.long = long;
                req.theme = req.params.theme;
                req.distance = radius_value;
                next()
            } else {
                req.error = 'Check for typos in the parameter';
                next()
            }
        
        } else {
        ({cityName,theme_value,...time} = if_theme_first(req.params))
        //Next time begin from this fn validateTime(time.time,next). Seems like validateTime has to be converted into 
        //independent function inside timevalidate.js file :D
        cityName ? file_within_city(cityName,theme_value,req,next) : parseTime(time.time,req,next,cityName,theme_value)
        }
    } else if (themed.includes(((req.params[0]).toLowerCase()))) {
        let {cityName,theme_value, ...time} = if_theme_second(req.params)
        console.log('The original theme is ',time)
        cityName ? file_within_city(cityName,theme_value,req,next) : parseTime(time.time,req,next,cityName,theme_value)
    } else {
        //run the code that checks between time and space
        let {cityName,theme_value, ...time} = if_theme_not_entered(req.params)
        //parseTime(time.time, cityName,req, next);
        getGeoJson(cityName,time.time,req,next,theme_value)
    }
}
}


module.exports = theme_city;