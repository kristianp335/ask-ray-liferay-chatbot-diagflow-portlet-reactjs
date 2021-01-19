package com.liferay.npm.react.ai.portlet.configuration;

import aQute.bnd.annotation.metatype.Meta;
import com.liferay.portal.configuration.metatype.annotations.ExtendedObjectClassDefinition;

@ExtendedObjectClassDefinition(
        category = "liferay-custom",
        scope = ExtendedObjectClassDefinition.Scope.PORTLET_INSTANCE
)
@Meta.OCD(
        id = "com.liferay.npm.react.ai.portlet.configuration.ReactAiPortletConfiguration"
)
public interface ReactAiPortletConfiguration {
    @Meta.AD(deflt = "", required = false)
    String json();
}
