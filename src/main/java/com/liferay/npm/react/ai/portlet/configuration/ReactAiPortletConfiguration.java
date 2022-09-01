package com.liferay.npm.react.ai.portlet.configuration;

import aQute.bnd.annotation.metatype.Meta;
import com.liferay.portal.configuration.metatype.annotations.ExtendedObjectClassDefinition;

@ExtendedObjectClassDefinition(
        category = "askray",
        scope = ExtendedObjectClassDefinition.Scope.GROUP
)
@Meta.OCD(
        id = ReactAiPortletConfiguration.PID,
        localization = "content/Language",
        name = "config-react-ai-name",
        description = "config-react-ai-description"
)
public interface ReactAiPortletConfiguration {
    String PID = "com.liferay.npm.react.ai.portlet.configuration.ReactAiPortletConfiguration";

    @Meta.AD(deflt = "apiai.apiaidata",
            description = "config-service-context-path-description",
            name = "config-service-context-path-name",
            required = false)
    String serviceContextPath();

    @Meta.AD(deflt = "",
            description = "config-dialogflow-project-identifier-description",
            name = "config-dialogflow-project-identifier-name",
            required = false)
    String dialogflowProjectId();

    @Meta.AD(deflt = "",
            description = "config-service-account-json-description",
            name = "config-service-account-json-name",
            required = false)
    String serviceAccountJson();
}
