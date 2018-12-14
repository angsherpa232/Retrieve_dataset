const express = require('express');

const router = express.Router();
const axios = require('axios');

//FILE UPLOAD/DOWNLOAD MODULES
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const config = require('../config/config').get(process.env.NODE_ENV);



//Model for GeoJSON
const gfsModel = require('../Models/gfModel');

//Accept Global Promise as Mongoose Promise
mongoose.Promise = global.Promise;

//Import Routing logic > MIDDLEWARE
const theme_city_time_two = require('./theme_city_time_two');
const theme_city_time_three = require('./theme_city_time_three');
const { validateTime } = require('./timevalidate');
const { geojsonPoly } = require('../Middleware/fetch_geojson');

//THEME ENLISTED
const theme = ['population', 'crime', 'migration','transport','economy','landuse','weather'];

//FOR FILE UPLOAD/DOWNLOAD
const conn = mongoose.createConnection(config.DATABASE,{ useNewUrlParser: true });

//INIT gfs
let gfs;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});


//CREATE STORAGE ENGINE
const storage = new GridFsStorage({
    url: config.DATABASE,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads',
                    metadata: {
                        location: {
                            "coordinates":
                                [
                                    13.7493896484375,
                                    51.08411588813325
                                ]
                        },
                        tags: 'air quality',
                        DateTime: '2017-11-03' //day-month-year
                    }
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });


//MONGO FILE UPLOAD/DOWNLOAD SECTION
//GET MAIN ROUTE
router.get('/', (req, res) => {
    //res.render('index');
    console.log('first testing')
    //res.sendFile(path.resolve(__dirname, '../client/build/index.html'))
    console.log('config', config)
    //res.send('welcome')
})

//@route GET /
//@desc Loads all files
// router.get('/files', (req,res) => {
//     gfs.files.find().toArray((err, files)=>{
//         //Check if files
//         if (!files || files.length === 0) {
//             return res.status(404).json({
//                 err: 'No files exist'
//             });
//         }
//         //Files exist
//         return res.json(files)
//     });
// });

//@route GET /
//@desc Loads a single file
// router.get('/files/:filename', (req,res) => {
//     gfs.files.findOne({filename: req.params.filename}, (err, file)=>{
//         if (!file || file.length === 0) {
//             return res.status(400).json({
//                 err: 'from files/filename'
//             });
//         }
//         res.status(200).json(file.metadata)
//     })
// });

router.get('/home/sweet', (req,res) => {
    console.log('HOME SAFE')

    res.send('safely home')
})

//@route GET /
//@desc Loads all files 
router.get('/all', (req,res) => {
    gfsModel.allFiles((err, file) => {
        if (err) res.status(400).send(err)
        res.status(200).send(file)
    })
})


//@route GET /
//@desc Loads particular theme data 
//@ First checks if theme is in list and then check for req.query for nearby operation
router.get('/:theme', function (req, res, next) {
    if (theme.includes(req.params.theme)) {
         gfsModel.onlytheme(req.params.theme, (err, file) => {
            if (!file || file.length === 0) {
                res.status(400).json({
                    err: 'From theme only'
                });
            }
            res.status(200).json(file)
        })
    } else next('route')
}, function (req, res, next) {
});




//@route DELETE /
//@desc Delete an image
router.delete('/files/:id', (req, res) => {
    gfs.exist({ _id: req.params.id, root: 'uploads' }, (err, file) => {
        if (err || !file) {
            res.status(404).send('from files/id only');
        } else {
            gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
                if (err) {
                    return res.status(404).json({ err: err })
                }
                res.send('yahoo')
            })
        }
    });
});



//@route GET /
//@desc Load all the files within the city
router.get('/:cityName', geojsonPoly, (req, res, next) => {
    console.log('from city')
    gfsModel.inside(req.city, (err, file) => {
        if (!file || file.length === 0) {
            if (Array.isArray(file)) {
                res.status(200).json({
                    'Length': file.length
                });
            } else {
                // res.status(200).json({
                //     'Status': 'No data found.'
                // });
                next('route');
            }
        } else {
            res.status(200).send(file)
        }
    })
});

//Later place the time below the theme and above city
//@route GET /
//@desc Loads data based on time
router.get('/:time', validateTime, function (req, res) {
    console.log('inside time')
    if (req.is_valid) {
        gfsModel.filterTime(req.startDate, req.endDate,(err, file) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(200).send(file)
            }
        })
    } else {
        res.status(400).json({
            'error':'Oops, typos in the parameter.'
        })
    }
});

//@route GET 
//@desc Get two by two combination of TIME, THEME AND SPACE.
router.get('/:theme/*', theme_city_time_two, (req, res) => {
    console.log('inside two param route')
    if (req.long && req.lat) {
    gfsModel.within_radius_theme(req.theme,req.long, req.lat, req.distance, (error, file) => {
        if (error) res.send(req.error);
        res.send(file)
    })
}
    else if (req.data) {
        res.status(200).send(req.data)
    }

    else if(req.startDate) {
        if (req.theme_value) {
        gfsModel.themeTime(req.startDate, req.endDate,req.theme_value, (err, file) => {
            if (err) {
                res.status(400).send(err)
            } else {
                file.length === 0 ? res.status(200).send("0 file found.") : res.status(200).send(file)
            }
        })
    } else if (req.city) {
        gfsModel.timeSpace(req.startDate, req.endDate, req.city,(err, file) => {
            if (err) {
                res.status(400).send(err)
            } else {
                file.length === 0 ? res.status(200).send("0 file found.") : res.status(200).send(file)
            }
        })
    } else {
        res.status(400).json({
            'error':'Oops, typos in the parameter.'
        })
    }
    }
    else {
        res.status(400).json({
            'length': req.length,
            'error': req.error,
            'error': 'Oops, typos in the parameter.'
        })
    }
})

// //@route GET 
// //@desc Get three by three combination of TIME, THEME AND SPACE.
router.get('/:time/*/*', theme_city_time_three, (req, res) => {
    console.log('from three param route')    
    gfsModel.filterTimeThemeSpace(req.startDate, req.endDate,req.theme_value, req.city, (err, file) => {

        if (!file || file.length === 0) {
            if (Array.isArray(file)) {
                res.status(200).json({
                    'length': file.length
                });
            } else {
                res.status(200).json({
                    'err': 'No data found.'
                });
            }
        } else {
            res.status(200).send(file)
        }
        //if (err) res.status(400).json({ 'err': req.error });
        
    });
});

//@route POST /upload
//@desc Uploads file to DB
router.post('/upload', upload.single('file'), (req, res) => {
    res.json({ file: req.file });
    //res.redirect('/');
});

//ADD LATER//
//@route GET /
//@desc Load image to browser
// router.get('/image/:filename', (req,res) => {
//     gfs.files.findOne({filename: req.params.filename},(err, file)=>{
//         //Check if files
//         if (!file || file.length === 0) {
//             return res.status(404).json({
//                 err: 'No files exist'
//             });
//         }
//         //Files exist
//         if (file.contentType === "image/jpeg" || file.contentType === "img/png"){
//             //Read output to browser
//             const readstream = gfs.createReadStream(file.filename);
//             readstream.pipe(res);
//         } else {
//             res.status(404).json({
//                 err: "Not an image"
//             });
//         }
//     });
// });


//@route GET /
//@desc Load all the files within the defined radius
// router.get('/datasetnearby', (req,res)=>{
//     dataModel.aggregate().near({
//         near: {
//             type: 'Point',
//             coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
//         },
//         maxDistance: 402, 
//         spherical: true,
//         distanceField: "dis",
//     }).then(function(datas){
//         res.send(datas)
//     });
// })


// if(process.env.NODE_ENV != 'production') {
//     console.log('from api.js')
//     router.get('/*', (req,res)=>{
//         res.sendFile(path.resolve(__dirname, '../client','build','index.html'))
//     })
// }

module.exports = router;