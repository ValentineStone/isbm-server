'use strict'

const nodemailer = require('nodemailer')

const gmailEmail = 'magbaget.noreply@gmail.com'
const gmailPassword = 'MagbagetNoreplyPassword'
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
})

function sendNoreplyEmail(email) {
  email.from = '"Goldbaget Noreply" <magbaget.noreply@gmail.com>'
  email.to = 'magbaget@gmail.com'
  return mailTransport.sendMail(email)
}


module.exports = emailProps => {
  return sendNoreplyEmail(emailProps)
    .then(() => 'success')
}