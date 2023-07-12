const fs = require('fs')

// helper function using fs to delete files at a provided path
exports.deleteFile = (path) => {
  fs.unlink(path, err => {
    if (err) console.log(err)
    else console.log("File deleted")
  })
}