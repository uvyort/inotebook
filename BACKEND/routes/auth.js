const express = require('express');
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "Sanamisagood$man"

//Route 1 create a User using: POST "/api/auth/createuser". Doesn't require auth
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    // if there are errors, return Bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
    }

    try {
        //check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" })
        }

        const salt =await bcrypt.genSalt(10);
        const secPass =await bcrypt.hash(req.body.password, salt);

        // create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password:secPass,
        })
        const data = {
            user:{
                id:user.id,
            }
        }
  
        const authToken = jwt.sign(data, JWT_SECRET);  

        res.json({authToken}); 
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})


//Route 2 Authenticate a User using POST "/api/auth/login". No login required
router.post('/login',[
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
],async (req, res)=>{

    let success = false;
    // if there are errors, return Bad request and the errors

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
    }
    const {email, password} = req.body;
    try {
        let user =await User.findOne({email});
        if(!user){
              sucees = false
            return res.status(400).json({error:"Please try to login with correct credentials"});
        }

        const passwordCompare =await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success= false
               return res.status(400).json({success, error:"Please try to login with correct credentials"});
        }
        const data = {
            user:{
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
          success= true;
        // res.json(user)
        res.json({success,authToken})

    } catch (error) {
         console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

});



// Route 3: Get loggedin User details using: POST "/api/auth/getuser" . Login required
router.post('/getuser',fetchuser, async (req, res)=>{

try {
     userId = req.user.id;
    const user =await User.findById(userId).select("-password");
    res.send(user)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})

module.exports = router