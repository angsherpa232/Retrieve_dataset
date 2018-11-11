const axios = require('axios');

async function getgeoJson(cityName, req, next) {
    try {
    return await axios.get(`https://nominatim.openstreetmap.org/search.php?q=${cityName}&polygon_geojson=1&format=json`);
    } catch (e) {
        req.error = e;
        next();
    }
}; 

//@route GET > /:cityName
//@desc If entered params is not a city then redirect to next route i.e. /:time
let geojsonPoly = async function (req, res, next) {
    const fetchedCity = await getgeoJson(req.params.cityName, req, next);
    if (fetchedCity.data.length === 0) {
        next('route');
    } else {
        req.city = (fetchedCity.data)[1].geojson.coordinates;
        next();
    }
};

module.exports = {geojsonPoly, getgeoJson};