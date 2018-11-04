const mongoose = require('mongoose');

const schemaGrid = new mongoose.Schema({}, {strict: false});


//@route GET /
//@desc Loads all WITHIN data
schemaGrid.statics.inside =    function(coordinate, cb){
   this.find().where('metadata.location.coordinates').within().geometry({ type: 'Polygon', coordinates: coordinate })
    .exec(cb)
    }

//@route GET /
//@desc Loads specific THEME data
schemaGrid.statics.onlytheme =   function(theme, callback) {
    this.find().where('metadata.tags').equals(theme)
    .exec(callback);
}

//@route GET /
//@desc Loads all theme within city
schemaGrid.statics.themeCity =    function(coordinate,theme, cb){
    this.find().where('metadata.tags').equals(theme).where('metadata.location.coordinates').within().geometry({ type: 'Polygon', coordinates: coordinate })
     .exec(cb)
     };

//@route GET /
//@desc Load data based on TIME
schemaGrid.statics.filterTime = function(startTime, cb) {
    this.find().where('metadata.DateTime').equals(startTime)
    .exec(cb);
};


//define Model for metadata collection.
const gfsModel = mongoose.model("GFS", schemaGrid, "uploads.files" );


module.exports = gfsModel;

