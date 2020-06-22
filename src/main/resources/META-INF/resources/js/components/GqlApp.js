import React from 'react';
import ReactDOM from 'react-dom';

import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

class GqlApp extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
	const MY_QUERY = gql`
query { 
    structuredContents(flatten: true, page: 1, pageSize: 10, filter: "contains(title,'Mundane')") {
       totalCount
    items {
      title
      creator {
        name
      }
      contentFields {
        dataType
        name
        value {
          data
          document {
            contentUrl
            description
            encodingFormat
            fileExtension
            id
            sizeInBytes
            title
          }          
          image {
            contentUrl
            description
            encodingFormat
            fileExtension
            id
            title
          }
        }
      }
    } 
  	}
 }
		`;
	return ( <Query query={MY_QUERY}>
	    {({ loading, error, data }) => {
	      if (loading) { return <div>Loading content...</div>}
	      else if (error) { return <div>Error cannot load content</div> }
	      else
		      {	
	    	  	console.log(data);
	    	  	var contentFields = data.structuredContents.items[0].contentFields;
	    	  	var imageLocation = "";
	    	  	var articleContent = "";
	    	  	var articleTitle = "";
	    	  	
	    	  	for (var i = 0; i < contentFields.length; i++) {
	    	  	  if (contentFields[i].name == "ArticleImage") {
	    	  		  imageLocation = contentFields[i].value.image.contentUrl;
	    	  	  }
	    	  	  if (contentFields[i].name == "ArticleTitle") {
	    	  		  articleTitle = contentFields[i].value.data;
	    	  	  }
	    	  	  if (contentFields[i].name == "ArticleContent") {
	    	  		  articleContent = contentFields[i].value.data;
	    	  	  }
	    	  	}
	    	  	
	    	  //Hack to remove HTML
	    	  	
	    	  	articleContent = articleContent.replace("<p>", "");
	    	  	articleContent = articleContent.replace("</p>", "");	
	    	  	console.log("The image URL is " + imageLocation);
	    	  	return (
	    	  			<div>
		    	  			<h4>Through the power of GraphQL Ray thinks you might like this...</h4>
		    	  			<div className="component-card text-left p-2">
		    	  				<div className="card shadow-sm m-0" style={{borderRadius: "0.1875rem"}}>
			    	  				<div>
			    	  					<img className="img img-responsive" src={Liferay.ThemeDisplay.getPortalURL() + imageLocation}></img>
			    	  				</div>
			    	  				<div className="card-body py-4">
				    	  				<h2>
				    	  					<div>{articleTitle}</div>
				    	  				</h2>
			
				    	  				<div className="mb-4" >
				    	  					<p>{articleContent}</p>
				    	  				</div>
				    	  			</div>
				    	  		</div>
				    	  	</div>
				    	  	<br/>
				    	  	<br/>
			    	  	</div>
		      	)
		      }
	    }}
	  </Query>);
	}
	
}

export default GqlApp;