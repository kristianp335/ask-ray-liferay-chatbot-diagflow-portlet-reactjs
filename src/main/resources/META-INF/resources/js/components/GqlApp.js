import React from 'react';
import ReactDOM from 'react-dom';

import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

import ClayCard from '@clayui/card';

class GqlApp extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
	const MY_QUERY = gql`
query { 
    structuredContents(flatten: true, page: 1, pageSize: 10, filter: "contains(title,'Mundane')", siteKey: "DXP Insurance Retail") {
       totalCount
    items {
      title
      creator {
        name
      }
      contentFields {
        dataType
        name 
        contentFieldValue {
          data
          document {
            actions
            contentType
            contentUrl
            contentValue
            description
            encodingFormat
            fileExtension
            id
            sizeInBytes
            title
            graphQLNode {
              id
            }
          }
          geo {
            latitude
            longitude
          }
          image {
            actions
            contentType
            contentUrl
            contentValue
            description
            encodingFormat
            fileExtension
            id
            sizeInBytes
            title
            graphQLNode {
              id
            }
          }
          link
          structuredContentLink {
            contentType
            id
            title
            graphQLNode {
              id
            }
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
	    	  		  imageLocation = contentFields[i].contentFieldValue.image.contentUrl;
	    	  	  }
	    	  	  if (contentFields[i].name == "ArticleTitle") {
	    	  		  articleTitle = contentFields[i].contentFieldValue.data;
	    	  	  }
	    	  	  if (contentFields[i].name == "ArticleContent") {
	    	  		  articleContent = contentFields[i].contentFieldValue.data;
	    	  	  }
	    	  	}
	    	  	
	    	  //Hack to remove HTML
	    	  	
	    	  	articleContent = articleContent.replace("<p>", "");
	    	  	articleContent = articleContent.replace("</p>", "");	
	    	  	console.log("The image URL is " + imageLocation);
	    	  	return (
	    	  			<div>
		    	  			<h4>Through the power of GraphQL Ray thinks you might like this...</h4>
		    	  			
							<ClayCard>
								<div>
									<img className="img img-responsive" src={Liferay.ThemeDisplay.getPortalURL() + imageLocation}></img>
								</div>	
								<ClayCard.Body>
									<br/>
									<ClayCard.Description displayType="title">
										{articleTitle}
									</ClayCard.Description>
									<br/>
									<ClayCard.Description truncate={false} displayType="text">
										{articleContent}
									</ClayCard.Description>
								</ClayCard.Body>
							</ClayCard>
		    	  			
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