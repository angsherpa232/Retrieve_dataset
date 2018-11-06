const axios = require('axios');
//Model for GeoJSON
const gfsModel = require('../Models/gfModel');

//THEME ENLISTED
const themed = ['population','crime'];

let theme_city = function (req,res,next) {
    if (themed.includes(req.params.theme)){
        var cityName = req.params[0];
        var theme_value = req.params.theme;
    } else {
        var cityName = req.params.theme;
        var theme_value = req.params[0];
    }
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