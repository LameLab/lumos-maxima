const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const EventEmitter = require('events');
const axios = require('axios');

const appConfig = require('../config');

// initialise firebase admin
firebaseAdmin.initializeApp(functions.config().firebase);

class Actions {
  constructor() {
    // TODO: to be changed when there is multiple users
    this._usersDBRef = firebaseAdmin.database().ref(appConfig.userId);
    this._devicesDBRef = this._usersDBRef.child(appConfig.dbRelated.devicesCollection);
    this._masterIODBRef = this._usersDBRef.child(appConfig.dbRelated.masterCollection);

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

  playTruthOrDare() {
    const obj = {
      input: 'SHUFFLE',
      output: {
        type: 'SHUFFLE',
        result: 'NONE'
      }
    };

    this._masterIODBRef.update(obj, (error) => {
      if (error) {
        app.tell('problem in shuffling cups');
        return;
      }

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

        this.response.send(event);
      }, 2000);
    });
  }

  syncCups() {
    const obj = {
      input: 'SYNC',
      output: {
        type: 'SYNC',
        result: 'NONE'
      }
    };

    this._masterIODBRef.update(obj, (error) => {
      if(error) {
        this.app.tell('problem in syncing light cups');
      }
      this.response.send('ok');
    });
  }

  doNothing() {
    console.log(`DOING NOTHING - task: ${this.request.body.result.action}`);
    this.response.send('ok');
  }

  unknownInput() {
    const event = {
      'followupEvent': {
        'name': appConfig.intents.unknownInput.intent
      }
    };

    this.response.send(event);
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

    this.response.send(event);
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

        this.response.send('ok');
      }
    });
  }
}

module.exports = Actions;