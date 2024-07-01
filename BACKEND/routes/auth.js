const express =require('express')
const User=require('../models/User');
const router=express.Router();
const { body,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const  jwt=require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser');


const JWT_Secret="harryisgoodboy";

// route 1:create  a user using post "/api/auth/createuser".no login required.
router.post('/createuser',[
    body('password').isLength({min:5}),
    body('email').isEmail(),
    body('name').isLength({min:3})
    
], async (req,res)=>{
    //console.log(req.body)
    //const user=User(req.body)
    //user.save();
    const errors=validationResult(req);
    if(!errors.isEmpty()){
    return res.json({errors:errors.array()})
    }
    //res.send(req.body)
    try{
        // check whether the email with this email is already exist
    let user= await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({error:"sorry  already user exist with this email"})
    }

    const salt=await bcrypt.genSalt(10);
    const secPassword= await bcrypt.hash(req.body.password,salt);

    user=await User.create({
        name:req.body.name,
        password:secPassword,
        email:req.body.email,
    });
    const data={
        user:{
            id:user.id
        }
    }

    const authtoken=jwt.sign(data,JWT_Secret);
  //  console.log(authtoken);
  res.send(authtoken);


} catch(error){
    console.log(error.message)
    res.status(500).send('some error occured ')
}
})

// route 2:authenticate a user using POST "/api/auth/Login", No login required

router.post('/login',[
    body('email','Enter a Valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
],
   async (req,res)=>{
    //if there are errors return bad request
    const errors=validationResult(req);
    if(!errors.isEmpty()){
    return res.json({errors:errors.array()})
    }
    const {email,password}=req.body;
    try {
        let user= await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"please enter valid credentials"})
        }
        const passwordcompare=await bcrypt.compare(password,user.password)
        if(!passwordcompare){
            return res.status(400).json({error:"please enter valid credentials"})
        }

        const payload={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(payload,JWT_Secret);
        res.send(authtoken)
        
    } catch (error) {
     console.log(error.message);
     res.status(500).json({error:"Internal Error Occured"});
        
    }

   }
)

//route 3 : get loggedin user details using POST "/api/auth/getuser".login required.
router.post('/getuser',fetchuser,async (req,res)=>{
    try {
        userId=req.user.id;
    
        const user=await  User.findById(userId).select("-password");
        res.send(user);
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server Error ")
        
    }
})
module.exports=router