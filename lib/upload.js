'use strict'

const path = require('path')
const uploadFile = require('./upload-file')
const glob = require('glob')

function upload(source, bucket, prefix, s3lib) {
  prefix = prefix || ''

  return new Promise((resolve, reject) => {
    glob('**/*', {
      cwd: source,
      nodir: true,
      dot: true,
      follow: true
    }, (err, files) => {
      if (err)
        return reject(err)

      if (!prefix && (!files || !files.length))
        return reject({
          message: 'Source folder is empty.'
        })

      resolve(files)
    })
  })
    .then(files => {
      return Promise.all(files.map(file => {
        const filePath = path.join(source, file)
        return uploadFile(file, filePath, bucket, prefix || '', s3lib)
      }))
    })
}

module.exports = upload
