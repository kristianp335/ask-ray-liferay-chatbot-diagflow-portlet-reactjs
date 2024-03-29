package com.liferay.npm.react.ai.portlet.action;

import com.liferay.npm.react.ai.constants.ReactAiConstants;
import com.liferay.portal.kernel.portlet.ConfigurationAction;
import com.liferay.portal.kernel.portlet.DefaultConfigurationAction;
import org.osgi.service.component.annotations.Component;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.PortletConfig;

@Component(
        immediate = true,
        property = {
                "javax.portlet.name=" + ReactAiConstants.REACT_AI_PORTLET_NAME
        },
        service = ConfigurationAction.class
)
public class ReactAiPortletConfigurationAction extends DefaultConfigurationAction {
    @Override
    public void processAction(PortletConfig portletConfig, ActionRequest actionRequest, ActionResponse actionResponse) throws Exception
    {
        super.processAction(portletConfig,actionRequest,actionResponse);
    }
}
