const multer = require('multer');

const storage = multer.memoryStorage();
const allowedMimeTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/mp4']

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20
    },
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            return cb(null, true)
        }
        cb(new Error('Only audio files are allowed'))
    }
});

module.exports = upload;
