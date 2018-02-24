const firebaseAdmin = require('firebase-admin');
const EventEmitter = require('events');

const dbDetails = require('../keys/database-details');
const firebaseServiceKey = require("../keys/firebase-service-key.json");

const appConfig = require('../config');

// initialise firebase admin
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseServiceKey),
  databaseURL: dbDetails.databaseURL
});

class Actions {
  constructor() {
    // TODO: to be changed when there is multiple users
    this._usersDBRef = firebaseAdmin.database().ref(appConfig.userId);
    this._devicesDBRef = this._usersDBRef.child(appConfig.dbRelated.devicesCollection);
    this._masterIODBRef = this._usersDBRef.child(appConfig.dbRelated.masterCollection);
    this._inputDBRef = this._usersDBRef.child(appConfig.dbRelated.inputCollection);

    this.deviceLinked = false;

    this.response = null;
    this.request = null;
    this.app = null;

    // initialise event emitter
    this.events = new EventEmitter();
  }

  setRequestObject(request, response, app) {
    this.request = request;
    this.response = response;
    this.app = app;
  }

  blink() {
    this._blinkUnblink(true);
  }

  stopBlinking() {
    this._blinkUnblink(false);
  }

  shuffleCups() {
    this._updateInput('SHUFFLE')
      .then((success) => {
        console.log('shuffle ok');
        this.response(null, 'ok');
      })
      .catch((error) => {
        app.tell('problem in shuffling cups');
        this.response(null, `error: ${error}`);
      });
  }

  playTruthOrDare() {
    this._updateInput('SHUFFLE')
      .then((success) => {
        // TO DO: refactor this.
        // we are assuming that in 2 seconds shuffling task is done
        setTimeout(() => {
          const event = {
            'followupEvent': {
              'name': appConfig.intents.truthOrDareOptions.intent,
              'data': {
                'game_started': 1
              }
            }
          };

          this.response(null, event);
        }, 2000);
      })
      .catch((error) => {
        app.tell('problem in shuffling cups');
        this.response(null, 'fail');
      });
  }

  resetCups() {
    this._updateInput('RESET')
      .then((success) => {
        console.log('reset ok');
        this.response(null, 'ok');
      })
      .catch((error) => {
        app.tell('problem in resetting cups');
        this.response(null, `error: ${error}`);
      });
  }

  offCups() {
    this._updateInput('OFF')
      .then((success) => {
        console.log('off cups ok');
        this.response(null, 'ok');
      })
      .catch((error) => {
        app.tell('problem in turning off cups');
        this.response(null, `error: ${error}`);
      });
  }

  rainbowCups() {
    this._updateInput('RAINBOW')
      .then((success) => {
        console.log('rainbow cups ok');
        this.response(null, 'ok');
      })
      .catch((error) => {
        app.tell('problem in running rainbow task');
        this.response(null, `error: ${error}`);
      });
  }

  _updateInput(mode) {
    return new Promise((resolve, reject) => {
      const obj = {
        id: 0,
        mode
      };

      const pushRef = this._inputDBRef.push();

      // store request
      pushRef.set(obj, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  doNothing() {
    console.log(`DOING NOTHING - task: ${this.request.body.result.action}`);
    this.response(null, 'ok');
  }

  unknownInput() {
    const event = {
      'followupEvent': {
        'name': appConfig.intents.unknownInput.intent
      }
    };

    this.response(null, event);
  }

  noDeviceConnected() {
    const event = {
      'followupEvent': {
        'name': appConfig.intents.noDevices.intent,
        'data': {
          'check_device': 0
        }
      }
    };

    this.response(null, event);
  }

  checkDeviceLinkedStatus() {
    return new Promise((resolve, reject) => {
      this._masterIODBRef.once('value', (snapshot) => {
        const masterIO = snapshot.val();

        this.deviceLinked = masterIO.linked;
        resolve(this.deviceLinked);
      });
    });
  }

  _blinkUnblink(isBlink) {
    this._devicesDBRef.once('value', (snapshot) => {
      const deviceList = snapshot.val();

      if (deviceList && Object.keys(deviceList).length > 0) {
        Object.keys(deviceList).forEach((key) => {
          const updatedData = {};
          updatedData[`${key}/lightStatus`] = isBlink ? 1 : 0;
          this._devicesDBRef.update(updatedData);
        });

        this.response(null, 'ok');
      }
    });
  }
}

module.exports = Actions;