const axios = require('axios');

function getgeoJson(cityName) {
    axios.get(`https://nominatim.openstreetmap.org/search.php?q=${cityName}&polygon_geojson=1&format=json`)
    .then((response) => {
        const city = (response.data)[1].geojson.coordinates;
        req.city = city;
    })
    .catch(error => {
        req.error = error;
    });
}; 

let geojsonPoly = function (req, res, next) {
    getgeoJson(req.params.cityNamed);
    console.log('city is', req.city)
    next();
};

module.exports = geojsonPoly;