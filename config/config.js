const config = {
    production: {
        DATABASE: process.env.MONGODB_URI
    },
    default: {
        DATABASE: process.env.MONGODB_URI
    }
}

exports.get = function get(env){
    return config[env] || config.default
}

'mongodb://localhost:27017/thesis'
