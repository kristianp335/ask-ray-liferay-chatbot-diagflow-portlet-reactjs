## Liferay Chatbot NPM React Portlet "Ask Ray" upgraded to Liferay 7.4 2024 Q4

This is a chatbot integrated to DialogFlow Google's NLP engine. There are three versions of the chatbot both in my GitHub. This one is an NPM Portlet with React and ChartJS dependencies. You can have a conversation with it and it will draw a simple graph using ChartJS below. Ask it "How can I create a blog" by either typing or literally speaking to it. You will need to setup your own DialogFlow chatbot Agent.

Note this module is all about how you use NPM Portlets, how you might integrate with DialogFlow in Liferay and how you might want to authenticate with Google OAuth2.0. I can think of loads of ways 
I might make this module and other modules in this family better, but this is not the point. The code comes with no warranty or support from myself or Liferay. It is a bunch of examples not production code.

### Liferay Version Dependency

These extensions have been tested with 7.4 U33 and 7.4 2024 Q4

## Liferay NPM Bundler

This NPM Portlet has just been upgraded to use Bundler 2, which is best practice when building JS AMD NPM modules in Liferay.

**Thanks to Ivan for his amazing Liferay Bundler work**

**Thanks to Evan, for refactoring some React code when the module developed a fault when upgrading to Liferay 7.3

[Liferay NPM Bundler](https://www.npmjs.com/package/liferay-npm-bundler)

## GraphQL

**The chatbot has recently been changed to also grab some content from Liferay via Liferay's GraphQL API. The module utilises Apollo-Boost and Apollo's React wrapper. There is an additional React Component providing this capability in the build which renders content in a Clay React Card component.**

Import the content with the provided lar in the root of the module.

## DialogFlow and Google OAuth2.0 service account authentication

The chatbot now uses the V2 version of Google's Dialogflow API which requires OAuth2.0 service account authentication. You must deploy
the **org.apache.servicemix.bundles.gae-1.9.81_1.jar** to Liferay to satisfy this modules dependencies. All other dependencies are satisfied by Liferay
default or as compileInclude.

Because the module uses Google Service account authentication you need to add your json service account file e.g liferay-onhm-1c5c15d292d4.json to /src/main/resources.

The module is a really good example of how you can do server side OAuth2.0 Google API authentication and then pass the accessToken to be used as a bearer token in the client side. Take a 
look at the main Portlet class to see how I am doing that. The API calls happen client side but the OAuth2.0 authentication and authorisation happens server side. I have not put a huge amount of thought into managing what happens when the accessToken expires, I just get a new one everytime the Portlet loads 
you might want to think about this if you decide to run with this in production.

You can find out how you create the service account by reading this documentation for Dialogflow [Dialogflow quickstart guide] (https://cloud.google.com/dialogflow/docs/quick/setup)

Make sure you edit the "dialogflowUrl" variable in index.js with the project id of your Agent.

Documentation on how to setup a DialogFlow Agent can be found here [DialogFlow Documentation] (https://cloud.google.com/dialogflow/docs/basics)

You need to make sure you have an intent setup in DialogFlow called "blog" and you set an action called "blog". Create a page in Liferay and add the blogs widget to it. Then trigger the intent with your training phrase.

The actions are triggered by the Portlet's resource phase controller.

## Service dependency

There is a Liferay Service and API which is required as a dependency. This service just records the chat history in Liferay. You need to build and deploy the service, api and chatbot module.

[Ask Ray DialogFlow V2 Service Builder project](https://github.com/kristianp335/ask-ray-liferay-chatbot-dialogflowv2-service)

## Other information

The standard common or garden Liferay MVC with JQuery version of this Portlet is here.

[Liferay MVC Portlet version of Ask Ray](https://github.com/kristianp335/ask-ray-liferay-chatbot-diagflow-portlet)

**(todo - Add promises support, refactor code for better state handling with GraphQL, and make the DialogFlow Agent an OSGI configurable property)**

