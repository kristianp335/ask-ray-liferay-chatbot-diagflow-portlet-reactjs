## Liferay Chatbot NPM React Portlet "Ask Ray"

This is a chatbot integrated to DialogFlow Google's NLP engine. There are three versions of the chatbot both in my GitHub. This one is an NPM Portlet with React and ChartJS dependencies. You can have a conversation with it and it will draw a simple graph using ChartJS below. Ask it "How can I create a blog" by either typing or literally speaking to it.

This NPM Portlet has just been upgraded to use Bundler 2, which is best practice when building JS AMD NPM modules in Liferay.

**The chatbot has recently been changed to also grab some content from Liferay via Liferay's GraphQL API. The module utilises Apollo-Boost and Apollo's React wrapper. There is an additional React Component providing this capability in the build.**

**Thanks to Ivan for his amazing Liferay Bundler work**

[Liferay NPM Bundler](https://www.npmjs.com/package/liferay-npm-bundler)

There is a Liferay Service and API which is required as a dependency. This service just records the chat history in Liferay. You need to build and deploy the service, api and chatbot module.

[Ask Ray Service Builder project](https://github.com/kristianp335/ask-ray-liferay-chatbot-diagflow-service)

The standard common or garden Liferay MVC with JQuery version of this Portlet is here.

[Liferay MVC Portlet version of Ask Ray](https://github.com/kristianp335/ask-ray-liferay-chatbot-diagflow-portlet)

