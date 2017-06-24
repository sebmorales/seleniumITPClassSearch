////////////////////////////////////////////////////////////////
//  The following script will check if NYU, in particular
//  ITP Classes are: closed, open or waitlisted, ideally
//  then contacting the student (me), soon as the status
//  changes.
//
////////////////////////////////////////////////////////////////
'use strict';
const nodemailer = require('nodemailer');
var webdriver=require('selenium-webdriver');
var driver=new webdriver.Builder().forBrowser('chrome').build();

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'sebnodejs@gmail.com',
        pass: 'sebnodejsITP'
    }
});

let mailOptions = {
    from: '"Seb ITP Classes" <sebnodejs@gmail.com>', // sender address
    to: 'sebmoralesprado@gmail.com',
    subject: 'class status changed! ', // Subject line
    text: 'log into your nyu acount', // plain text body
    html: '<b>log into your nyu acount</b>' // html body
};

foreverCheck();

function foreverCheck(){

  navigateClass(457);//liveWeb
  navigateClass(526);//understanding Networks
  setTimeout(function(){foreverCheck();}, 120000);

// navigateClass(451);//basic analog circuits
// navigateClass(83);//liveWeb
}

function navigateClass(classNumber){
  var classStatusXpath;
  if (classNumber<100){
    var classStatusXpath='//*[@id="win0divNYU_CLS_DERIVED_HTMLAREA3$'+(classNumber+1)+'"]/div/table/tbody/tr/td/span[5]';
  }else{
    classStatusXpath='//*[@id="win0divNYU_CLS_DERIVED_HTMLAREA3$'+(classNumber+4)+'"]/div/table/tbody/tr/td/span[5]';
  }
  var classXpath='//*[@id="NYU_CLS_DERIVED_TERM$'+classNumber+'"]/img';

  // checkExistance(classXpath,classStatusXpath,classNumber);
  driver.findElement({xpath: classXpath}).then(function(webElement) {
        driver.findElement({xpath: classXpath}).click();
        driver.wait(webdriver.until.elementLocated({xpath:classStatusXpath}),20000);
        // var elem=driver.findElement(webdriver.By.xpath('//*[@id="win0divNYU_CLS_DERIVED_HTMLAREA3$461"]/div/table/tbody/tr/td/span[5]')).getText().then(function(text){console.log(text);});
        var elem=driver.findElement(webdriver.By.xpath(classStatusXpath)).getText().then(function(text){checkClassStatus(text,classNumber);});
    }, function(err) {
        // if (err.state == 'no such element') {
        //     console.log('Element not found');
        // } else {
          driver.get('https://sis.nyu.edu/psc/csprod/EMPLOYEE/CSSS/c/NYU_SR.NYU_CLS_SRCH.GBL?Page=NYU_CLS_SRCH&Action=U&ExactKeys=Y&TargetFrameName=None');
          driver.manage().timeouts().pageLoadTimeout(4000);
          driver.executeScript('javascript:submitAction_win0(document.win0,"LINK1$368");');
          driver.manage().timeouts().pageLoadTimeout(10000);
          driver.wait(webdriver.until.elementLocated({xpath:classXpath}),20000);
          driver.findElement({xpath: classXpath}).click();
          driver.wait(webdriver.until.elementLocated({xpath:classStatusXpath}),20000);
          // var elem=driver.findElement(webdriver.By.xpath('//*[@id="win0divNYU_CLS_DERIVED_HTMLAREA3$461"]/div/table/tbody/tr/td/span[5]')).getText().then(function(text){console.log(text);});
          var elem=driver.findElement(webdriver.By.xpath(classStatusXpath)).getText().then(function(text){checkClassStatus(text,classNumber);});
        // }
    });
}

function checkClassStatus(status,classNumber){
  var className;
  if(classNumber==83){className="Sketching Communities";}
  if(classNumber==526){className="Understanding Networks";}
  if(classNumber==451){className="Basic Analog Circuits";}
  if(classNumber==457){className="LiveWeb";}

  if(status=="Closed"){
    console.log("Class "+className+" still closed");
  }
  if(status=="Open"){
    console.log("Class "+className+" now open!!!");
  }
  if(status[0]=='W'){
    console.log("Class "+className+" now waitlisted!!!");
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
  }
  //else{console.log(classNumber+" "+status);}
}
