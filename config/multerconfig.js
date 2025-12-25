const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

//setting up the disk storage
const storage = multer.diskStorage({
    //setting up the destination
  destination: function (req, file, cb) {
    cb(null , './public/images/uploads')
  },
  //setting up the filename unique for evrry file as to avoid any overwrite
  filename: function (req, file, cb) {
    crypto.randomBytes(12,(err,bytes) => {
        const fn = bytes.toString('hex') + path.extname(file.originalname);
        cb(null, fn);
    })
  }
})
//upload variable
const upload = multer({ storage: storage })
module.exports = upload;
