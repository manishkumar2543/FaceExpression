const mongoose=require('mongoose')


function ConnectToDb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to MongoDb")
    })
}
module.exports=ConnectToDb