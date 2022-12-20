const uuidv4 = require('uuid/v4');
const DIR = './public/';
const multer =  require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype = /pdf|docx/) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only pdf/docx format allowed!'));
        }
    }
});
module.exports = upload;