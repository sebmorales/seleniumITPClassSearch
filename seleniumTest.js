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

// var driver=new webdriver.Builder().forBrowser('chrome').build();
var driver=new webdriver.Builder().forBrowser('chrome').build();

var registering=false;
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: '******@gmail.com',
        pass: '******'
    }
});

let mailOptions = {
    from: '"Seb ITP Classes" <sebnodejs@gmail.com>', // sender address
    to: 'sebmoralesprado@gmail.com',
    subject: 'class status changed! ', // Subject line
    text: 'log into your nyu acount', // plain text body
    html: '<b>log into your nyu acount</b>' // html body
};

let classes=[{//name, number=
  name: 'Programming from A-Z',
  number: '269',
  id: '22087'
},
{
  name: 'Live Web',
  number: '457',
  id: '22039'
},
{
  name: 'Understanding Networks',
  number: '526',
  id: '22094'
},
{
  name: 'NIME',
  number: '105',
  id: '22084'
}
];

navigateDepartment();

function startCheck(){
  // for (var i=0;i<classes.length-1;i++){
  //   navigateClass(classes[i]);//Programming A-Z 269
  // }
  setTimeout(function(){navigateClass(classes[0]);},10);
  setTimeout(function(){navigateClass(classes[1]);},8000);
  // setTimeout(function(){navigateClass(classes[2]);},10000);
  // setTimeout(function(){navigateClass(classes[3]);},15000);

}

function navigateDepartment() { //go from main page of all departments into ITP class search
  driver.get('https://sis.nyu.edu/psc/csprod/EMPLOYEE/CSSS/c/NYU_SR.NYU_CLS_SRCH.GBL?Page=NYU_CLS_SRCH&Action=U&ExactKeys=Y&TargetFrameName=None');
  driver.manage().timeouts().pageLoadTimeout(4000);
  driver.executeScript('javascript:submitAction_win0(document.win0,"LINK1$365");');//go to ITP
  driver.manage().timeouts().pageLoadTimeout(10000);
  driver.wait(webdriver.until.elementLocated({id: 'win0divNYU_CLS_DERIVED_TERM$105'}),19000).then(function (){startCheck();});//check for nime existance (just make sure you are there)
}

function clickClass(classNo){// this serves to check the status and refresh the search
    driver.findElement({xpath: '//*[@id="NYU_CLS_DERIVED_TERM$'+classNo.number+'"]/img'}).click();
    setTimeout(function(){navigateClass(classNo);},5500);
}

function navigateClass(classObject){
  if(!registering){
    var classID= 'win0divNYU_CLS_DERIVED_TERM$'+classObject.number;
    driver.wait(webdriver.until.elementLocated(By.id(classID)),1900).getText().then(function(txt) { //get class description

    //driver.findElement(By.id(classID)).getText().then(function(txt) { //get class description

      if(txt.indexOf("Class Status: Open") !== -1){//unlikely
        console.log(classObject.name+" is open");
        driver.findElement({xpath: '//*[@id="NYU_CLS_DERIVED_TERM$'+classObject.number+'"]/img'}).click();
        setTimeout(function(){navigateClass(classObject);},120000);
        enroll(classObject.id);

      }else if(txt.indexOf("Class Status: Wait List") !== -1){
        console.log(classObject.name+" is Wait List");
        mailOptions.subject=classObject.name+' status has changed';
        mailOptions.html=classObject.name+' ('+classObject.id+') is now waitlisted. ';
        mailOptions.text=classObject.name+' ('+classObject.id+') is now waitlisted.<br>https://admin.portal.nyu.edu/ ';
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
        });
        enroll(classObject.id);
        registering=true;
      }else if (txt.indexOf("Class Status: Closed")!==-1){
        console.log(classObject.name+" is closed");
        driver.findElement({xpath: '//*[@id="NYU_CLS_DERIVED_TERM$'+classObject.number+'"]/img'}).click();
        setTimeout(function(){navigateClass(classObject);},120000);

      }else{
         setTimeout(function(){clickClass(classObject);},10);
      }
    }, function(err) {
      console.log("error cought");
        navigateClass(classObject);
     });
 }
}


var usr='******';//nyu netid
var psw='******';//nyu password

function enroll(classNumber){
  console.log("Will register for class "+ classNumber);
  var loginURL='https://admin.portal.nyu.edu/psp/paprod/EMPLOYEE/CSSS/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL?FolderPath=PORTAL_ROOT_OBJECT.NYU_STUDENT_CTR&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder&cmd=login&errorCode=127&languageCd=ENG';
  driver.get(loginURL);
  driver.manage().timeouts().pageLoadTimeout(6000);
  driver.findElement(By.id("userid")).sendKeys(usr);
  driver.findElement(By.id("pwd")).sendKeys(psw);
  driver.findElement(By.className('psloginbutton')).click();//get main page
  driver.switchTo().frame("ptifrmtgtframe");// swithc iframe
  driver.wait(webdriver.until.elementLocated(By.id('DERIVED_SSS_SCR_SSS_LINK_ANCHOR4')),19000).click();//click in enroll
  //driver.wait(webdriver.until.elementLocated(By.id('SSR_DUMMY_RECV1$sels$1$$0')),19000).click().then(function(){driver.findElement(By.id('DERIVED_SSS_SCT_SSR_PB_GO')).click();});//click in fall, continue
  // driver.wait(webdriver.until.elementLocated(By.id('DERIVED_REGFRM1_CLASS_NBR')),19000).sendKeys(classNumber).then(function(){driver.findElement(By.id('DERIVED_CLS_DTL_WAIT_LIST_OKAY$125$'))}).then().click(function(){driver.findElement(By.id('DERIVED_REGFRM1_SSR_PB_ADDTOLIST2$9$'));});//enter class, click next
  driver.wait(webdriver.until.elementLocated(By.id('DERIVED_REGFRM1_CLASS_NBR')),19000).sendKeys(classNumber).then(function(){driver.findElement(By.id('DERIVED_REGFRM1_SSR_PB_ADDTOLIST2$9$')).click();});//enter class, click next
  driver.wait(webdriver.until.elementLocated(By.id('DERIVED_CLS_DTL_WAIT_LIST_OKAY$125$'))).click().then(function(){driver.findElement(By.id('DERIVED_CLS_DTL_NEXT_PB$280$')).click();});
  driver.wait(webdriver.until.elementLocated(By.id('win0divDERIVED_REGFRM1_LINK_ADD_ENRL$82$')),19000).click();// Step 2/3
  driver.wait(webdriver.until.elementLocated(By.id('DERIVED_REGFRM1_SSR_PB_SUBMIT')),19000).click();//finish enrolling
}
