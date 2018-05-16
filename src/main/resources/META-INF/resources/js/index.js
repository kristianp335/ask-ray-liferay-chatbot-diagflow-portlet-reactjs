import React from 'react';
import ReactDOM from 'react-dom';

class AiApiConversation extends React.Component {
	constructor(props) {
		  super(props);						
		  this.state = ({apiAiDataObject: [], value: "", isItVoice: false});	  
		  this.handleChange = this.handleChange.bind(this);
		  this.handleSubmit = this.handleSubmit.bind(this);
		  this.recordVoice = this.recordVoice.bind(this);
		  this.getApiAiData(); 
 }
  
  getApiAiData() {
	  Liferay.Service(
		  '/apiai.apiaidata/get-recent-conversation',
		  {
			  records: 5
		  },
		  function(obj) {
			  console.log(obj);
			  var myObject = this.state.apiAiDataObject;
			  obj.map(someObjects => (myObject.push(someObjects)));			
			  this.setState(apiAiDataObject = myObject);
			  console.log(this.state.apiAiDataObject);	  
			  }.bind(this)
	  );
  }

  handleChange(event) {
	  	  this.setState({value: event.target.value});
  }

  recordVoice(event) {
		this.setState({isItVoice : true});
		let SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
		let SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
		let recognitionReact = new SpeechRecognition();
		recognitionReact.lang = 'en-UK';
		let synth = window.speechSynthesis;
		let msg = new SpeechSynthesisUtterance();	
		recognitionReact.start();
		recognitionReact.onresult = function(event) {
			var speechResultReact = this.state.value;
			speechResultReact = event.results["0"]["0"].transcript;
			this.setState({value : speechResultReact});
			this.handleSubmit(event);
	  	}.bind(this)
  }

  

  handleSubmit(event) {
	let apiAiRequest = ({ query: this.state.value,
	lang: "en",    	
	sessionId: "12345"
	});
	let apiAiRequestString = JSON.stringify(apiAiRequest);
	$.ajax({
		url: "https://api.api.ai/v1/query?v=20150910",
		type: "POST",
		contentType: "application/json",
		data: apiAiRequestString,
		beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer 4304414ee84640ef8267ea82c383d6e9');},
		success: function(data) {
			console.log(data);
			Liferay.Service(
				'/apiai.apiaidata/add-api-ai-data-persistence',
				{
					query: data.result.resolvedQuery, 
					authtoken: "4304414ee84640ef8267ea82c383d6e9", 
					speech: data.result.fulfillment.messages["0"].speech, 
					action: data.result.action, 
					fulfillment: data.result.fulfillment, 
					result: data.result
				},
				function(obj) {
					this.getApiAiData();
					if(this.state.isItVoice == true)
						{
							let synth = window.speechSynthesis;
							let msg = new SpeechSynthesisUtterance();
							msg.text = data.result.fulfillment.messages["0"].speech;
							synth.speak(msg);
						}
					this.setState({isItVoice : false});
					this.setState({value: ""});
					}.bind(this)
			)
		
		}.bind(this)
	 })
	 event.preventDefault();
}

  render() {
	  return (
		<form onSubmit={this.handleSubmit}>
			<div>
				{this.state.apiAiDataObject.map(apiAiDataObjects => (
				<div className={apiAiDataObjects.type == "query" ? "conversation-query" : "conversation-response"} 
				key={apiAiDataObjects.apiAiDataId}><b>{apiAiDataObjects.type == "query" ? "You said..." : "Ray said..."}</b><br/>{apiAiDataObjects.speech}</div>
				))}		
			
				<div><input className="field form-control" onChange={this.handleChange} name="ai-query" type="text" value={this.state.value}/>
				</div>
				<div>
					<p>
						<br/>					
						<button className="btn icon-microphone btn-default" onClick={this.recordVoice}  name="micbutton" type="text"/>						
					</p>
				</div>
			</div>
		</form>		  
	  );
	}
}

export default function(elementId) {
		ReactDOM.render(<AiApiConversation/>, document.getElementById(elementId));
}

