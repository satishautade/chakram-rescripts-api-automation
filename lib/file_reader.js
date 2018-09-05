var fs = require('fs');

// var $ = jQuery = require('jquery');
// require('./jquery.csv.js');

// Async read NOT working

// var file_data = fs.readFile('../test_data.csv', function(err,data){
//   if(err) throw err;
//   var parsed_data = Papa.parse(data);
//   console.log("Our FILE data => " + parsed_data);
// });

let TEST_DATA;
const TEST_DATA_FILE = fs.readFileSync('../test_data.csv', 'utf8');
var test_data = Papa.parse(TEST_DATA_FILE,{
  //returns data with keys
  header: true
});

test_data.data.forEach(function(row,index){
  console.log(`data at index ${index} => ${row.patient_first_name}`);
  TEST_DATA.push()
});
console.log(TEST_DATA);
for(row in test_data.data){
  console.log(test_data.data[row]);
}