'use strict';

const firebaseAdmin = require('firebase-admin');

const dbDetails = require('./keys/database-details');
const firebaseServiceKey = require("./keys/firebase-service-key.json");

// initialise firebase admin
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseServiceKey),
  databaseURL: dbDetails.databaseURL
});

const db = firebaseAdmin.database().ref('/');
const maxTime = 60000; // in ms

const cleanTask = () => {
  return new Promise((resolve, reject) => {
    const currentTime = new Date().getTime();

    db.once('value', (snapshot) => {
      const users = snapshot.val();

      let toBeUpdated = null;

      Object.keys(users).forEach((user) => {
        const inputs = users[user].input;

        if (inputs !== undefined) {
          // set empty object if null
          if (toBeUpdated === null) {
            toBeUpdated = {};
          }

          Object.keys(inputs).forEach((inputKey) => {
            const tmp = inputs[inputKey].timestamp;

            if (!tmp || (tmp && currentTime - tmp >= maxTime)) {
              // if timestamp is undefined, let's set the timestamp to current time, so that it will be cleaned eventually
              toBeUpdated[`${user}/input/${inputKey}${!tmp ? '/timestamp': ''}`] = !tmp ? currentTime : null;
            }
          });
        }
      });

      console.log('data to be updated');
      console.log(toBeUpdated);

      if (toBeUpdated === null || Object.keys(toBeUpdated).length === 0) {
        resolve('no update needed');
        return;
      }

      // update input task
      db.update(toBeUpdated, (error) => {
        if (error) {
          reject(`problem in cleaning up input request: ${error}`);
          return;
        }

        resolve('input request cleaned');
      });
    });
  });
};

exports.handler = (event, context, callback) => {
  // this is important, so that callback can be triggered properly
  context.callbackWaitsForEmptyEventLoop = false;

  cleanTask()
    .then((success) => {
      callback(null, success);
    })
    .catch((error) => {
      callback(null, error);
    });
};