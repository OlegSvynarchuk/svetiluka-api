const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator')
const nodemailer = require('nodemailer')


router.post('/api/send', [
        check('name', 'име jе обавезно').not().isEmpty(),
        check('iconName', 'назив jе обавезан').not().isEmpty(),
        check('email', 'унесите исправну e-mail адресу').isEmail(),
        check('phone', 'унесите исправан броj телефона').isNumeric(),
        check('fileSize', 'величина максимум 1 мб').isInt({max: 120000})
      ],(req, res) => {
        const { email,  iconName, 
         message, base64, fileName} = req.body 
         const errors =  validationResult(req)       
         try {
             if(!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()})
                }
                var transport = nodemailer.createTransport({
                        host: "smtp.mailtrap.io",
                        port: 2525,
                        auth: {
                          user: "b188429341e154",
                          pass: "ebde6947ef958d"
                        }
                      });
                      let emailmessage = `<h2 style="color: blue;">Your order from sveti luka is:</h2>
                                     <p>${iconName}</p>
                                     <p>${email}</p>
                                     <p>${message}</p>           
                                    `
                    const mailOptions = fileName ? {
                        from: 'info@icons.com',
                        to: email,
                        subject: 'order',
                        text: `You ordered from svetiluka.com.`,
                        html: emailmessage,
                        attachments: [
                          {
                          filename: fileName,
                          contentType:  'image/jpeg',
                          content: new Buffer.from(base64.split("base64,")[1], "base64"),
                          }
                          ]
                    }   : 

                    {
                      from: 'info@icons.com',
                      to: email,
                      subject: 'order',
                      text: `You ordered from svetiluka.com.`,
                      html: emailmessage
                      
                  } 

                    transport.sendMail(mailOptions, function(err) {
                        if(err) {
                          console.log(err)
                        }
                        console.log('email sent to ' + mailOptions.to)
                      })
                      res.status(200).send('email sent')   
                
         } catch(error) {
                console.error(error.message)
                res.status(500).send('server error')
         }
   
})


module.exports = router