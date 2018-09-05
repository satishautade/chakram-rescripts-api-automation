
var chakram = require('chakram');
var parser = require('xml2json');
var Papa = require('papaparse');
var fs = require('fs');
var moment = require('moment');

module.exports = {

  randomNumber: function (length) {
    return Math.random().toString(10).substring(2,length+2);
  },

  currTime: function(){
    return moment().format('YYYYMMDDHHmmssZZ');
  },

  parseSessionId: function(xmlData) {
    console.log("Inside parseSessionId :Data Received => " + xmlData.body);
    var jsonObj = JSON.parse(parser.toJson(xmlData.body));
    console.log(jsonObj);
    return jsonObj["soap:Envelope"]["soap:Body"]["loginResponse"]["sessionId"];
  },

  parseReferenceNumber: function (xmlData){
    console.log("Inside parseReferenceNumber :Data Received => " + xmlData.body);
    var jsonObj = JSON.parse(parser.toJson(xmlData.body));
    console.log("Inside parseReferenceNumber :Data Parsed => " + jsonObj);
    return jsonObj["soap:Envelope"]["soap:Body"]["sendRequestResponse"]["sendRequestResult"];
  }

};