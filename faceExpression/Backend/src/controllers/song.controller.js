
const songModel=require('../models/song.model')
const storageServices=require('../services/storage.services')
const id3=require('node-id3')


async function uploadSong(req,res){
    const songBuffer=req.file.buffer;
   const tags= id3.read(songBuffer)
   console.log(tags)
   const {mood}=req.body
   const posterBuffer = tags?.image?.imageBuffer || null;
    
  
   const uploads = [
    storageServices.uploadFile({
        buffer:songBuffer,
        filename:tags.title || `song-${Date.now()}`,
        folder:'songs'
    })
   ];

   if (posterBuffer) {
    uploads.push(
      storageServices.uploadFile({
        buffer:posterBuffer,
        filename:`${tags.title || "song"}-poster`,
        folder:'posters'
      })
    );
   }

   const [songFile,posterFile]=await Promise.all(uploads)


   const song=await songModel.create({
    url:songFile.url,
    posterUrl:posterFile?.url || "",
    title:tags.title || "Unknown title",
    mood
   })

   res.status(201).json({
    message:'Song uploaded successfully',
    song
   })


}

async function getSong(req,res){
    const {mood}=req.query
    const song=await songModel.findOne({
        mood
    })
    if(!song){
        return res.status(404).json({
            message:'No song found for this mood',
            song:null
        })
    }
    res.status(200).json({
        message:'Song fetched successfully',
        song
    })
}

module.exports={
    uploadSong,
    getSong
}




