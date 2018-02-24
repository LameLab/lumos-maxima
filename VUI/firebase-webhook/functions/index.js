'use strict';

process.env.DEBUG = 'actions-on-google:*';

const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const dialogflowApp = require('actions-on-google').DialogflowApp;
const EventEmitter = require('events');

const Actions = require('./libs/actions');

const appConfig = require('./config');

const _actions = new Actions();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.dudaFullfilment = functions.https.onRequest((request, response) => {
  // Log headers and body
  console.log(`Request headers: ${JSON.stringify(request.headers)}`);
  console.log(`Request body: ${JSON.stringify(request.body)}`);

  const app = new dialogflowApp({
    request: request,
    response: response
  });

  _action.setRequestObject(request, response, app);

  let actionMap = new Map();

  Object.keys(appConfig.intents).forEach((intentKey) => {
    const intent = appConfig.intents[intentKey];
    actionMap.set(intent.intent, () => {
      _actions[intent.action]();
    });
  });

  // An action is a string used to identify what needs to be done in fulfillment
  let action = (request.body.result.action) ? request.body.result.action : 'default';

  console.log('ACTION: ' + action);

  if (parseInt(request.body.result.parameters.game_started) !== 1) {
    if (action === appConfig.intents.truthOrDareStartYes || action === appConfig.intents.truthOptions.intent || action === appConfig.intents.dareOptions.intent) {
      console.log('game not yet started');
      app.tell('hmm, maybe you want to start the game by saying "tell du da to play truth or dare" first?');
      return;
    }
  }

  if (parseInt(request.body.result.parameters.check_device) === 1) {
    _actions.checkDeviceLinkedStatus()
      .then((status) => {
        if (!status) {
          _actions.noDeviceConnected(request, response, app);
          return;
        }

        actionMap.get(action)();

        if (action === appConfig.intents.truthOrDareStartYes.intent) {
          return;
        }
      });
  } else {
    actionMap.get(action)();
  }
});