const mongoose=require('mongoose');
const mongoURL="mongodb://localhost:27017/inotebook?tls=false&readPreference=primary&directConnection=true";


const connectToMongo= async ()=>{
    mongoose.set('strictQuery',false)
    mongoose.connect(mongoURL)
    console.log('mongo connected');
  
}

module.exports=connectToMongo;