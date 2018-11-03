const mongoose = require('mongoose');

const polyGeo = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Polygon']
    },
    coordinates: {
        type: [[[Number]]],
        index: '2dsphere'
    }
})

const polySchema = new mongoose.Schema({
    name: String,
    location: polyGeo
});

polySchema.index({location:'2dsphere'})

const cityModel = mongoose.model('cityModel',polySchema);

module.exports = cityModel

