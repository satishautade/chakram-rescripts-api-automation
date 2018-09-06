var chakram = require('chakram');
var expect = chakram.expect;
var parser = require('xml2json');
var Papa = require('papaparse');
var fs = require('fs');
var helpers = require('../lib/helpers.js');

describe("Create Script Request for GPConnect Doctor", function () {
  let testData;
  const BASEURL = "https://t1.hnotes.com.au/rescripts8/services/";

  const USER_SESSION_BODY = fs.readFileSync('./data/user_session_body.xml', 'utf8');
  const SCRIPT_REQUEST_BODY = fs.readFileSync('./data/script_request_body.xml', 'utf8');

  let options = {
    headers: {
      "SOAPAction": "http://www.healthenterprises.com.au/rescripts/UserSession/login",
      "Content-Type": "application/xml"
    },
    simple: false,
    json: false
  }

  this.beforeAll(() => {

    const testDataFile = fs.readFileSync('./data/test_data.csv', 'utf8');
    testData = Papa.parse(testDataFile, {
      //returns data with keys
      header: true
    }).data;

  });

  it("should make a script request for each row of data using new session id", async () => {

    for(const dataRow of testData){

      options = helpers.setHeadersForUserSession(options);
      await chakram.post(BASEURL + 'UserSessionService', eval(USER_SESSION_BODY), options)
        .then(function (userSessionResponse) {
          expect(userSessionResponse).to.have.status(200);
          var sessionId = helpers.parseSessionId(userSessionResponse);
          options = helpers.setHeadersForScriptRequest(options);
          return chakram.post(BASEURL + 'ScriptService', eval(SCRIPT_REQUEST_BODY), options)
        })
        .then(function (scriptRequestResponse) {
          expect(scriptRequestResponse).to.have.status(200);
          var referenceNo = helpers.parseReferenceNumber(scriptRequestResponse);
          console.log("Finally Our Reference no => " + referenceNo);
        })
        .catch((err)=> {
          throw new Error(err.message);
        });
      
    };
    return chakram.wait();
  });
});