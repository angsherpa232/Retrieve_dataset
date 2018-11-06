const axios = require('axios');
//Model for GeoJSON
const gfsModel = require('../Models/gfModel');

//THEME ENLISTED
const themed = ['population','crime'];

function get_city_theme(route) {
    if (themed.includes(route.theme)) return {cityName: route[0],theme_value:route.theme};
    return {cityName: route.theme, theme_value: route[0]};
}

let theme_city = function (req,res,next) {
    let {cityName, theme_value} = get_city_theme(req.params);
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

module.exports = theme_city;