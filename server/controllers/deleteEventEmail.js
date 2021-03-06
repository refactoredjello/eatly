
const nodemailer = require('nodemailer')
const gmailCreds = require('../keys/gmailCreds.json')

//sets up connection with team's gmail account, passing in secret keys
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: gmailCreds.user,
		pass: gmailCreds.pass
	}
})



/*  
    this function inits all necessary fields for email message.
    its rendered as a function so that data can be passed in dynamically from front
    all data is generated from the create event component the user fills in
*/
const mailOptions = function(email, hostName, eventName) {
 return {
	from: 'team.eatly@gmail.com',
	to: email,
	subject: `${hostName} canceled the event ${eventName} :(`,
	html:
      `<style>
      @media only screen and (max-width: 620px) {
        table[class=body] h1 {
          font-size: 28px !important;
          margin-bottom: 10px !important;
        }
        table[class=body] p,
              table[class=body] ul,
              table[class=body] ol,
              table[class=body] td,
              table[class=body] span,
              table[class=body] a {
          font-size: 16px !important;
        }
        table[class=body] .wrapper,
              table[class=body] .article {
          padding: 10px !important;
        }
        table[class=body] .content {
          padding: 0 !important;
        }
        table[class=body] .container {
          padding: 0 !important;
          width: 100% !important;
        }
        table[class=body] .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important;
        }
        table[class=body] .btn table {
          width: 100% !important;
        }
        table[class=body] .btn a {
          width: 100% !important;
        }
        table[class=body] .img-responsive {
          height: auto !important;
          max-width: 100% !important;
          width: auto !important;
        }
      }

      @media all {
        .ExternalClass {
          width: 100%;
        }
        .ExternalClass,
              .ExternalClass p,
              .ExternalClass span,
              .ExternalClass font,
              .ExternalClass td,
              .ExternalClass div {
          line-height: 100%;
        }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important;
        }
        .btn-primary table td:hover {
          background-color: #34495e !important;
        }
        .btn-primary a:hover {
          background-color: #34495e !important;
          border-color: #34495e !important;
        }
      }
      </style>

    <body class="" style="background-color: #afacac; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
      <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #e6f2ff">
        <tr>
          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
          <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
            <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">


              <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">
                Unfortunate news regarding ${hostName}'s meal with Eatly... it's been canceled :(</span>
              
              <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 6px; border: 3px solid #0066cc">

                <tr>
                  <td class="wrapper" style="font-family: sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                      <tr>
                        <td style="font-family: sans-serif; font-size: 16px; vertical-align: top;">
                          
                          <p style="font-family: sans-serif; font-size: 35px; font-weight: bold; margin: 0; Margin-bottom: 15px;">
                            Hello food friend.</p>
                          
                          <p style="font-family: sans-serif; font-weight: normal; margin: 0; Margin-bottom: 15px; display: inline-block;">
                              We've got some bad news on behalf of 
                              
                              <div style="font-size: 20px; display: inline-block; margin-left: 8px; font-weight: bold; color: #00264d">
                              ${hostName}.</div> <br>

                              They had to cancel the group outing, ${eventName}<br> 
                              
                              The silver lining is it's just as simple for you to make a new event! Why not share the love with ${hostName} and crew, and plan your very own outing with
                              <div style="font-size: 18px; display: inline-block; margin-left: 5px; font-weight: bold; color: #d30808;">
                              Eatly
                            </div>
                              All you have to do is cook up a time, neighborhood, and who you want to join. 
                              Then watch and wait as the votes trickle in and till the clock counts down to cut off time. 
                              When that time comes, we at eatly will calculate the results of your friends' votes and surprise you all with the results!
                          </p>

                          <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                            <tbody>
                              <tr>
                                <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                                  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                    <tbody>
                                      <tr>
                                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #0066cc; text-align: center;"> <a href="http://eatly.herokuapp.com" target="_blank" style="display: inline-block; color: #ffffff; border: solid 3px #66b3ff; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 18px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize;">Eatly!</a> </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                  <tr>
                    <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #636262; text-align: center;">
                      <span class="apple-link" style="color: #636262; font-size: 12px; text-align: center;">Team Franklin, HRNYC11, New York, NY</span>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </td>
          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
        </tr>
      </table>
    </body>
  </html>`
  }
}

//the actual send email function that takes in same dynamic data
//also passes along the mailOptions object generated in previous function
const sendDeleteEventEmail = function(email, hostName, eventName) { 
  transporter.sendMail(mailOptions(email, hostName, eventName), function(err, info){
    if(err)
  		console.log(err)
  	else
  		console.log(info)
  })
}

exports.sendDeleteEventEmail = sendDeleteEventEmail