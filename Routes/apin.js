const express = require('express');

const router = express.Router();

//Model for Ninjas
const Ninja = require('../modelss/ninja');


// get a list of ninjas from the db
router.get('/ninjas', function(req, res){
    // Ninja.find({},(err,doc)=>{
    //     if (err) res.status(400).send(err);
    //     res.status(200).json({
    //         doc
    //     })
    // })
    Ninja.aggregate().near({
        near:{
        type: 'Point', 
        coordinates:[parseFloat(req.query.lng), parseFloat(req.query.lat)]
    },
        maxDistance: 90000, 
        spherical: true,
        distanceField: "dis"
}).then(function(ninjas){
    res.send(ninjas)
});
});

// add a new ninja to the db
router.post('/ninjas', function(req, res){
    const ninja = new Ninja(req.body);
    ninja.save((err,doc)=>{
        if (err) res.status(400).send(err);
        res.status(200).json({
            post: true,
            id: doc._id
        })
    })
});

// update a ninja in the db
router.put('/ninjas/:id', function(req, res){
    Ninja.findByIdAndUpdate({_id:req.params.id},req.body,{new:true},(err,doc)=>{
        if (err) res.status(400).send(err)
        res.status(200).json({
            success: true,
            doc
        })
    })
});

// delete a ninja from the db
router.delete('/ninjas/:id', function(req, res){
    Ninja.findByIdAndRemove({_id:req.params.id},(err,doc)=>{
        if (err) res.status(400).send(err)
        res.status(200).json({
            delete: true
        })
    })
    res.send({type: 'DELETE'});
});


module.exports = router;