module.exports = {
  userId: 'dead_inside',
  dbRelated: {
    masterCollection: 'masterIO',
    devicesCollection: 'devices'
  },
  maxTaskTries: 15,
  intents: {
    blink: {
      intent: 'du-da-blink',
      action: 'blink'
    },
    stopBlink: {
      intent: 'du-da-stop-blink',
      action: 'stopBlink'
    },
    noDevices: {
      intent: 'du-da-no-devices',
      action: 'doNothing'
    },
    truthOrDareStart: {
      intent: 'truth-or-dare-start',
      action: 'doNothing'
    },
    truthOrDareStartYes: {
      intent: 'truth-or-dare-start-yes',
      action: 'playTruthOrDare'
    },
    truthOrDareSpin: {
      intent: 'truth-or-dare-spin',
      action: 'playTruthOrDare'
    },
    truthOrDareOptions: {
      intent: 'truth-or-dare-options',
      action: 'doNothing'
    },
    truthOptions: {
      intent: 'truth-or-dare-options-truth',
      action: 'doNothing'
    },
    truthQuestions: {
      intent: 'truth-or-dare-options-truth-yes',
      action: 'doNothing'
    },
    dareOptions: {
      intent: 'truth-or-dare-options-dare',
      action: 'doNothing'
    },
    dareQuestions: {
      intent: 'truth-or-dare-options-dare-yes',
      action: 'doNothing'
    },
    syncCups: {
      intent: 'du-da-sync-cups',
      action: 'syncCups'
    },
    test: {
      intent: 'du-da-test',
      action: 'doNothing'
    },
    // syncCupsDone: {
    //   intent: 'du-da-sync-cups-done',
    //   action: 'doNothing'
    // },
    // syncCupsFailed: {
    //   intent: 'du-da-sync-cups-fail',
    //   action: 'doNothing'
    // },
    unknownInput: {
      intent: 'input.unknown',
      action: 'doNothing'
    },
    processTask: {
      intent: 'du-da-process-task',
      action: 'processTaskIntent'
    }
  }
};