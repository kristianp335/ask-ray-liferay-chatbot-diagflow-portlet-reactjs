package com.liferay.npm.react.ai.portlet;

import com.google.api.client.http.HttpResponseException;
import com.google.auth.oauth2.GoogleCredentials;
import com.liferay.npm.react.ai.constants.ReactAiConstants;
import com.liferay.npm.react.ai.portlet.configuration.ReactAiPortletConfiguration;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.json.JSONException;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.module.configuration.ConfigurationException;
import com.liferay.portal.kernel.module.configuration.ConfigurationProvider;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.WebKeys;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.portlet.Portlet;
import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/**
 * @author kpatefield
 */
@Component(immediate = true, property = {"com.liferay.portlet.header-portlet-css=/css/index.css", "com.liferay.portlet.instanceable=false", "javax.portlet.init-param.template-path=/", "javax.portlet.init-param.view-template=/view.jsp", "javax.portlet.name=" + ReactAiConstants.REACT_AI_PORTLET_NAME, "javax.portlet.resource-bundle=content.Language", "javax.portlet.security-role-ref=power-user,user", "com.liferay.portlet.display-category=category.sample"}, configurationPid = ReactAiPortletConfiguration.PID, service = Portlet.class)
public class ReactAiPortlet extends MVCPortlet {
    private final Logger _log = LoggerFactory.getLogger(ReactAiPortlet.class);
    @Reference
    private ConfigurationProvider _configurationProvider;

    public void doView(RenderRequest renderRequest, RenderResponse renderResponse) throws PortletException, IOException {
        final ThemeDisplay themeDisplay = (ThemeDisplay) renderRequest.getAttribute(WebKeys.THEME_DISPLAY);

        final long siteGroupId = themeDisplay.getScopeGroupId();
        _log.trace("siteGroupId {}", siteGroupId);

        final ReactAiPortletConfiguration configuration = getConfiguration(siteGroupId);
        final GoogleCredentials credentials = getGoogleCredentials(configuration.serviceAccountJson());

        try {
            credentials.refresh();
            _log.debug("Successfully refreshed access token");
        } catch (IOException e) {
            if (e.getCause() instanceof HttpResponseException) {
                final HttpResponseException re = (HttpResponseException) e.getCause();
                if (re.getStatusCode() == 400) {
                    try {
                        final JSONObject json = JSONFactoryUtil.createJSONObject(re.getContent());
                        throw new PortletException("Unable to obtain authentication token: " + json.get("error_description"));
                    } catch (JSONException ex) {
                        // return the original
                        throw new PortletException("Unable to obtain authentication token", e);
                    }
                }
            }
            throw new PortletException("Unable to obtain authentication token", e);
        }

        final String accessToken = credentials.getAccessToken().getTokenValue();
        _log.trace("accessToken {}", accessToken);
        renderRequest.setAttribute(ReactAiConstants.ACCESS_TOKEN_REQUEST_ATTRIBUTE, accessToken);

        final String conversationSession = renderRequest.getPortletSession().getId();
        renderRequest.setAttribute(ReactAiConstants.CONVERSATION_SESSION_REQUEST_ATTRIBUTE, conversationSession);

        final Group siteGroup = themeDisplay.getSiteGroup();
        final String siteFriendlyURL = siteGroup.getFriendlyURL().replaceAll("/", "");
        _log.trace("siteFriendlyURL {}", siteFriendlyURL);
        renderRequest.setAttribute(ReactAiConstants.SITE_NAME_REQUEST_ATTRIBUTE, siteFriendlyURL);

        final String serviceContextPath = configuration.serviceContextPath();
        renderRequest.setAttribute(ReactAiConstants.SERVICE_CONTEXT_PATH_REQUEST_ATTRIBUTE, serviceContextPath);

        final String dialogflowProjectId = getDialogflowProjectId(configuration);
        _log.trace("dialogflowProjectId {}", dialogflowProjectId);
        renderRequest.setAttribute(ReactAiConstants.DIALOGFLOW_PROJECT_ID_REQUEST_ATTRIBUTE, dialogflowProjectId);

        super.doView(renderRequest, renderResponse);
    }

    private String getDialogflowProjectId(final ReactAiPortletConfiguration configuration) {
        String dialogflowProjectId = configuration.dialogflowProjectId();
        if (dialogflowProjectId == null || dialogflowProjectId.trim().equals(StringPool.BLANK)) {
            final String serviceAccountJsonString = configuration.serviceAccountJson();
            final JSONObject serviceAccountJson;
            try {
                serviceAccountJson = JSONFactoryUtil.createJSONObject(serviceAccountJsonString);
            } catch (JSONException e) {
                throw new IllegalArgumentException("Unable to determine the dialogflow project identifier", e);
            }
            dialogflowProjectId = serviceAccountJson.getString(ReactAiConstants.SERVICE_ACCOUNT_JSON_PROJECT_ID, StringPool.BLANK);
            if (StringPool.BLANK.equals(dialogflowProjectId)) {
                throw new IllegalArgumentException("Unable to determine the dialogflow project identifier");
            }
        }
        return dialogflowProjectId;
    }

    private GoogleCredentials getGoogleCredentials(final String json) throws PortletException {
        if (json == null || json.trim().equals(StringPool.BLANK)) {
            throw new IllegalArgumentException("The value must be valid json");
        }
        final InputStream stream = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
        final GoogleCredentials credentials;
        try {
            credentials = GoogleCredentials.fromStream(stream);
        } catch (IOException e) {
            throw new PortletException("Unable to read credentials from stream", e);
        }
        return credentials.createScoped(ReactAiConstants.SCOPES);
    }

    private ReactAiPortletConfiguration getConfiguration(final long groupId) throws PortletException {
        try {
            return _configurationProvider.getGroupConfiguration(ReactAiPortletConfiguration.class, groupId);
        } catch (ConfigurationException e) {
            throw new PortletException("Error while getting configuration", e);
        }
    }
}
