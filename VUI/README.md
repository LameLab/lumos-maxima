# Stack

developed using the following stack:
1. Dialogflow
2. Firebase
3. Firebase function + AWS Lambda API Gateway and Alexa Skills Set function

# Setting up

Assuming you have Dialogflow, Firebase, and or AWS account access

## Dialog Flow
I. Create DIALOGFLOW AGENT
1. Create new Agent in DialogFlow from the console
2. You can either import the intents 1 by 1 or zip `assets/dialogflow` folder and import it.
      - to import, cleck on `gear` icon on right panel next to the agent name
      - click on `Export and Import` tab
      - click on `IMPORT FROM ZIP` button, and upload the zip file

II. Setting up Dialogflow Agent webhook fulfillment
      - click on `Fulfillment` menu on the left side of your console
      - toggle `enabled` switch to enable webhook
      - enter the URL of webhook end point
      - fill up the necessary authentication detail for the webhook access, for AWS Lambda webhook, add `x-api-key` as one of the header, and grab API key from AWS API Gateway console
      - select `Enable webhook for all domains` for DOMAINS
      - P.S: 2 code base options available, can either use `Firebase functions` or `AWS Lambda API Gateway`

## Firebase
I. Importing Data
1. go to Realtime Database console
2. click on `menu icon on the right side (three dots icon)`, click on `import JSON`
3. JSON file is located at `assets/firebase/realtime-db-data.json`

II. Deploying Firebase function (should you choose Firebase function as your agent webhook fulfillment)
1. Pre-requisite
      - install Firebase CLI `npm install -g firebase-tools`
      - once done, login to your firebase account by running `firebase login` in your terminal

2. Deployment
      - go to `firebase-webhook/.firebaserc` and key in your firebase project ID and save the file
      - open your terminal and go to `firebase-webhook/functions`, and do the following:
          - run `npm install`
          - run `firebase deploy`
          - take note that on first deployment, it will take longer time than the subsequent deployment.
          - once the deployment is done, grab the firebase function url, and use that url as the Dialogflow fulfillment webhook URL

## AWS Lambda
I. Deploying AWS Lambda API Gateway function - Dialogflow webhook (should you choose AWS Lambda API Gateway function as your agent webhook fulfillment)
1. AWS Lambda Console
    1. go to AWS Lambda console
    2. create a new function
    3. Fill up all the function details i.e. name, role.
    4. choose `Node.js 6.10` as Runtime
    5. choose `Author from scratch`
    6. click on `Create function` button
    7. it should bring you to the next step, add API Gateway triggers (in Designer section, left panel, there is a list of available triggers)
    8. Next, you will need to configure the triggers:
        - Enter your api name, e.g. `test-api`
        - Choose `Open with access key` as your `Security preference`
        - Click on `Add` buttons
        - Save the function
        - it should generate an invoke url, use that url as the Dialogflow fulfillment webhook URL
    9. Now for the code deployment:
        - on your machine, go to `aws-lambda-webhook` folder
        - create a folder called keys, put the firebase service key file and name it `firebase-service-key.json` + create a file called `database-details.js` and add in the following content
        ```
        module.exports = {
          databaseURL: '[FIREBASE database URL]'
        };
        ```
        - once done, run `npm install`
        - run `npm run zip`
        - it will create a zip folder called `aws-lambda-webhook.zip`
        - back to the AWS Lambda console, on the function settings page, under `Designer` section, click on the function name button from the graph
        - under `Function code` section > Code entry type, select `Upload a .ZIP file`
        - upload the zip file
        - save the function
        - it will take a while to deploy

2. API Gateway Console
    1. look for the api name e.g. `test-api`, and click on `resources`
    2. under `actions` drop down menu, create method for `POST` request
    3. set lambda region as `us-east-1` + enter the lambda function name associated with this API
    4. click on save
    5. it will load `POST` method dashboard, go to `Method Request`
    6. set `API Key Required` to true
    7. add in new headers called `x-api-key` and set is as `required`
    8. follow the instructions from [this](https://kennbrodhagen.net/2015/12/06/how-to-create-a-request-object-for-your-lambda-event-from-api-gateway/) blog to create request object mapping
    9. once done, create API Keys, from left menu panel, click 'API Keys'
    10. under `actions` drop down menu, create API Key
    11. go to `Usage plans`, from left menu panel, click 'Usage plans'
    12. create new usage plan
          - enter usage plan name
          - set the rest of access limit related stuff and save
          - from the usage plans dashboard, add API stage.
          - once done, go to API Keys tab and add API key to the usage plan

II. Alexa skills
1. Amazon Developer console - Creating custom Alexa skills
    1. go to [Amazon Developer Console](https://developer.amazon.com/home.html) and login
    2. click on `Alexa` tab > click on `Get started` on alexa skills > Add a new skill
    3. enter skill information details, and go to next step (Interaction Model)
    4. enter both `Intent schema` + `Sample utterance` by referring to the assets file provided at `alexa-skills/assets`
    5. under `Configuration` steps, fill up the AWS Lambda ARN details
    6. and... done!

2. AWS Lambda Console
    1. go to AWS Lambda console, make sure to set the region to US East (N.Virginia)
    2. create a new function
    3. Fill up all the function details i.e. name, role.
    4. choose `Node.js 6.10` as Runtime
    5. choose `Author from scratch`
    6. click on `Create function` button
    7. it should bring you to the next step, add Alexa Skills Kit triggers (in Designer section, left panel, there is a list of available triggers)
    8. Next, you will need to configure the triggers:
        - enter alexa skill ID (grab it from Amazon Developer Console > alexa skills)
        - save it
    9.  Now for the code deployment:
        - on your machine, go to `alexa-skills` folder
        - create a folder called keys, put the create a file called `alexa-dialogflow-keys.js` and add in the following content
        ```
        module.exports = {
          alexaAppId: '[alexa APP ID]',
          apiAIDeveloperAccessToken: '[dialogflow developer access token]'
        };
        ```
        - once done, run `npm install`
        - run `npm run zip`
        - it will create a zip folder called `alexa-skills.zip`
        - back to the AWS Lambda console, on the function settings page, under `Designer` section, click on the function name button from the graph
        - under `Function code` section > Code entry type, select `Upload a .ZIP file`
        - upload the zip file
        - save the function
        - it will take a while to deploy
    10. ready to test!