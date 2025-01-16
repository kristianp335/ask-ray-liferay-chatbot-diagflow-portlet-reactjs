import React from 'react';
import ReactDOM from 'react-dom';

class AiApiConversation extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({apiAiDataObject: [], value: "", isItVoice: false, link: "", Data: {}, arraySearch: []});
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.recordVoice = this.recordVoice.bind(this);
        this.getLink = this.getLink.bind(this);
        this.renderButton = this.renderButton.bind(this);
        this.renderSearchResults = this.renderSearchResults.bind(this);
        this.getApiAiData();
    }

    getApiAiData() {
        Liferay.Service(`/${this.props.serviceContextPath}/get-recent-conversation`, {
            records: 6
        }, function (obj) {
            console.log(obj);
            if (!obj) return;
            this.setState({apiAiDataObject: obj});
            let conversationType = ["Query", "Response"];
            let conversationValueQuery = 0;
            let conversationValueResponse = 0;

            this.state.apiAiDataObject.forEach(element => {
                if (element.type === "query") {
                    conversationValueQuery = conversationValueQuery + 1;

                } else {
                    conversationValueResponse = conversationValueResponse + 1;
                }
            });
            this.setState({
                Data: {
                    labels: conversationType, datasets: [{
                        label: 'Query vs Response Count',
                        data: [conversationValueQuery, conversationValueResponse],
                        backgroundColor: ['rgba(255,105,145,0.6)', 'rgba(155,100,210,0.6)']
                    }]
                }
            });
        }.bind(this));
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    recordVoice() {
        this.setState({isItVoice: true});
        let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        let recognitionReact = new SpeechRecognition();
        recognitionReact.lang = 'en-UK';
        new SpeechSynthesisUtterance();
        recognitionReact.start();
        recognitionReact.onresult = function (event) {
            let speechResultReact;
            speechResultReact = event.results["0"]["0"].transcript;
            this.setState({value: speechResultReact});
            this.handleSubmit(event);
        }.bind(this)
    }

    handleSubmit(event) {
        this.setState({link: ""});
        this.setState({arraySearch: []});
        if (this.state.value === undefined || this.state.value === '') {
            console.debug("The input text is not set. No query will be sent");
            event.preventDefault();
            return;
        }
        let apiAiRequest = ({
            "query_input": {
                "text": {
                    "text": this.state.value, "language_code": "en-US"
                }
            }
        });
        let dialogflowUrl = `https://dialogflow.googleapis.com/v2/projects/${this.props.dialogflowProjectId}/agent/sessions/` + this.props.conversationSession + ":detectIntent";
        let dialogflowAccessToken = this.props.accessToken;
        fetch(dialogflowUrl, {
            method: 'POST', headers: {
                'Content-Type': 'application/json', 'Authorization': 'Bearer ' + dialogflowAccessToken
            }, body: JSON.stringify(apiAiRequest)
        })
            .then((response) => response.json())
            .then(function (data) {
                const fulfillmentMessageCount = data.queryResult.fulfillmentMessages.length;
                const queryText = data.queryResult.queryText;
                const speechText = fulfillmentMessageCount > 0 ? data.queryResult.fulfillmentMessages["0"].text.text["0"] : "";
                const actionJsonString = data.queryResult.action ? JSON.stringify(data.queryResult.action) : "";

                Liferay.Service(`/${this.props.serviceContextPath}/add-api-ai-data-persistence`, {
                    query: queryText,
                    authtoken: "",
                    speech: speechText,
                    action: actionJsonString.length <= 1024 ? actionJsonString : "",
                    fulfillment: actionJsonString.length <= 1024 ? actionJsonString : "",
                    result: actionJsonString.length <= 1024 ? actionJsonString : ""
                }, function () {
                    this.getApiAiData();
                    if (this.state.isItVoice === true) {
                        let synth = window.speechSynthesis;
                        let msg = new SpeechSynthesisUtterance();
                        const voices = synth.getVoices();
                        msg.voice = voices.filter(function (voice) {
                            return voice.name === 'Google UK English Male';
                        })[0];
                        msg.text = speechText;
                        synth.speak(msg);

                    }

                    this.setState({isItVoice: false});
                    this.setState({value: ""});
                    if (fulfillmentMessageCount > 1) {
                        if (typeof data.queryResult.fulfillmentMessages["1"].payload !== 'undefined') {
                            if (typeof data.queryResult.fulfillmentMessages["1"].payload.redirect !== 'undefined') {
                                this.setState({link: data.queryResult.fulfillmentMessages["1"].payload.redirect});
                            } else if (typeof data.queryResult.fulfillmentMessages["1"].payload.search !== 'undefined') {
                                this.getSearch(data.queryResult.fulfillmentMessages["1"].payload.search);
                            } else if (typeof data.queryResult.fulfillmentMessages["1"].payload.leave !== 'undefined') {
                                this.createLeave(data.queryResult.parameters.startDate, data.queryResult.parameters.endDate);
                            } else {
                                this.getLink(data.queryResult.action);
                            }
                        } else {
                            this.getLink(data.queryResult.action);
                        }
                    } else {
                        this.getLink(data.queryResult.action);
                    }
                }.bind(this))
            }.bind(this));
        event.preventDefault();
    }

    createLeave(startDate, endDate) {
        let headlessApiUrl = Liferay.ThemeDisplay.getPortalURL() + "/o/c/annualleaves?p_auth=" + Liferay.authToken;
        let startDateAsDate = new Date(startDate);
        let endDateAsDate = new Date(endDate);
        let days = Math.round((endDateAsDate.getTime() - startDateAsDate.getTime()) / (1000 * 60 * 60 * 24));
        let annualPost = {
            "reason": "Generated by chatbot",
            "days": days,
            "endDate": endDate,
            "startDate": startDate
        };

        let annualPostString = JSON.stringify(annualPost);

        fetch(headlessApiUrl, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: annualPostString
        });
    }

    getSearch(searchPhrase) {
        let searchPhraseUse = searchPhrase;
        let groupId = Liferay.ThemeDisplay.getSiteGroupId();
        let headlessApiUrl = Liferay.ThemeDisplay.getPortalURL() + "/o/headless-delivery/v1.0/sites/" + groupId + "/structured-contents?flatten=true&search=" + searchPhraseUse + "&p_auth=" + Liferay.authToken;

        fetch(headlessApiUrl, {
            method: 'GET', headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then(function (data) {
                let searchObjectArray = [];
                if (data !== undefined) if (data.status !== 'NOT_FOUND' && data.items !== undefined) {
                    let items = data.items;
                    for (let i = 0; i < items.length; i++) {
                        if (i > 2) {
                            break;
                        }
                        let searchObject = {title: "", description: "", friendlyUrl: ""};
                        let fields = items[i].contentFields
                        searchObject.friendlyUrl = items[i].friendlyUrlPath;
                        console.debug(items[i].friendlyUrlPath);
                        for (let g = 0; g < fields.length; g++) {
                            if (fields[g].name === "title" || fields[g].name === "Title" || fields[g].name === "Question" || fields[g].name === "question") {
                                searchObject.title = fields[g].contentFieldValue.data
                            }
                            if (fields[g].name === "description" || fields[g].name === "header" || fields[g].name === "ShortAnswer" || fields[g].name === "Header" || fields[g].name === "Description") {
                                searchObject.description = fields[g].contentFieldValue.data
                            }
                        }
                        console.debug(searchObject);
                        searchObjectArray.push(searchObject);
                    }
                }
                console.debug(searchObjectArray);
                this.setState({arraySearch: searchObjectArray});
            }.bind(this))
    }

    renderSearchResults() {
        const urlString = Liferay.ThemeDisplay.getPortalURL() + `/group/${this.props.siteName}/-/`;
        return (<div>
            {this.state.arraySearch.map((search, index) => (<div key={index}>
                <h3>{search.title}</h3>
                <p><i>{search.description}</i></p>
                <a className="btn icon btn-primary" href={urlString + search.friendlyUrl}>Read content...</a>
                <br/>&nbsp;
                <br/>
            </div>))}
        </div>);

    }

    getLink(action) {
        let returnUrlAndVariable = this.props.returnUrl + "&" + this.props.instanceId + "action=" + action;
        fetch(returnUrlAndVariable, {
            method: 'GET', headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then(function (data) {
                this.setState({link: data});
            }.bind(this));
    }

    renderButton() {
        if (this.state.link !== "") {
            return <a className="btn btn-primary button-custom" href={this.state.link}>Open</a>
        } else {
            return <p></p>
        }

    }

    render() {
        return (<div data-analytics-asset-type="custom"
                     data-analytics-asset-id="Ask Ray React"
                     data-analytics-asset-category="ask-ray-form"
                     data-analytics-asset-title="Ask Ray Form">
            <form onSubmit={this.handleSubmit}>
                <div>
                    {this.state.apiAiDataObject.map(apiAiDataObjects => (<div
                        className={apiAiDataObjects.type === "query" ? "conversation-query" : "conversation-response"}
                        key={apiAiDataObjects.apiAiDataId}>
                        <b>{apiAiDataObjects.type === "query" ? "You said..." : "Ray said..."}</b><br/>{apiAiDataObjects.speech}
                    </div>))}
                    <this.renderButton/>
                    <this.renderSearchResults/>
                    <div><input className="field form-control" onChange={this.handleChange} name="ai-query"
                                type="text" value={this.state.value}/>
                    </div>
                    <br/>
                    <div>
                        <button className="btn icon btn-primary" value="submit" name="go" type="submit">Go</button>
                        &nbsp;
                        <button className="btn icon btn-primary" onClick={this.recordVoice} name="micbutton"
                                type="text" value="Speak">Speak
                        </button>
                    </div>
                    <br/>
                </div>
            </form>
        </div>);
    }
}

export default function (elementId, returnUrl, accessToken, conversationSession, siteName, serviceContextPath, dialogflowProjectId) {
    ReactDOM.render(<AiApiConversation returnUrl={returnUrl} instanceId={elementId}
                                       conversationSession={conversationSession} accessToken={accessToken}
                                       siteName={siteName} serviceContextPath={serviceContextPath}
                                       dialogflowProjectId={dialogflowProjectId}/>, document.getElementById(elementId));
}


