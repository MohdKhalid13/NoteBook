const express = require('express')
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var FetchUser = require('../middleware/FetchUser')

const JWT_SECRET = "MohdKhalid@13"

// Route 1 Create a User using POST /api/auth/createuser   No Login Required

router.post('/createuser', [
    body('email', "Enter a Valid Email").isEmail(),
    body('name', "Enter a Valid name").isLength({ min: 5 }),
    body('password', "Enter a Valid Password").isLength({ min: 5 }),
], async (req, res) => {

    // If there are errors, return Bad Requests and the errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Check Whether the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "Sorry This E-mail is already Exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        //   .then(user => res.json(user))
        //   .catch(err => {console.log(err)
        //     res.json({error : 'Please Enter a Valid Email',message:err.message})
        //   })
        // res.json(user)

        const data = {
            user:{
              id: user.id
            }
          }
          const authtoken = jwt.sign(data, JWT_SECRET);
        //   res.json(user)
          res.json({authtoken})

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occurred")
    }



    // Route 2 Authenticate a User using: POST "/api/auth/login". No login required

    router.post('/login', [
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password cannot be blank').exists(),
    ], async (req, res) => {

        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "Please try to login with correct credentials" });
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                return res.status(400).json({ error: "Please try to login with correct credentials" });
            }

            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            res.json({ authtoken })
            // res.json(user)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })
})


    // Route 3 Get Loggedin User Details using POST "/api/auth/getuser". login required

    router.post('/getuser',FetchUser, async (req,res) => {
        try {
            userId = req.user.id;
            const user = await User.findById(userId).select("-password")
            res.send(user)
          } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
          }
        })


module.exports = router