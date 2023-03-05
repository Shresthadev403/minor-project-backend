"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(email,userTravelData) {
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: "mygaming.sta@gmail.com",
        pass: "fxynrfliriphgfpd"
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'shresthadev403@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Your Travel Details", // Subject line
    text: `See your travel details  ` , // plain text body
    html:`<p>:</p>
    <p>Date:${(new Date() ).toISOString()}</p>
    <p>userTravelId:${userTravelData.id}</p>
    <p>your Id:${userTravelData.userId}</p>
    <p>your start location:${userTravelData.startLocation}</p>
    <p>your destination location:${userTravelData.destinationLocation}</p>

    <p>distance travelled:${userTravelData.distanceTravelled}</p>
    <p>price rate per meter:${userTravelData.priceRate}</p>
    <p>Total price:${userTravelData.distanceTravelled*userTravelData.priceRate}</p>
    <p></p>
    <p></p>

    <p></p>` // html body
  });


}

module.exports=sendMail;