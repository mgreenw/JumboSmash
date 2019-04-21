// @flow

function generateVerificationEmail(code: string, link: string = 'https://jumbosmash.com') {
  // TO UPDATE:
  // 1. Delete copy the following string into an empty file for reference.
  // 2. Copy the new template string here.
  // 3. Add the ${code} and ${link} paramaters into the correct places using the
  //    reference file you made. NOTE: There are 2 places where ${code} is used
  // That's all folks!
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <!--<![endif]-->
        <!--[if (gte mso 9)|(IE)]>
          <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
        <![endif]-->
        <!--[if (gte mso 9)|(IE)]>
          <style type="text/css">
            body {width: 600px;margin: 0 auto;}
                  table {border-collapse: collapse;}
                  table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
                  img {-ms-interpolation-mode: bicubic;}
          </style>
        <![endif]-->
        <!--user entered Head Start-->
        <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600" rel="stylesheet">
        <!--End Head user entered-->
        <style type="text/css">
          @media screen and (max-width:480px) {
                  .preheader .rightColumnContent,
                  .footer .rightColumnContent {
                      text-align: left !important;
                  }
                  .preheader .rightColumnContent div,
                  .preheader .rightColumnContent span,
                  .footer .rightColumnContent div,
                  .footer .rightColumnContent span {
                    text-align: left !important;
                  }
                  .preheader .rightColumnContent,
                  .preheader .leftColumnContent {
                    font-size: 80% !important;
                    padding: 5px 0;
                  }
                  table.wrapper-mobile {
                    width: 100% !important;
                    table-layout: fixed;
                  }
                  img.max-width {
                    height: auto !important;
                    max-width: 480px !important;
                  }
                  a.bulletproof-button {
                    display: block !important;
                    width: auto !important;
                    font-size: 80%;
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                  }
                  .columns {
                    width: 100% !important;
                  }
                  .column {
                    display: block !important;
                    width: 100% !important;
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                    margin-left: 0 !important;
                    margin-right: 0 !important;
                  }
                }
        </style>
      </head>
      <body style="font-family:Source Sans Pro,sans-serif;font-size:14px;color:#000000;">
        <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size: 14px; font-family: helvetica,arial,sans-serif; color: #000000; background-color: #ffffff;">
          <div class="webkit" style="font-family:Source Sans Pro,sans-serif;font-size:14px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ffffff" style="table-layout:fixed;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;-moz-text-size-adjust:100%;-ms-text-size-adjust:100%;width:100% !important;">
              <tr>
                <td valign="top" bgcolor="#ffffff" width="100%">
                  <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="100%">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td>
                              <!--[if mso]>
                                <center>
                                  <table>
                                    <tr>
                                      <td width="600">
                              <![endif]-->
                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center">
                                <tr>
                                  <td role="modules-container" style="padding: 0px 0px 0px 0px; color: #000000; text-align: left;" bgcolor="#ffffff" width="100%" align="left">
                                    <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
                                      <tr>
                                        <td role="module-content">
                                          <p style="font-family:Source Sans Pro,sans-serif;font-size:14px;margin:0;padding:0;">Verification Code: ${code}</p>
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                      <tr>
                                        <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;-moz-text-size-adjust:100%;-ms-text-size-adjust:100%;width:100% !important;table-layout: fixed;">
                                      <tr>
                                        <td style="font-size:6px;line-height:10px;padding:0px 0px 0px 0px;" valign="top" align="center">
                                          <img class="max-width" border="0" style="max-width:100% !important;display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:60% !important;width:60%;height:auto !important;" src="https://marketing-image-production.s3.amazonaws.com/uploads/198566773506ae260f5303588bd20cb65fc677e2a6532e420bf2a8c975dd5bef2361f9cfd03d0f834c73745713d9e682f3ba2f25157cf116a73095489000e58d.png" alt="text-logo" data-proportionally-constrained="true" width="360">
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                      <tr>
                                        <td style="padding:0px 0px 0px 0px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor="">
                                          <div style="font-family:Source Sans Pro,sans-serif;font-size:14px;text-align: center;"><span style="font-size:20px;"><strong><span style="color:#38c7cc;">Swipe. Swipe. Smash</span></strong></span></div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                      <tr>
                                        <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;-moz-text-size-adjust:100%;-ms-text-size-adjust:100%;width:100% !important;table-layout: fixed;">
                                      <tr>
                                        <td style="font-size:6px;line-height:10px;padding:0px 0px 0px 0px;" valign="top" align="center">
                                          <img class="max-width" border="0" style="max-width:100% !important;display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;" data-proportionally-constrained="true" width="175" height="145" src="https://marketing-image-production.s3.amazonaws.com/uploads/fa89466a69a7bb4d2a4d73ba1f78c8e0074ef6294f21d8f30db8c26d5b02eb7b55ed7b881849851d46aba238cd92277f247852739514bb4db31ca5866bff4d40.png" alt="arthur">
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                      <tr>
                                        <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                      <tr>
                                        <td style="padding:0px 0px 0px 0px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor="">
                                          <div style="font-family:Source Sans Pro,sans-serif;font-size:14px;text-align: center;"><span style="font-size:18px;">Hey there!</span></div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                      <tr>
                                        <td style="padding:0px 0px 15px 0px;" role="module-content" bgcolor="">
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                      <tr>
                                        <td style="padding:0px 20px 0px 20px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor="">
                                          <div style="font-family:Source Sans Pro,sans-serif;font-size:14px;text-align: center;"><span style="font-size:24px;"><strong>Verification Code: ${code}</strong></span></div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                      <tr>
                                        <td style="padding:0px 0px 15px 0px;" role="module-content" bgcolor="">
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                      <tr>
                                        <td style="padding:0px 20px 0px 20px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor="">
                                          <div style="font-family:Source Sans Pro,sans-serif;font-size:14px;text-align: center;"><span style="color:#9B9B9B;">Please enter your code in the JumboSmash app to verify your account. If you did not sign into JumboSmash, please ignore this email or contact the team at support@jumbosmash.com</span></div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                      <tr>
                                        <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
                                        </td>
                                      </tr>
                                    </table>
                                    <table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed" width="100%">
                                      <tbody>
                                        <tr>
                                          <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px">
                                            <table border="0" cellpadding="0" cellspacing="0" class="button-css__deep-table___2OZyb wrapper-mobile" style="text-align:center">

                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                      <tr>
                                        <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                      <tr>
                                        <td style="padding:0px 20px 0px 20px;line-height:14px;text-align:inherit;" height="100%" valign="top" bgcolor="">
                                          <div style="font-family:Source Sans Pro,sans-serif;font-size:14px;text-align: center;"><span style="font-size:12px;"><span style="color:#9B9B9B;">JumboSmash is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Tufts University, or any of its subsidiaries or affiliates.</span></span></div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                              <!--[if mso]>
                              </td>
                            </tr>
                          </table>
                        </center>
                              <![endif]-->
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </center>
      </body>
    </html>
  `;
}

module.exports = generateVerificationEmail;
