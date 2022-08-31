package com.liferay.npm.react.ai.portlet.configuration.definition;

import com.liferay.npm.react.ai.portlet.configuration.ReactAiPortletConfiguration;
import com.liferay.portal.kernel.settings.definition.ConfigurationBeanDeclaration;
import org.osgi.service.component.annotations.Component;

@Component(immediate = true, service = ConfigurationBeanDeclaration.class)
public class ReactAiPortletConfigurationBeanDeclaration implements ConfigurationBeanDeclaration {
    @Override
    public Class<?> getConfigurationBeanClass()
    {
        return ReactAiPortletConfiguration.class;
    }
}
