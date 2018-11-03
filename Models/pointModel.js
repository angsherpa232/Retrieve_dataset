const mongoose = require('mongoose');

const pointGeo = new mongoose.Schema({
    type: {
        type: String,
        default: 'Point',
        enum: ['Point']
    },
    coordinates: {
        type: [Number]
    }
});

const dataSchema =  new mongoose.Schema({
    name: String,
    location: pointGeo
});

dataSchema.index({"location": "2dsphere"});

dataSchema.statics.withel = function(coordinate, callback){
    this.find().where('location').within().geometry({ type: 'Polygon', coordinates: coordinate })
    .exec(callback)
    }


const dataModel = mongoose.model('dataModel', dataSchema);



module.exports = dataModel;