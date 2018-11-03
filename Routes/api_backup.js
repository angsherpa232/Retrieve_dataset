const express = require('express');

const router = express.Router();
const axios = require('axios');

//FILE UPLOAD/DOWNLOAD MODULES
const path= require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const config = require('../config/config').get(process.env.NODE_ENV);

//Model for GeoJSON
const dataModel = require('../Models/pointModel');
const cityModel = require('../Models/polyModel');
const gfsModel = require('../Models/gfModel');

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
                location:{
                    "coordinates": 
                [7.55996704101562, 
                    51.9764216621633]                
                    }
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
router.get('/', (req,res) => {
    res.render('index');
})

//@route GET /
//@desc Loads all files
router.get('/files', (req,res) => {
    gfs.files.find().toArray((err, files)=>{
        //Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        //Files exist
        return res.json(files)
    });
});

//@route GET /
//@desc Loads a single file
router.get('/files/:filename', (req,res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file)=>{
        if (!file || file.length === 0) {
            return res.status(400).json({
                err: 'No file exists'
            });
        }
        let colorado = [[     
            [ 
                7.55996704101562, 
                51.9764216621633
            ], 
            [ 
                7.56065368652344, 
                51.9391853834613
            ], 
            [ 
                7.61695861816406, 
                51.9311416724684
            ], 
            [ 
                7.66571044921875, 
                51.9582305262447
            ], 
            [ 
                7.61283874511719, 
                51.993337020564
            ], 
            [ 
                7.55996704101562, 
                51.9764216621633
            ]
    ]]
        gfsModel.inside(colorado,(err,doc)=>{
            if (err) res.send('mistake');
            res.send(doc)
        });
        //res.status(200).json(file.metadata)
    })
});

//@route GET /
//@desc Loads only metadata
// router.get('/files', (req,res) => {
//     gfs.files.find({metadata:'location'}).toArray((err, files)=>{
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

//@route DELETE /
//@desc Delete an image
router.delete('/files/:id', (req,res) => {
    gfs.exist({_id: req.params.id, root: 'uploads'}, (err, file) => {
        if (err || !file) {
            res.status(404).send('File not found');
        } else {
            gfs.remove({_id: req.params.id, root: 'uploads'}, (err, gridStore)=>{
                if (err) {
                    return res.status(404).json({err:err})
                }
                res.send('yahoo')
            })
        }
    });
});

//@route GET /
//@desc Load image to browser
router.get('/image/:filename', (req,res) => {
    gfs.files.findOne({filename: req.params.filename},(err, file)=>{
        //Check if files
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        //Files exist
        if (file.contentType === "image/jpeg" || file.contentType === "img/png"){
            //Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: "Not an image"
            });
        }
    });
});




//GET ROUTE
router.get('/home', (req,res)=>{
    res.send('Nice and best of luck for this journey. :D')
})

router.get('/withel', (req,res)=>{
    let colorado = [[     
        [ 
            7.55996704101562, 
            51.9764216621633
        ], 
        [ 
            7.56065368652344, 
            51.9391853834613
        ], 
        [ 
            7.61695861816406, 
            51.9311416724684
        ], 
        [ 
            7.66571044921875, 
            51.9582305262447
        ], 
        [ 
            7.61283874511719, 
            51.993337020564
        ], 
        [ 
            7.55996704101562, 
            51.9764216621633
        ]
]]
    dataModel.withel(colorado,(err,doc)=>{
        if (err) res.send('mistake');
        res.send(doc)
    });
    
})

//GET ALL THE CITY DATA
router.get('/cities', (req,res) => {
    cityModel.find({},(err,doc)=>{
        if (err) return res.status(4000).send(err);
        res.status(200).send(
            doc
        )
    })
})


//NEARBY RADIUS
router.get('/datasetnearby', (req,res)=>{
    dataModel.aggregate().near({
        near: {
            type: 'Point',
            coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
        },
        maxDistance: 402, 
        spherical: true,
        distanceField: "dis",
    }).then(function(datas){
        res.send(datas)
    });
})

//GET WITHIN THE CITY
router.get('/:cityName', (req,res)=>{
    const cityName = req.params.cityName;
    axios.get(`https://nominatim.openstreetmap.org/search.php?q=${cityName}&polygon_geojson=1&format=json`)
    .then((response) => {
        const colorado = (response.data)[1].geojson.coordinates;
        gfsModel.inside(colorado, (err,doc)=>{
            if (err) res.status(400).send(err)
            res.status(200).send(doc)
        })
    })
    .catch(error => {
        res.send(error);
    })
})



//@route POST /upload
//@desc Uploads file to DB
router.post('/upload', upload.single('file'), (req,res) => {
    res.json({file: req.file});
    //res.redirect('/');
});

//POST NEW CITY DATA
router.post('/cityData', (req,res)=>{
    const city = new cityModel(req.body);
    city.save((err, doc) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({
            post: true,
            cityId: doc._id
        })
    })
})

//POST NEW DATASET 
router.post('/dataset', (req,res)=>{
    const dataset = new dataModel(req.body);
    dataset.save((err,doc)=>{
        if (err) return res.status(400).send(err);
        res.status(200).json({
            post: true,
            datasetId: doc._id
        })
    })
})

module.exports = router;