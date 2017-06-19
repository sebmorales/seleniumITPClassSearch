////////////////////////////////////////////////////////////////
//  The following script will check if NYU, in particular
//  ITP Classes are: closed, open or waitlisted, ideally
//  then contacting the student (me), soon as the status
//  changes.
//
////////////////////////////////////////////////////////////////

var webdriver=require('selenium-webdriver');
var driver=new webdriver.Builder().forBrowser('chrome').build();
navigateClass(83);//liveWeb
navigateClass(526);//understanding Networks
navigateClass(451);//basic analog circuits
navigateClass(457);//liveWeb

function navigateClass(classNumber){
  var classStatusXpath;
  if (classNumber<100){
    var classStatusXpath='//*[@id="win0divNYU_CLS_DERIVED_HTMLAREA3$'+(classNumber+1)+'"]/div/table/tbody/tr/td/span[5]';
  }else{
    classStatusXpath='//*[@id="win0divNYU_CLS_DERIVED_HTMLAREA3$'+(classNumber+4)+'"]/div/table/tbody/tr/td/span[5]';
  }
  var classXpath='//*[@id="NYU_CLS_DERIVED_TERM$'+classNumber+'"]/img';

  //check if we are already in the itp class page.
  // driver.isElementPresent({xpath: classXpath}).then(console.log("Yey"));


  // driver.get('https://sis.nyu.edu/psc/csprod/EMPLOYEE/CSSS/c/NYU_SR.NYU_CLS_SRCH.GBL?Page=NYU_CLS_SRCH&Action=U&ExactKeys=Y&TargetFrameName=None');
  // driver.manage().timeouts().pageLoadTimeout(2000);
  // driver.executeScript('javascript:submitAction_win0(document.win0,"LINK1$368");');
  // driver.manage().timeouts().pageLoadTimeout(5000);
  // console.log("error Found");
  //


  driver.get('https://sis.nyu.edu/psc/csprod/EMPLOYEE/CSSS/c/NYU_SR.NYU_CLS_SRCH.GBL?Page=NYU_CLS_SRCH&Action=U&ExactKeys=Y&TargetFrameName=None');
  driver.manage().timeouts().pageLoadTimeout(4000);
  driver.executeScript('javascript:submitAction_win0(document.win0,"LINK1$368");');
  driver.manage().timeouts().pageLoadTimeout(10000);
  driver.wait(webdriver.until.elementLocated({xpath:classXpath}),20000);
  driver.findElement({xpath: classXpath}).click();
  driver.wait(webdriver.until.elementLocated({xpath:classStatusXpath}),20000);
  // var elem=driver.findElement(webdriver.By.xpath('//*[@id="win0divNYU_CLS_DERIVED_HTMLAREA3$461"]/div/table/tbody/tr/td/span[5]')).getText().then(function(text){console.log(text);});
  var elem=driver.findElement(webdriver.By.xpath(classStatusXpath)).getText().then(function(text){checkClassStatus(text,classNumber);});
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
  }
  //else{console.log(classNumber+" "+status);}

}


// var classXpath='//*[@id="NYU_CLS_DERIVED_TERM$'+liveWeb+'"]/img';
// var classStatusXpath='//*[@id="win0divNYU_CLS_DERIVED_HTMLAREA3$'+(liveWeb+4)+'"]/div/table/tbody/tr/td/span[5]'
//
// driver.get('https://sis.nyu.edu/psc/csprod/EMPLOYEE/CSSS/c/NYU_SR.NYU_CLS_SRCH.GBL?Page=NYU_CLS_SRCH&Action=U&ExactKeys=Y&TargetFrameName=None');
// driver.manage().timeouts().pageLoadTimeout(2000);
// driver.executeScript('javascript:submitAction_win0(document.win0,"LINK1$368");');
// driver.manage().timeouts().pageLoadTimeout(5000);
// driver.wait(webdriver.until.elementLocated({xpath:classXpath}),10000);
// driver.findElement({xpath: classXpath}).click();
// driver.wait(webdriver.until.elementLocated({xpath:classStatusXpath}),15000);
// // var elem=driver.findElement(webdriver.By.xpath('//*[@id="win0divNYU_CLS_DERIVED_HTMLAREA3$461"]/div/table/tbody/tr/td/span[5]')).getText().then(function(text){console.log(text);});
// var elem=driver.findElement(webdriver.By.xpath(classStatusXpath)).getText().then(function(text){checkClassStatus(text);});







//.then(function(innerHTML){consol.log(innerHTML)};);
//console.log(elem);
//var myElement = element(by.css('.myclass'));
//
// elem.getInnerHtml().then(function(html) {
//   console.log(html);
//     //do stuff with html here
// });

//var elemInner=elem.getAttribute("innerHTML").then(function(getAttribute){console.log(elemInner);});

//*[@id="NYU_CLS_DERIVED_TERM$457"]/img
//driver.findElement(webdriver.By.name('q')).sendKeys('helo world');
// driver.findElement({name:'q'}).sendKeys(webdriver.Key.ENTER);
// driver.wait(webdriver.until.elementLocated({xpath:'//*[@id="rso"]/div[2]/div/div[1]/div/div/h3/a'}),3000);
// driver.findElement({xpath: '//*[@id="rso"]/div[2]/div/div[1]/div/div/h3/a'}).click();
 // driver.getTitle().then(function(title){console.log(title);});
// driver.quit();
