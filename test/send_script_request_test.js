var chakram = require('chakram');
var expect = chakram.expect;
var parser = require('xml2json');
var Papa = require('papaparse');
var fs = require('fs');
var helpers = require('../lib/helpers.js');

let testData;
const BASEURL = "https://t1.hnotes.com.au/rescripts8/services/";

const USER_SESSION_BODY = fs.readFileSync('./data/user_session_body.xml', 'utf8');
const SCRIPT_REQUEST_BODY = fs.readFileSync('./data/script_request_body.xml', 'utf8');

let options = {
  headers: {
  },
  simple: false,
  json: false
}

describe("Create Script Request for GPConnect Doctor", function () {

  this.beforeAll(() => {
    const testDataFile = fs.readFileSync('./data/test_data.csv', 'utf8');
    testData = Papa.parse(testDataFile, {
      //returns data with keys
      header: true
    }).data;
  });

  it("should make a script request for each row of data using new session id", async () => {

    for (const dataRow of testData) {
      var response = await sendScriptRequest(dataRow, options);
      console.log("Response Number => " +  JSON.stringify(response.referenceNumber));
      console.log("For Data Row => " + JSON.stringify(dataRow));
    };
    return chakram.wait();
  });

});

async function sendScriptRequest(dataRow, options) {
  var res = {
    "scriptRequestResponse" : null,
    "userSessionResponse": null,
    "referenceNumber" : []
  };
  options = helpers.setHeadersForUserSession(options);
  await chakram.post(BASEURL + 'UserSessionService', eval(USER_SESSION_BODY), options)
    .then(function (userSessionResponse) {
      expect(userSessionResponse).to.have.status(200);
      var sessionId = helpers.parseSessionId(userSessionResponse);
      res.userSessionResponse = userSessionResponse;
      options = helpers.setHeadersForScriptRequest(options);
      return chakram.post(BASEURL + 'ScriptService', eval(SCRIPT_REQUEST_BODY), options);
    })
    .then(function (scriptRequestResponse) {
      expect(scriptRequestResponse).to.have.status(200);
      res.scriptRequestResponse = scriptRequestResponse;
      res.referenceNumber = helpers.parseReferenceNumber(scriptRequestResponse);
    })
    .catch((err) => {
      console.log("ERROR processing Data Row => " + JSON.stringify(dataRow));
      throw new Error(err.message);
    });
    return res;
}
