const { validateToken } = require("../middleware/auth"); // Use require for imports

// Rest of your code

const express = require("express");
const { body, validationResult } = require("express-validator");
const bycryptJs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const SECRET_KEY = "this is the new app "; // Store securely in an environment variable
router.get('/fetch-user',validateToken,async(req,res)=>{
    let userInfo=await User.findById(req.user.id).lean();
    if(!userInfo){
        return res.status(400).json({ error: "No user Found" });
    }
    res.status(201).json({userInfo});

    
} );
router.put('/forgot-password',async(req,res)=>{
  const { email, password, username } = req.body;
  try {
    // Check if the user already exists
    let user = await User.findOne({ email});
    if (!user) {
      return res.status(400).json({ error: [{ msg: "User does not exists" }] });
    }
    if(!user.username==username){
      return res.status(400).json({ error: [{ msg: "username does not macth" }] });
    }
    
    // Hash the password
    const salt = await bycryptJs.genSalt(10);
    const hashedPassword = await bycryptJs.hash(password, salt);

    // Create the new user
    user.password=hashedPassword;
    user.save();

    // Create and return the JWT token
    res.status(200).json({msg:'User Created SuccessFully'});

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }

})
router.post(
  "/login",
  [
    body("username", "Name is required").not().isEmpty(),

    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    console.log("hehe")
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty){
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
      const user =await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ error: "Username is Invalid" });
      }
      const passwordCorrect = await bycryptJs.compare(password, user.password);
      if (!passwordCorrect) {
        
        return res.status(400).json({ error: "Password is Wrong" });
      }
      const payload = {
        user: {
          id: user._id,
        },
      };
      const token =  jwt.sign(payload, SECRET_KEY, { expiresIn: "1H" });
      console.log(token);
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
router.post("/logout", async (req, res) => {
    try {
      res.clearCookie("token"); // Adjust this if you're using cookies to store the token
  
      res.json({ msg: "User logged out successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });
  router.post(
    "/signup",
    [
      body("email", "Enter a valid email").isEmail(),
      body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
      body("username", "Name is required").not().isEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password, username } = req.body;
  
      try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ error: [{ msg: "User already exists" }] });
        }
  
        // Hash the password
        const salt = await bycryptJs.genSalt(10);
        const hashedPassword = await bycryptJs.hash(password, salt);
  
        // Create the new user
        user = new User({
          email,
          password: hashedPassword,
          username,
        });
  
        // Save the user to the database
        await user.save();
  
        // Create and return the JWT token
        res.status(200).json({msg:'User Created SuccessFully'});
  
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
      }
    }
  );
  
  
module.exports=router;
