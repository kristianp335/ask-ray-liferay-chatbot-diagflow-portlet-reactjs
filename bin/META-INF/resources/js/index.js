import React from 'react';
import ReactDOM from 'react-dom';

class AiApiConversation extends React.Component {
	constructor(props) {
		  super(props);						
		  this.state = ({apiAiDataObject: []});		
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

  callApiAi() {
	  alert("Hello World");
  }

  render() {
	  return (
		<div>
			{this.state.apiAiDataObject.map(apiAiDataObjects => (
			<div className={apiAiDataObjects.type == "query" ? "conversation-query" : "conversation-response"} 
			key={apiAiDataObjects.speech}>{apiAiDataObjects.speech}</div>
			))}		
 		
			<div><input className="field form-control" onBlur={this.callApiAi} name="ai-query" type="text" value=""/>
			</div>
		</div>			  
	  );
	}
}

export default function(elementId) {
		ReactDOM.render(<AiApiConversation/>, document.getElementById(elementId));
}

