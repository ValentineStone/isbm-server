const fs = require('fs')
const printer = require('printer')

var lunaJpg = fs.readFileSync('frog.txt')

//console.log(printer.getSupportedPrintFormats())

printer.printDirect({
  data: lunaJpg,//'Princess Luna',
  printer: 'Samsung M332x 382x 402x Series (USB001)',
  type: 'TEXT', //NT EMF 1.008
  success: jobID => console.log("sent to printer with ID: " + jobID),
  error: console.log
})