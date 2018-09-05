var chakram = require('chakram');
var expect = chakram.expect;
var parser = require('xml2json');
var Papa = require('papaparse');
var fs = require('fs');
var helpers = require('../lib/helpers.js');

describe("Create Script Request for GPConnect Doctor", function () {
  let TEST_DATA;
  let BASEURL = "https://t1.hnotes.com.au/rescripts8/services/";

  let USER_SESSION_BODY = fs.readFileSync('./data/user_session_body.xml', 'utf8');
  let SCRIPT_REQUEST_BODY = fs.readFileSync('./data/script_request_body.xml', 'utf8');

  let options = {
    headers: {
      "SOAPAction": "http://www.healthenterprises.com.au/rescripts/UserSession/login",
      "Content-Type": "application/xml"
    },
    simple: false,
    json: false
  }

  this.beforeAll(() => {

    const TEST_DATA_FILE = fs.readFileSync('./data/test_data.csv', 'utf8');
    TEST_DATA = Papa.parse(TEST_DATA_FILE, {
      //returns data with keys
      header: true
    }).data;

  });

  it("should make a script request for each row of data using new session id", () => {

    for(const dataRow of TEST_DATA){

      console.log('**********************BEFORE*************************************');
      return chakram.post(BASEURL + 'UserSessionService', eval(USER_SESSION_BODY), options)
        .then(function (userSessionResponse) {
          expect(userSessionResponse).to.have.status(200);
          var sessionId = helpers.parseSessionId(userSessionResponse);
          console.log("shiny new session => " + sessionId);
          options.headers["SOAPAction"] = "http://www.healthenterprises.com.au/rescripts/Script/sendRequest";
          options.headers["Content-Type"] = "text/xml";
          return chakram.post(BASEURL + 'ScriptService', eval(SCRIPT_REQUEST_BODY), options)
        })
        .then(function (scriptRequestResponse) {
          expect(scriptRequestResponse).to.have.status(200);
          var referenceNo = helpers.parseReferenceNumber(scriptRequestResponse);
          console.log("Finally Our Reference no => " + referenceNo);
          return chakram.wait();
        });
    };
  });
});