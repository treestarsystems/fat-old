const os = require('os');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const emoji = require('node-emoji');
const system = require('../../system_confs/system_vars.json');

//Variables and Constants
var coreVars = {
 "systemUser": system,
 "projectName": "fat",
 "installedDir": path.join(__dirname, '../..'),
 "dbServer": "mongodb://localhost:27018",
 "dbName": "fat",
// "":"",
}

//Required directories
coreVars.systemConfsDir = `${coreVars.installedDir}/system_confs`;
coreVars.dbStoreDir = `${coreVars.installedDir}/db_storage`;
coreVars.logStoreDir = `${coreVars.installedDir}/log_storage`;
coreVars.downloadDir = `${coreVars.installedDir}/download_storage`;

coreVars.instanceId = `${coreVars.logStorage}/pid/${coreVars.projectName}_Instance.id`;
coreVars.userInfo = getUserInfo();

//Get numeric id for the gb user from system_confs/system_user.json file.
function getUserInfo() {
 uid = parseInt(childProcess.execSync(`id -u ${system.username}`).toString().replace(/\n$/, ''));
 gid = parseInt(childProcess.execSync(`id -g ${system.username}`).toString().replace(/\n$/, ''));
 return {"uid": uid,"gid": gid,"userName": system.username};
}

function changePerm (path) {
 fs.chown(path,coreVars.userInfo.uid,coreVars.userInfo.gid, (err) => {
  if(err) throw err;
 });
 fs.chmod(path, 0o770, (err) => {
  if(err) throw err;
 });
}

function createDir (path) {
 fs.mkdir(path, (err) => {
  if(err) throw err;
 });
 changePerm (path);
 console.log(`Dir Created: ${path}`);
}

//Used to check if the app is started as the correct user (www-data) due to permissions requirements.
function incorrectUser (user,host,port) {
 if (process.env.USER != coreVars.userInfo.userName) {
  console.log(`\nCurrent User: ${emoji.emojify(`:x::scream: ${user} :scream::x:`)}`);
  console.log(`This process must be ran as the ${coreVars.userInfo.userName} user or else permission errors will impede functionality.\n`);
  process.exit(0);
 } else {
  var startMessage = console.log(`\nServer started by ${user} on ${host}:${port} in ${process.env.NODE_ENV} mode`);
  //Sets a new process environment variable that the app will use to run the start script.
  process.env['CORRECT_USER'] = true;
 }
}

//Generate a random alphanumeric string
function genRegular(x) {
 var regularchar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 var text = "";
 for (var i = 0; i < x; i++)
  text += regularchar.charAt(Math.floor(Math.random() * regularchar.length));
  return text;
}

//Generate a random alphanumeric string with special characters
function genSpecial(x) {
 var specialchar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%_-(),;:.*"
 var text = "";
 for (var i = 0; i < x; i++)
  text += specialchar.charAt(Math.floor(Math.random() * specialchar.length));
  return text;
}

//Generate a random alphanumeric string with only special characters
function genSpecialOnly(x) {
 var specialchar = "!@#$%_-(),;:.*"
 var text = "";
 for (var i = 0; i < x; i++)
  text += specialchar.charAt(Math.floor(Math.random() * specialchar.length));
  return text;
}

//Generate a random number within defined range
function getRandomNumber(min, max) {
 return Math.round(Math.random() * (max - min) + min);
}

function randomCaps(word) {
 var position = getRandomInt(0, word.length);
 return `${replaceAt(word,position,word.charAt(position).toUpperCase())}`;
}

function insertSpecialChars(word) {
 var specialchar = "!@#$%_-(),;:.*"
 var index = getRandomInt(1, word.length);
 text = specialchar.charAt(Math.floor(Math.random() * specialchar.length));
 return word.substring(0, index) + text + word.substring(index);
}

//https://stackoverflow.com/a/1527820
function getRandomInt(min, max) {
 min = Math.ceil(min);
 max = Math.floor(max);
 return Math.floor(Math.random() * (max - min + 1)) + min;
}

//https://gist.github.com/efenacigiray/9367920
function replaceAt(string, index, replace) {
 return string.substring(0, index) + replace + string.substring(index + 1);
}
// I need to fix this so it closes the connection once it is done.
// https://docs.mongodb.com/drivers/node/fundamentals/connection

module.exports = {
 genRegular,
 genSpecial,
 getRandomNumber,
 createDir,
 changePerm,
 incorrectUser,
 coreVars,
 system,
 genSpecialOnly,
 randomCaps,
 insertSpecialChars,
 getRandomInt,
 replaceAt
}