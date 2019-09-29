const fs = require('fs')
const request = require('request');
const _ = require('lodash')

// const existingStudents = JSON.parse(fs.readFileSync('./data/studentsWithPhotos.json'))
let allStudents = JSON.parse(fs.readFileSync('./data/allStudents.json'))
// // const studentIndex = _.indexOf(allStudents, _.last(existingStudents)[])
// allStudents = _.difference(allStudents, _.map(existingStudents, 'netID'))
// allStudents = _.map(existingStudents, 'netID')
const studentsWithPhotos = []
// const studentsWithPhotos = existingStudents || []


function getPhotos(netID) {
  const options = {
     url: `https://itp.nyu.edu/ranch/api/people/${netID}/details`,
     strictSSL: false
  }
  request(options, (error, response, body) => {
    if (error) {
      // if error, log and then move on
      console.error(error)
      return getPhotos(allStudents.pop())
    }
    console.log(`got ${netID}`)

    // if we've gotten it, check if it has a photo
    const student = JSON.parse(body)
    const photoUrl = (student.misc.photo_url || '').replace(/\\/g, '')
    if (photoUrl) {
      // if it has a photo, request for it
      const options = {
         url: `https://itp.nyu.edu${photoUrl}`,
         strictSSL: false
      }

      console.log(`requesting photo: ${options.url}`)
      // create file for student year if it doesn't exist
      const directory = `./data/photos/${student.classyear}`
      if (!fs.existsSync(directory)){
          fs.mkdirSync(directory);
      }

      const filename = `${directory}/${netID}.${_.last(photoUrl.split('.'))}`
      request(options)
        .on('error', err => {
          // if error, print message and move on
          console.error(err)
          getPhotos(allStudents.pop())
        }).pipe(fs.createWriteStream(filename))
        .on('close', () => {
          console.log(`downloaded ${netID} image and saved to ${filename}`)
          // if finish getting image
          studentsWithPhotos.push({
            netID,
            name: student.preferred_name || student.official_name,
            gender: student.gender,
            year: student.classyear,
            filename: `${netID}.${_.last(photoUrl.split('.'))}`
          })

          // only write info if there's student photo
          fs.writeFileSync('./data/studentsWithPhotos.json',
            JSON.stringify(studentsWithPhotos), {encoding: 'utf8'})

          // move ot next student
          getPhotos(allStudents.pop())
        })
    } else {
      // if no photo, just move on
      getPhotos(allStudents.pop())
    }
  });
}

getPhotos(allStudents.pop())
