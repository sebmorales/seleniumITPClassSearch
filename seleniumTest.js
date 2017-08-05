////////////////////////////////////////////////////////////////
//  The following script will check if NYU, in particular
//  ITP Classes are: closed, open or waitlisted, ideally
//  then contacting the student (me), soon as the status
//  changes.
//
////////////////////////////////////////////////////////////////
'use strict';
const nodemailer = require('nodemailer');
var webdriver=require('selenium-webdriver'),
By = webdriver.By;
var phantomjs = require('phantomjs')

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

let classes=[{
  name: 'Programming from A-Z',
  number: '269'
},
{
  name: 'NIME',
  number: '105'
},
{
  name: 'Understanding Networks',
  number: '526'
}
];

navigateDepartment();

function foreverCheck(){
  navigateClass(classes[0]);//Programming A-Z 269
  navigateClass(classes[1]);//Programming A-Z 269
  navigateClass(classes[2]);//Programming A-Z 269

  // navigateClass(457);//liveWeb
  // navigateClass(526);//understanding Networks
  setTimeout(function(){foreverCheck();}, 40000);

// navigateClass(451);//basic analog circuits
// navigateClass(83);//liveWeb
}

function navigateDepartment() {
  driver.get('https://sis.nyu.edu/psc/csprod/EMPLOYEE/CSSS/c/NYU_SR.NYU_CLS_SRCH.GBL?Page=NYU_CLS_SRCH&Action=U&ExactKeys=Y&TargetFrameName=None');
  driver.manage().timeouts().pageLoadTimeout(4000);
  driver.executeScript('javascript:submitAction_win0(document.win0,"LINK1$364");');//go to ITP
  driver.manage().timeouts().pageLoadTimeout(10000);
  driver.wait(webdriver.until.elementLocated({id: 'win0divNYU_CLS_DERIVED_TERM$105'}),19000);//check for nime existance (just make sure you are there)
  foreverCheck();
}

function clickClass(classNo){
    driver.findElement({xpath: '//*[@id="NYU_CLS_DERIVED_TERM$'+classNo+'"]/img'}).click();
}

function navigateClass(classObject){
  //var classXpath='//*[@id="NYU_CLS_DERIVED_TERM$'+classObject.number+'"]/img';
  var classID= 'win0divNYU_CLS_DERIVED_TERM$'+classObject.number;
  //console.log(classID);
  driver.findElement(By.id(classID)).getText().then(function(txt) {
  //  console.log(txt);
    if(txt.indexOf("Class Status: Open") !== -1){
      console.log(classObject.name+" is open");
    }else if(txt.indexOf("Class Status: Wait List") !== -1){
      console.log(classObject.name+" is Wait List");
    }else if (txt.indexOf("Class Status: Closed")!==-1){
      console.log(classObject.name+" is closed");
    }else{
      setTimeout(function(){clickClass(classObject.number);},3000);
    }
  }, function(err) { });
}
