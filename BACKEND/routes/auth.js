const express =require('express')
const User=require('../models/User');
const router=express.Router();
const { body,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken');

const JWT_Secret="harryisgoodboy";

//create a user using post "/api/auth/createuser".no login required.
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
module.exports=router