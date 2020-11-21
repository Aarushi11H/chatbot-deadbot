import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 } from 'uuid';
import express from 'express';
import bodyParser from 'body-parser';
const port=5000;
const app=express();
const sessionId = v4(); // A unique identifier for the given session
app.get("/",(req,res)=>
{
    res.send("Hello!");
})
app.use(bodyParser.urlencoded({
  extended:false
}))
//to allow across different domain and file protocol
app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.post('/send-msg',(req,res)=>{
  runSample(req.body.MSG).then(data=>{
    res.send({
      reply:data
    })
  })
})
/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(msg,projectId = 'chatbot-deadbot') {
 
  

  // Create a new session
  const sessionClient = new SessionsClient(
      {
        keyFilename:"C:/Users/Anushka/Desktop/chatbot-nitkkr/chatbot-deadbot-ad75bb9d5dd6.json"
      }
  );
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: msg,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  return result.fulfillmentText;
}
app.listen(port,()=>{
  console.log("running on",+port);
})