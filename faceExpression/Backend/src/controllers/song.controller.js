const { songModel, ALLOWED_MOODS } = require('../models/song.model')
const storageServices=require('../services/storage.services')
const id3=require('node-id3')
const fs = require('fs')
const path = require('path')

const moodAliases = {
    happy: 'happy',
    sad: 'sad',
    wow: 'wow',
    sleep: 'sleep',
    sleeping: 'sleep',
    sleepy: 'sleep',
    neutral: 'sad'
}

const LOCAL_MOOD_SONGS = {
    happy: ['0f835247a53e15ea912083b1b683380ca9d44334_m4DGagIq3.mp3'],
    sleep: ['223200983c5d180a020dd2e560efb29538bac50e_36VubyZ9w.mp3'],
    wow: ['486a899a0167e2dee0c63b30a8fbed2d37d97cba_br3WRwmAX.mp3'],
    sad: ['e83c30dd3b78d2842e73725f4a598467536e8934_-6cGcPI5AF.mp3']
}

function normalizeMood(value){
    if(!value || typeof value !== 'string') return null
    const cleaned = value.trim().toLowerCase()
    return moodAliases[cleaned] || cleaned
}

function getLocalSongByMood({ req, mood }) {
    const candidates = LOCAL_MOOD_SONGS[mood] || []
    const publicSongDir = path.resolve(__dirname, '../../public/song')
    const existing = candidates.filter((filename) => fs.existsSync(path.join(publicSongDir, filename)))
    if (!existing.length) return null

    const picked = existing[Math.floor(Math.random() * existing.length)]
    const baseUrl = `${req.protocol}://${req.get('host')}`

    return {
        url: `${baseUrl}/song/${encodeURIComponent(picked)}`,
        posterUrl: '',
        title: path.parse(picked).name,
        mood
    }
}

async function uploadSong(req,res){
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'Please upload a song file with field name "song"'
            })
        }

        const mood = normalizeMood(req.body?.mood || req.body?.expression)
        if (!mood || !ALLOWED_MOODS.includes(mood)) {
            return res.status(400).json({
                message: `Invalid mood. Allowed moods: ${ALLOWED_MOODS.join(', ')}`
            })
        }

        const songBuffer=req.file.buffer
        const tags= id3.read(songBuffer) || {}
        const posterBuffer = tags?.image?.imageBuffer || null

        const uploads = [
            storageServices.uploadFile({
                buffer:songBuffer,
                filename:tags.title || `song-${Date.now()}`,
                folder:'songs'
            })
        ]

        if (posterBuffer) {
            uploads.push(
                storageServices.uploadFile({
                    buffer:posterBuffer,
                    filename:`${tags.title || 'song'}-poster`,
                    folder:'posters'
                })
            )
        }

        const [songFile,posterFile]=await Promise.all(uploads)

        const song=await songModel.create({
            url:songFile.url,
            posterUrl:posterFile?.url || '',
            title:tags.title || req.file.originalname || 'Unknown title',
            mood
        })

        res.status(201).json({
            message:'Song uploaded successfully',
            song
        })
    } catch (error) {
        console.error('Upload song error:', error)
        res.status(500).json({
            message: 'Failed to upload song'
        })
    }

}

async function getSong(req,res){
    try {
        const mood = normalizeMood(req.query?.mood || req.query?.expression || req.params?.mood)
        if (!mood || !ALLOWED_MOODS.includes(mood)) {
            return res.status(400).json({
                message: `Invalid mood. Allowed moods: ${ALLOWED_MOODS.join(', ')}`
            })
        }

        const songs = await songModel.aggregate([
            { $match: { mood } },
            { $sample: { size: 1 } }
        ])

        const song = songs[0] || null

        if(!song){
            const localSong = getLocalSongByMood({ req, mood })
            if (!localSong) {
                return res.status(404).json({
                    message:'No song found for this mood',
                    song:null
                })
            }

            return res.status(200).json({
                message:'Song fetched successfully (public fallback)',
                song: localSong
            })
        }
        res.status(200).json({
            message:'Song fetched successfully',
            song
        })
    } catch (error) {
        console.error('Get song error:', error)
        res.status(500).json({
            message: 'Failed to fetch song'
        })
    }
}

module.exports={
    uploadSong,
    getSong
}


