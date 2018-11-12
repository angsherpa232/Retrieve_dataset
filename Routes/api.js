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
const theme = ['population', 'crime'];

//FOR FILE UPLOAD/DOWNLOAD
const conn = mongoose.createConnection(config.DATABASE);

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
                                [7.64986213134766,
                                    51.6843680652201]
                        },
                        tags: 'population',
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
    res.render('index');
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



//@route GET /
//@desc Loads particular theme data 
//@ First checks if theme is in list and then check for req.query for nearby operation
router.get('/:theme', function (req, res, next) {
    if (theme.includes(req.params.theme)) {
        (req.query.lng && req.query.lat) ? 
        gfsModel.within_radius_theme(req.params.theme,req.query.lng, req.query.lat, req.query.distance, (error, file) => {
            if (error) res.send(error);
            res.send(file)
        })
         :
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
    console.log('ho ta')
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
    gfsModel.inside(req.city, (err, file) => {
        if (!file || file.length === 0) {
            res.status(404).json({
                err: req.error
            });
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
        gfsModel.filterTime(req.startDate, (err, file) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(200).send(file)
            }
        })
    } else {
        res.send('Please check for typos.')
    }

});

//@route GET 
//@desc Get two by two combination of TIME, THEME AND SPACE.
router.get('/:theme/*', theme_city_time_two, (req, res) => {
    console.log('ma pani')
    if (req.data) res.status(200).send(req.data);
    if (req.startDate) {
        gfsModel.filterTime(req.startDate, (err, file) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(200).send(file)
            }
        })
    }
    //res.status(400).send('Bad request');
})

//@route GET 
//@desc Get three by three combination of TIME, THEME AND SPACE.
router.get('/:time/*/*', theme_city_time_three, (req, res) => {
    console.log('from three param route')
    gfsModel.filterTimeThemeSpace(req.startDate, req.theme_value, req.city, (err, file) => {
        if (err) status(400).json({ 'err': req.err });
        res.send(file)
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

module.exports = router;