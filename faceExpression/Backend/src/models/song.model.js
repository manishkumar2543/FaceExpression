const mongoose=require('mongoose')

const ALLOWED_MOODS = ['sad', 'happy', 'wow', 'sleep']

const songSchema=new mongoose.Schema({
     url:{
        type:String,
        required:true
     },
     posterUrl:{
        type:String,
        required:false,
        default:""
     },
     title:{
        type:String,
        required:true
     },
     mood:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        enum:{
            values:ALLOWED_MOODS,
            message:'Mood must be one of: sad, happy, wow, sleep'
        }
     }
     
}, {
    timestamps: true
})
const songModel=mongoose.model('song',songSchema)
module.exports = {
    songModel,
    ALLOWED_MOODS
}
