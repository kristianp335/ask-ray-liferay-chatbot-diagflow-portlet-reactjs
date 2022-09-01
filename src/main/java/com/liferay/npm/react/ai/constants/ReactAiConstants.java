package com.liferay.npm.react.ai.constants;

import java.util.List;

/**
 * @author kpatefield
 */
public class ReactAiConstants {
    public static final String REACT_AI_PORTLET_NAME = "ReactAi";
    public static final String ACCESS_TOKEN_REQUEST_ATTRIBUTE = "accessToken";
    public static final String CONVERSATION_SESSION_REQUEST_ATTRIBUTE = "conversationSession";
    public static final String SITE_NAME_REQUEST_ATTRIBUTE = "siteName";
    public static final String SERVICE_CONTEXT_PATH_REQUEST_ATTRIBUTE = "serviceContextPath";
    public static final String DIALOGFLOW_PROJECT_ID_REQUEST_ATTRIBUTE = "dialogflowProjectId";
    public static final String SERVICE_ACCOUNT_JSON_PROJECT_ID = "project_id";
    public static final List<String> SCOPES = List.of(
			"https://www.googleapis.com/auth/cloud-platform", "https://www.googleapis.com/auth/dialogflow");
}