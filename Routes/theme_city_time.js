const axios = require('axios');
const Sherlock = require('sherlockjs');
//Model for GeoJSON
const gfsModel = require('../Models/gfModel');

//THEME ENLISTED
const themed = ['population','crime'];

function get_city_theme(route) {
    if (themed.includes(route.theme)) return {cityName: route[0],theme_value:route.theme};
    return {cityName: route.theme, theme_value: route[0]};
}

//@desc Theme entered as first parameter and Time as second
function if_theme_first (route) {
    const UTC_based = Sherlock.parse(route[0])
    if ((themed.includes(route.theme) && UTC_based.startDate != null)) return {time: route[0],theme_value:route.theme};
    if ((themed.includes(route.theme) && UTC_based.startDate === null)) return {cityName: route[0],theme_value:route.theme};
    return 'nicht gut from 1'
}

//@desc Theme entered as second parameter and Time as first
function if_theme_second(route) {
     const UTC_based = Sherlock.parse(route.theme)
     if ((themed.includes(route[0]) && UTC_based.startDate != null)) return {time: route.theme,theme_value:route[0]};
     if ((themed.includes(route[0]) && UTC_based.startDate === null)) return {cityName: route.theme,theme_value:route[0]};
     return 'haha';
}

//@desc Time entered as first parameter and Theme not entered
function if_theme_not_entered (route) {
    const UTC_based = Sherlock.parse(route.theme)
    if (UTC_based.startDate != null) return {time: route.theme,cityName:route[0]};
    if (UTC_based.startDate === null) return {time:route[0],cityName: route.theme};
    return 'haha'
}


function hoho() {
    console.log('hoho')
}

function gogo() {
    console.log('gogo')
}


let theme_city = function (req,res,next) {
    if (themed.includes(req.params.theme)) {
        let holder = if_theme_first(req.params)
        console.log(holder)
    } else if (themed.includes(req.params[0])){
        let holder = if_theme_second(req.params)
        console.log(holder)
    } else {
        //run the code that checks between time and space
        let holder = if_theme_not_entered(req.params)
        console.log(holder)
    }
}
    // function (file_within_city) {
    //     let go = '';
    //      // let {cityName, theme_value} = get_city_theme(req.params);
    // // axios.get(`https://nominatim.openstreetmap.org/search.php?q=${cityName}&polygon_geojson=1&format=json`)
    // // .then((response) => {
    // //     const city = (response.data)[1].geojson.coordinates;
    // //     gfsModel.themeCity(city, theme_value, (err, file) => {
    // //         if (!file || file.length === 0) {
    // //              req.error = err
    // //              next()
    // //         }
    // //          req.data = file;
    // //          next()
    // //     })
    // // })
    // // .catch(error => {
    // //      res.send(error);
    // // });   
    // }
   
 

module.exports = theme_city;