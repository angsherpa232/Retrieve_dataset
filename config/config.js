const config = {
    production: {
        DATABASE: process.env.MONGOLAB_URI
    },
    default: {
        DATABASE: process.env.MONGOLAB_URI
    }
}

exports.get = function get(env){
    return config[env] || config.default
}


'mongodb://localhost:27017/thesis'