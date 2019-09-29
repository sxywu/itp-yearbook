const fs = require('fs')
const request = require('request');
const _ = require('lodash')

const startYear = 1981
const endYear = 2019
const allStudents = []

function getYear(year) {
  if (year > endYear) {
    // if last one, then unique and write
    _.uniq(allStudents)
    console.log(`final: ${allStudents.length}`)
    fs.writeFileSync('./data/allStudents.json', JSON.stringify(allStudents), {encoding: 'utf8'})
    return
  }

  const options = {
     url: `https://itp.nyu.edu/ranch/api/itp-yearbook/${year}`,
     strictSSL: false
  }
  request(options, function (error, response, body) {
    if (error) {
      console.error(error)
      return getYear(year + 1)
    }
    const students = JSON.parse(body)
    _.each(students, ({netid}) => allStudents.push(netid))
    fs.writeFileSync('./data/allStudents.json', JSON.stringify(allStudents), {encoding: 'utf8'})

    console.log(`${year}: ${allStudents.length}`)
    getYear(year + 1)
  });
}

getYear(startYear)

// https://itp.nyu.edu/people_pics/flash/wolff-mills_a_934267.jpg
