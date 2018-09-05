var chakram = require('chakram');
var parser = require('xml2json');
var Papa = require('papaparse');
var assert = require('assert');
var fs = require('fs');
var moment = require('moment');

describe("Create Script Request for GPConnect Doctor", function () {
  let TEST_DATA;
  let BASEURL = "https://t1.hnotes.com.au/rescripts8/services/";

  function randomNumber(length){
    return Math.random().toString(10).substring(2,length+2);
  }

  function currTime(){
    return moment().format('YYYYMMDDHHmmssZZ');
  }

  function parseSessionId(xmlData) {
    var jsonObj = JSON.parse(parser.toJson(xmlData.body));
    console.log(jsonObj);
    return jsonObj["soap:Envelope"]["soap:Body"]["loginResponse"]["sessionId"];
  }

  let options = {
    headers: {
      "SOAPAction": "http://www.healthenterprises.com.au/rescripts/UserSession/login",
      "Content-Type": "application/xml"
    },
    simple: false,
    json: false
  }

  let USER_SESSION_BODY = fs.readFileSync('user_session_body.xml', 'utf8');
  let SCRIPT_REQUEST_BODY = fs.readFileSync('script_request_body.xml', 'utf8');
  
  this.beforeAll(() => {

    const TEST_DATA_FILE = fs.readFileSync('test_data.csv', 'utf8');
    TEST_DATA = Papa.parse(TEST_DATA_FILE, {
      //returns data with keys
      header: true
    }).data;

  });

  it("should get a session id to be able to make a request", () => {

    TEST_DATA.forEach(async (dataRow) => {

      var sessionId = await chakram.post(BASEURL + 'UserSessionService', eval(USER_SESSION_BODY), options).
      then(
        (authResponse) => {
          chakram.expect(authResponse).to.have.status(200);
          var sessionId = parseSessionId(authResponse);
          console.log('my session' + sessionId);
          return sessionId;
        })
        .then(
          async (session_id) => {
            console.log("Inside next then => sessionId = " + session_id); 
            //change the action header
            options.headers["SOAPAction"] = "http://www.healthenterprises.com.au/rescripts/Script/sendRequest";
            //make another request 
            var referenceNumber = await chakram.post(BASEURL + 'ScriptService', (SCRIPT_REQUEST_BODY), options)
            .then(
              (res) => {
                //parse the response and validate
                console.log('SEND REQUEST RESPONSE ****** => ' + parser.toJson(res.body));
                chakram.expect(res).to.have.status(200);
                var ref = parseReferenceNumber(res);
                return ref;
              }
            )
          });

      console.log("Our Session => " + sessionId );
      // console.log("Random number of length 4 " + randomNumber(4));
      // console.log("*************************************************");
      console.log("OUR USER SESSSION REQ => " + eval(USER_SESSION_BODY));
      // console.log("*************************************************");
      // console.log("OUR USER SESSSION REQ => " + eval(SCRIPT_REQUEST_BODY));
      // console.log("*************************************************");

    });
  });


});