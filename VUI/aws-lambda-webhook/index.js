'use strict';

const dialogflowApp = require('actions-on-google').DialogflowApp;

const appConfig = require('./config');
const Actions = require('./libs/actions');

const _actions = new Actions();

exports.handler = (event, context, callback) => {
  // this is important, so that callback can be triggered properly
  context.callbackWaitsForEmptyEventLoop = false;

  console.log(`REQUEST-HEADERS: ${JSON.stringify(event.headers)}`);
  console.log(`REQUEST-BODY: ${JSON.stringify(event.body)}`);

  const dfApp = new dialogflowApp({
    request: event
  });

  _actions.setRequestObject(event, callback, dfApp);

  let actionMap = new Map();

  Object.keys(appConfig.intents).forEach((intentKey) => {
    const intent = appConfig.intents[intentKey];
    actionMap.set(intent.intent, () => {
      _actions[intent.action]();
    });
  });

  // An action is a string used to identify what needs to be done in fulfillment
  let action = (event.body.result.action) ? event.body.result.action : 'default';

  console.log('ACTION: ' + action);

  if (parseInt(event.body.result.parameters.game_started) !== 1) {
    if (action === appConfig.intents.truthOrDareStartYes || action === appConfig.intents.truthOptions.intent || action === appConfig.intents.dareOptions.intent) {
      console.log('game not yet started');
      dfApp.tell('hmm, maybe you want to start the game by saying "tell du da to play truth or dare" first?');
      return;
    }
  }

  // if (parseInt(event.body.result.parameters.check_device) === 1) {
  //   _actions.checkDeviceLinkedStatus()
  //     .then((status) => {
  //       if (!status) {
  //         _actions.noDeviceConnected(event, response, dfApp);
  //         return;
  //       }

  //       actionMap.get(action)();
  //     });
  // } else {
    actionMap.get(action)();
  // }
};