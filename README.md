# FileBin

FileBin is an anonymous file sharing web app where users can upload files upto 20 mb. A unique link is generated for
each uploaded file, which can be shared with the intended receiver of the file. Each file can be downloaded only once,
and any user trying to download a file after it has already been downloaded should get an error.

## Functional Requirements:

- User should be anonymous.
- User should be able to upload the file and get a unique URL to access it.
- User should be able to upload files upto 20 MB.
- User can download the file only once.

## Technical Descriptions:

- Front End - Html, CSS
- Back End (REST) - Node, Express
- DataBase - MySQL

## Assumptions:

- User should not be able to pick a custom url
- All the links generated should be totally random and unpredictable
- After downloading the file user should remove the file from uploads folder

## Steps to Run:

- Install and configure ***MySQL***
- Create database using script ***'database/dbSetUP.sql'***
- Set proper parameter values in ***'database/db.js'*** to connect to mysql server
- Install ***node***
- Install ***nodemon*** **globally**
- Install dependencies using command
  ```npm install```
- Start node server by executing command
  ```npm start```
