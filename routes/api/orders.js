const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator')
const nodemailer = require('nodemailer')

const Order = require('../../model/Order.js')



router.post('/api/basket', [
  check('name', 'име jе обавезно').not().isEmpty(),
  check('email', 'унесите исправну e-mail адресу').isEmail(),
  check('phone', 'унесите исправни броj телефона').not().isEmpty().isNumeric()
  
  
], async(req, res) => {
    const{id, name, phone, email, 
      address, items,  message, totalPrice} = req.body
    const errors =  validationResult(req)
    
    try {
      const order = new Order({
            id, name,
            phone, email, 
            items, address,
            message, totalPrice 
    })
        if(!errors.isEmpty()) {
          return res.status(400).json({errors: errors.array()})
        }
        await order.save(function(err, icon) {
          if(err) {
            return res.status(500).send({msg: err.message})
          }
          var transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "b188429341e154",
              pass: "ebde6947ef958d"
            }
          });
          let message1 = `<h2 style="color: blue;">Потврда поручбине на Свети Лука:</h2>
                          <h3>Броj ваше поручбине jе: <span style="color: grey;">${icon._id}.</span></h3>
                          <h3>Поручили сте:</h3>`
          items.forEach(icon => {
            const board = icon.board === 'oval' ? 'Полукружна' : 'Четвртаста'
            message1 += `<ul style="list-style: none; margin-bottom: 30px;">
                          <li><span style="font-weight: bold; margin-right: 20px;">Назив:</span><span>${icon.name}</span></li>
                          <li><span style="font-weight: bold; margin-right: 20px;">Димензиjа:</span><span>${icon.size}см</span></li>
                          <li><span style="font-weight: bold; margin-right: 20px;">Количина:</span><span>${icon.quantity}</span></li>
                          <li><span style="font-weight: bold; margin-right: 20px;">Даска:</span><span>${board}</span></li>
                          <li><span style="font-weight: bold; margin-right: 20px;">Цена:</span><span>€${icon.price}</span></li>
                        </ul>`
          });
           
          message1 += `<p>Укупна цена ваше наручбине je: <span style="font-weight: bold; margin-right: 20px;">€${totalPrice}.</span></p>
                      <p>Ускоро чемо вас контактирати у вези детальа ваше поручбине.</p>
                      <p>Ако имате нека питаньа можете контактирати нас на меjл <span style = "font-weight: bold;">
                      info@svetilukaicons.com.</span></p>`
                      
          let message2 = `<h2 style="color: blue;">You received an order for Sveti Luka</h2>
                          <h3>Order id is: <span style="color: grey;">${icon._id}.</span></h3>
                          <h3>Total price is ${totalPrice}</h3>
                          <h3>The following items were ordered:</h3>`
          items.forEach(icon => {
            const board = icon.board === 'oval' ? 'Полукружна' : 'Четвртаста'
            message2 += `<ul style="list-style: none; margin-bottom: 30px;">
                          <li><span style="font-weight: bold; margin-right: 20px;">Назив:</span><span>${icon.name}</span></li>
                          <li><span style="font-weight: bold; margin-right: 20px;">Димензиjа:</span><span>${icon.size}см</span></li>
                          <li><span style="font-weight: bold; margin-right: 20px;">Количина:</span><span>${icon.quantity}</span></li>
                          <li><span style="font-weight: bold; margin-right: 20px;">Даска:</span><span>${board}</span></li>
                          <li><span style="font-weight: bold; margin-right: 20px;">Цена:</span><span>€${icon.price}</span></li>
                      </ul>`
          });
           
          message2 += `
          <h2>Customer information:</h2>
          <ul>
          <li><span style="font-weight: bold; margin-right: 20px;">Name:</span><span>${name}</span></li>
          <li><span style="font-weight: bold; margin-right: 20px;">Email:</span><span>${email}</span></li>
          <li><span style="font-weight: bold; margin-right: 20px;">Phone:</span><span>${phone}</span></li>
          <li><span style="font-weight: bold; margin-right: 20px;">Message:</span><span>${message}</span></li>
        </ul>`
                      
          
          const mailOptions1 = {
            from: 'info@svetilukaicons.com',
            to: email,
            subject: 'Поручбина иконе на Свети Лука',
            html: message1
        }
        const mailOptions2 = {
          from: 'info@icons.com',
          to: 'zhelibon@gmail.com',
          subject: 'new order from Sveti Luka',
          text: `You received a new order number ${icon.id}`,
          html: message2
          
      }
        transport.sendMail(mailOptions1, function(err) {
          if(err) {
            console.log(err)
          }
          console.log('email sent to ' + mailOptions.to)
        })
        transport.sendMail(mailOptions2, function(err) {
          if(err) {
            console.log(err)
          }
          console.log('email sent to ' + mailOptions.to)
        })
            req.session.destroy();
        res.status(200).send(icon)
        })
    
    } catch (error) {
        console.error(error.message)
        res.status(500).send('server error')
    }
    
})

module.exports = router
