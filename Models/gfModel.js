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
schemaGrid.statics.filterTime = function(startTime, cb) {
    this.find().where('metadata.DateTime').equals(startTime).exec(cb);
};

//@route GET /
//@desc Load the data within the defined radius
schemaGrid.statics.within_radius = function(lng,lat,distance,cb) {
    this.find().near('metadata.location.coordinates',({center:{coordinates:[parseFloat(lng),parseFloat(lat)],
        type: 'Point'}, 
        maxDistance: parseInt(distance),
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

