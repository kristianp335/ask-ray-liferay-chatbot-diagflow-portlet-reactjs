package com.liferay.npm.react.ai.portlet.configuration.definition;

import com.liferay.npm.react.ai.portlet.configuration.ReactAiPortletConfiguration;
import com.liferay.portal.kernel.settings.definition.ConfigurationBeanDeclaration;

public class ReactAiPortletConfigurationBeanDeclaration implements ConfigurationBeanDeclaration {
    @Override
    public Class<?> getConfigurationBeanClass()
    {
        return ReactAiPortletConfiguration.class;
    }
}
