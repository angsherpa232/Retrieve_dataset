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
        try{
        req.city = (fetchedCity.data)[1].geojson.coordinates;
        //console.log(req.city) //Check here if city supports or not
        next();
        } catch (e){
            console.log('from two')
        req.length = '0'
        req.error = 'No file found in given city.'
        //req.error = e;
        next();
        }
        
    }
};



module.exports = {geojsonPoly, getgeoJson};