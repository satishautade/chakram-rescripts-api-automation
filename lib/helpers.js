
var chakram = require('chakram');
var parser = require('xml2json');
var Papa = require('papaparse');
var fs = require('fs');
var moment = require('moment');

module.exports = {

  randomNumber: function (length) {
    return Math.random().toString(10).substring(2,length+2);
  },

  currentTime: function(){
    return moment().format('YYYYMMDDHHmmssZZ');
  },

  parseSessionId: function(xmlData) {
    var jsonObj = JSON.parse(parser.toJson(xmlData.body));
    return jsonObj["soap:Envelope"]["soap:Body"]["loginResponse"]["sessionId"];
  },

  parseReferenceNumber: function (xmlData){
    var jsonObj = JSON.parse(parser.toJson(xmlData.body));
    return jsonObj["soap:Envelope"]["soap:Body"]["sendRequestResponse"]["sendRequestResult"];
  },

  setHeadersForUserSession: function(options){
    options.headers["SOAPAction"] = "http://www.healthenterprises.com.au/rescripts/UserSession/login";
    options.headers["Content-Type"] = "application/xml";
    return options;
  },

  setHeadersForScriptRequest: function(options){
    options.headers["SOAPAction"] = "http://www.healthenterprises.com.au/rescripts/Script/sendRequest";
    options.headers["Content-Type"] = "text/xml";
    return options;
  }
};