# chakram-rescripts-api-automation
API automation using Chakram framework for rescripts API

## Pre-requisites:
To run this project you need Nodejs installed. YOu can download it from [here](https://nodejs.org/en/download/current/) 
Its recommended to use a LTS version.

## Project Structure
```
.
├── data
│   ├── script_request_body.xml
│   ├── test_data.csv
│   └── user_session_body.xml
├── lib
│   └── helpers.js
├── package.json
├── package-lock.json
└── test
    └── send_script_request_test.js
```
We use the data in `test_data.csv` file and create script requests using the rescripts API.
This is a SOAP based service and the payload templates used are `user_session_body.xml` and `script_request_body.xml`.
`helpers` have useful functions which are used to inject random strings and dates into the request body.
And finally `send_script_request_test.js` uses each data row in CSV file to fire the API requests.

### Using this utility

- Review/Change the `test_data.csv`. Especially the email address of the doctor to send the script requests to.
- Run  the following commands from the root directory of the project
  ```
  npm install 
  npm test
  ```
  If everything worked fine you'll see result like 
  ```
  satish@ubuntu:~/projects/try-chakram$ npm test

  > try-chakram@1.0.0 test /home/satish/projects/try-chakram
  > mocha -u bdd -R spec --recursive

  Create Script Request for GPConnect Doctor
  Response Number => "MA34400004421188812743606808"
  For Data Row => {"patient_last_name":"AUTO","patient_first_name":"ROBOT1","doctor_lastname":"AUTO","doctor_firstname":"DOCTOR1","doctor_email":"robot@medadvisor.com.au","drug_name":"NORSPAN^EAN^8866P^BUPRENORPHINE^PBS","dispense_date":"20180828000000+1000","script_date":"20180802000000+1000","pharmacy_id":"MA347","drug_type":"N^N^N^^4N^Y"}
  Response Number => "MA34400004421188919047588807"
  For Data Row => {"patient_last_name":"AUTO","patient_first_name":"ROBOT2","doctor_lastname":"AUTO","doctor_firstname":"DOCTOR2","doctor_email":"robot@medadvisor.com.au","drug_name":"NORSPAN^EAN^8866P^BUPRENORPHINE^PBS","dispense_date":"20180828000000+1000","script_date":"20180802000000+1000","pharmacy_id":"MA347","drug_type":"N^N^N^^4^Y"}
  Response Number => "MA34400004421188292242097958"
  For Data Row => {"patient_last_name":"AUTO","patient_first_name":"ROBOT3","doctor_lastname":"AUTO","doctor_firstname":"DOCTOR3","doctor_email":"robot@medadvisor.com.au","drug_name":"NORSPAN^EAN^8866P^BUPRENORPHINE^PBS","dispense_date":"20180906000000+1000","script_date":"20180906000000+1000","pharmacy_id":"MA344","drug_type":"N^N^N^^4^Y"}
    ✓ should make a script request for each row of data using new session id (1198ms)

  1 passing (1s)
  ```
