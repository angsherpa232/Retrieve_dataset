const config = {
    production: {
        DATABASE: process.env.MONGODB_URI
    },
    default: {
        DATABASE: 'mongodb://angsherpa232:nasaicimod2@ds119374.mlab.com:19374/retrievedataset'
    }
}

exports.get = function get(env){
    return config[env] || config.default
}

'mongodb://localhost:27017/thesis'