const express = require('express')
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Create a User using POST /api/auth/createuser   No Login Required

router.post('/createuser',[
body('email',"Enter a Valid Email").isEmail(),
body('name',"Enter a Valid name").isLength({ min: 5 }),
body('password',"Enter a Valid Password").isLength({ min: 5 }),
], async (req,res) => {
 
    // If there are errors, return Bad Requests and the errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check Whether the user with this email exists already
try{
    let user = await User.findOne({email : req.body.email})
    if(user){
        return res.status(400).json({error : "Sorry This E-mail is already Exists"})
    }
     user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      })
    //   .then(user => res.json(user))
    //   .catch(err => {console.log(err)
    //     res.json({error : 'Please Enter a Valid Email',message:err.message})
    //   })
    res.json(user)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Occurred")
}
})

module.exports = router