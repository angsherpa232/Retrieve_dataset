const mongoose = require('mongoose');

const schemaGrid = new mongoose.Schema({},{strict: false});
//schemaGrid.index({ 'metadata.location.coordinates': '2dsphere' });

//@route GET /
//@desc Load the data based WITHIN SPACE
schemaGrid.statics.inside = function(coordinate, cb){
   this.find().where('metadata.location.coordinates').within().geometry({ type: 'Polygon', coordinates: coordinate })
    .exec(cb)
    }

//@route GET /
//@desc Load the specific THEME data
schemaGrid.statics.onlytheme = function(theme, callback) {
    this.find().where('metadata.tags').equals(theme)
    .exec(callback);
}

//@route GET /
//@desc Load the data based on THEME within CITY
schemaGrid.statics.themeCity =  function(coordinate,theme, cb){
    this.find().where('metadata.tags').equals(theme).where('metadata.location.coordinates').within().geometry({type: 'Polygon', coordinates: coordinate})
     .exec(cb)
     };

//@route GET /
//@desc Load the data based on TIME
schemaGrid.statics.filterTime = function(startTime, endTime,cb) {
    if (!endTime) {
        this.find().where('metadata.DateTime').equals(startTime).exec(cb);
} else if(endTime){
    this.find().where('metadata.DateTime').gt(startTime).lt(endTime).exec(cb);
}
};

//@route GET /
//@desc Load the data based on TIME and THEME
schemaGrid.statics.themeTime = function(startTime, theme, cb) {
    this.find().where('metadata.DateTime').equals(startTime).where('metadata.tags').equals(theme).exec(cb);
};

//@route GET /
//@desc Load the data based on TIME
schemaGrid.statics.timeSpace = function(startTime, coordinate, cb) {
    this.find().where('metadata.DateTime').equals(startTime).where('metadata.location.coordinates').within().geometry({ type: 'Polygon', coordinates: coordinate })
    .exec(cb);
};

//@route GET /
//@desc Load only the chosen theme data within the defined radius
schemaGrid.statics.within_radius_theme = function(theme,lng,lat,distance,cb) {
    this.find().where('metadata.tags').equals(theme).near('metadata.location.coordinates',({center:{coordinates:[parseFloat(lng),parseFloat(lat)],
        type: 'Point'}, 
        maxDistance: parseInt(distance) || 1000,
        spherical: true,
        distanceField: 'dis'
    })).exec(cb);
};


//@route GET /
//@desc Load the data based on all three params (TIME, THEME and SPACE)
schemaGrid.statics.filterTimeThemeSpace = function(startTime, theme, coordinate, cb) {
    this.find().where('metadata.DateTime').equals(startTime).where('metadata.tags').equals(theme).where('metadata.location.coordinates').within().geometry({type:'Polygon',coordinates: coordinate })
   .exec(cb)
}


//define Model for metadata collection.
const gfsModel = mongoose.model("GFS", schemaGrid, "uploads.files" );


module.exports = gfsModel;

