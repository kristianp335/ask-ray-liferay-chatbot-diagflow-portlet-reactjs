package com.liferay.npm.react.ai.portlet;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.liferay.npm.react.ai.constants.ReactAiPortletKeys;

import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.portlet.Portlet;
import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import org.osgi.service.component.annotations.Component;

/**
 * @author kpatefield
 */
@Component(
	immediate = true,
	property = {
		"com.liferay.portlet.display-category=category.sample",
		"com.liferay.portlet.header-portlet-css=/css/index.css",
		"com.liferay.portlet.instanceable=true",
		"javax.portlet.display-name=React to Ray...",
		"javax.portlet.init-param.template-path=/",
		"javax.portlet.init-param.view-template=/view.jsp",
		"javax.portlet.name=" + ReactAiPortletKeys.ReactAi,
		"javax.portlet.resource-bundle=content.Language",
		"com.liferay.fragment.entry.processor.portlet.alias=react-to-ray",
		"javax.portlet.security-role-ref=power-user,user"
	},
	service = Portlet.class
)


public class ReactAiPortlet extends MVCPortlet { 
	public void doView(
			RenderRequest renderRequest, RenderResponse renderResponse)
				throws IOException, PortletException {
	
	String accessToken =  null;
	ClassLoader classloader = Thread.currentThread().getContextClassLoader();
	InputStream stream = classloader.getResourceAsStream("liferay-onhm-e29a44679275.json");
	List<String> scopes = Arrays.asList("https://www.googleapis.com/auth/cloud-platform", "https://www.googleapis.com/auth/dialogflow"); 
	GoogleCredential credentials = GoogleCredential.fromStream(stream).createScoped(scopes);
	credentials.refreshToken();
	accessToken = credentials.getAccessToken();
	System.out.println("Access token for dialog flow is " + accessToken);
	String conversationSession = renderRequest.getPortletSession().getId();
	renderRequest.setAttribute("accessToken", accessToken);
	renderRequest.setAttribute("conversationSession", conversationSession);
	
	super.doView(renderRequest, renderResponse);
	
	}
	
}
