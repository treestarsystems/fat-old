const express = require('express');
const fs = require('fs');
const daemon = require('./service.js');
const emoji = require('node-emoji');
const childProcess = require('child_process');
const path = require('path');
const compression = require('compression');
const session = require('express-session');
const exphbs = require('express-handlebars');
const cors = require('cors');
const core = require('./core/core.js');
const system = require('../system_confs/system_vars.json');
//const jobs = require('./core/cronJobs.js').jobs;
const mongoose = require('mongoose');
const mongoStore = require("connect-mongo")(session);
const routes = require('./controller/routes.js');
const passport = require('passport');
const app = express();

//Main connection to DB
mongoose.connect(
 `${core.coreVars.dbServer}/${core.coreVars.dbName}?retryWrites=true`,
 {useNewUrlParser: true,useUnifiedTopology: true}
 )
 .then(() => console.log('App\'s Main connection to DB has been established!'))
 .catch((err) => console.log(err));

//Session Store connection to DB
const connection = mongoose.createConnection(
 `${core.coreVars.dbServer}/${core.coreVars.dbName}?retryWrites=true`,
 {useNewUrlParser: true,useUnifiedTopology: true},
 () => console.log('App\'s Session Store connection to DB has been established!')
);

const sessionStore = new mongoStore({
 mongooseConnection: connection,
 collection: "sessions",
});

//Global Middleware: Must be defined before routes
//Express session middleware
app.use(
 session({
  secret: system.tokenSecret,
  cookie: {
   maxAge: 86400000,
  },
  resave: false,
  saveUninitialized: true,
  store: sessionStore
 })
);

// Serve secure cookies, requires HTTPS
/*
if (process.env.NODE_ENV === "prod") {
 session.cookie.secure = true;
}
*/

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());

//Passport Config
require('./core/passport.js')(passport);
app.use(passport.initialize());
app.use(passport.session());



// View engine setup
app.set('views', path.join(__dirname, "view/pages"));
app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        extname: '.handlebars',
        layoutsDir:'server/view/pages/layouts',
        partialsDir:'server/view/pages/partials'
}));
app.set('view engine', 'handlebars');

//All routes are called here.
for (var r in routes) {
 routes[r](app);
}

//Create required directories and change permissions if they do not exist.
//These should be mounted to a large storage pool
if (!fs.existsSync(core.coreVars.installedDir)){
 console.log(`Creating: ${core.coreVars.installedDir}`);
 core.createDir (core.coreVars.installedDir);
}
if (!fs.existsSync(core.coreVars.dbStoreDir)){
 console.log(`Creating: ${core.coreVars.dbStoreDir}`);
 core.createDir (core.coreVars.dbStoreDir);
}
if (!fs.existsSync(core.coreVars.downloadDir)){
 console.log(`Creating: ${core.coreVars.downloadDir}`);
 core.createDir (core.coreVars.downloadDir);
}

function startApp () {
 app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`${emoji.emojify(':heavy_check_mark:.....:100:')}`);
  //Write daemon data as a json object to a file so it can be called later.
  daemon.instanceInfo(process.env.pm_id,process.env.name,process.env.NODE_APP_INSTANCE,process.env.NODE_ENV);
 });
}

//Check if app is runing as correct user then execute.
core.incorrectUser(process.env.USER,process.env.HOST,process.env.PORT);
if (process.env.CORRECT_USER) {
 //Check if MongoDB is running.
 childProcess.exec('ps -C mongod -o pid=', (error, stdout, stderr) => {
  if (error) {
   console.error(`MongoDB is not running. I will start it...`);
   //If MongoDB is not running attempt to start it.
   childProcess.exec(`mongod -f ${core.coreVars.systemConfsDir}/mongod.conf`, (error, stdout, stderr) => {
    if (error) {
     //If it can not run show error and stop.
     console.error(`MongoDB could not start: ${error}`);
     return;
    }
    //Start has completed.
    console.log(`MongoDB start complete: ${stdout.replace(/\n$/, '')}`);
   });
  }
  //MongoDB is running.
  console.log(`MongoDB is running: ${stdout.replace(/\n$/, '')}`);
  //Start app.
  startApp();
  //Start all cron jobs defined in ./server/modules/cronJobs.js
//  if (process.env.NODE_APP_INSTANCE == 0) {
/*
   for (key in jobs) {
    jobs[key].start();
   }
*/
//  }
 });
}

process.on('SIGINT', () => {
 childProcess.exec(`mongod -f ${core.coreVars.systemConfsDir}/mongod.conf --shutdown`, (error, stdout, stderr) => {
  if (error) {
   console.error(`MongoDB error: ${error}`);
  }
  console.log('Shutting down MongoDB...');
  process.exit(error ? 1 : 0);
 });
});
