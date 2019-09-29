const fs = require('fs')
const gm = require('gm')
const getColors = require('get-image-colors')
const _ = require('lodash')

const studentsWithPhotos = JSON.parse(fs.readFileSync('./data/studentsWithPhotos.json'))

// resize photo and then get its colors
function resizeAndGetColor(index) {
  if (!studentsWithPhotos[index]) return

  const student = studentsWithPhotos[index]
  const filename = `./data/photos/${student.year}/${student.filename}`
  // first use gm to resize
  gm(filename)
    .identify((err, data) => {
      if (err) {
        console.error(err)
        resizeAndGetColor(index + 1)

        return
      }

      let {width, height} = data.size
      const resize = 200

      if (width > height) {
        width = resize
        height = resize * (height / width)
      } else {
        width = resize * (width / height)
        height = resize
      }
      // resize the image
      gm(filename)
       .resize(width, height)
       .write(filename, err => {
         if (err) {
           console.error(err)
           resizeAndGetColor(index + 1)

           return
         }

         // get the colors
         console.log(`resize ${filename}`)

         getColors(filename, (err, colors) => {
           if (err) {
            console.error(err)
            resizeAndGetColor(index + 1)

            return
           }
            // remember the color
            Object.assign(student, {
              colors: _.map(colors, c => c.hex()),
              width, height,
            })

            // remember the colors
            console.log(`${student.netID}: ${student.colors.join(', ')}`)
            fs.writeFileSync('./data/studentsWithPhotos.json',
              JSON.stringify(studentsWithPhotos), {encoding: 'utf8'})

            resizeAndGetColor(index + 1)
          });
       });
    })
}

resizeAndGetColor(0)
