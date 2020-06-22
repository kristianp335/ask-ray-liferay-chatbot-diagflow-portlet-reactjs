package com.liferay.npm.react.ai.portlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.portlet.PortletException;
import javax.portlet.PortletRequest;
import javax.portlet.ResourceRequest;
import javax.portlet.ResourceResponse;

import org.osgi.service.component.annotations.Component;

import com.liferay.npm.react.ai.constants.ReactAiPortletKeys;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.portlet.LiferayPortletURL;
import com.liferay.portal.kernel.portlet.PortletURLFactoryUtil;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCResourceCommand;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.WebKeys;

@Component(
	    immediate = true,
	    property = {
	    	"javax.portlet.name=" + ReactAiPortletKeys.ReactAi,
	        "mvc.command.name=/returnUrl"
	    },
	    service = MVCResourceCommand.class
)

public class ReturnUrlMVCResourceCommand implements MVCResourceCommand {

	@Override
	public boolean serveResource(ResourceRequest resourceRequest, ResourceResponse resourceResponse)
			throws PortletException {
		String thisAction = resourceRequest.getParameter("action");
		ThemeDisplay themeDisplay = (ThemeDisplay) resourceRequest.getAttribute(WebKeys.THEME_DISPLAY);
		String returnUrl = "";
		
		if (thisAction.contains("blog") == true)
		{
			long plid;
			try {
				plid = PortalUtil.getPlidFromPortletId(themeDisplay.getScopeGroupId(), false, "com_liferay_blogs_web_portlet_BlogsPortlet");
				LiferayPortletURL portletUrl = PortletURLFactoryUtil.create(resourceRequest,"com_liferay_blogs_web_portlet_BlogsPortlet" , plid, PortletRequest.RENDER_PHASE);
				returnUrl = portletUrl.toString();
			} catch (PortalException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			
		}
		if( thisAction.contains("setup-email")) {
			long androidPlid = themeDisplay.getPlid();
			LiferayPortletURL androidPortletUrl = PortletURLFactoryUtil.create(resourceRequest,"com_liferay_blogs_web_portlet_BlogsPortlet" , androidPlid, PortletRequest.RENDER_PHASE);
			androidPortletUrl.setParameter("categoryId", "63160");	
			returnUrl = androidPortletUrl.toString();
		}
		try {
			PrintWriter writer = resourceResponse.getWriter();
			writer.write(returnUrl);
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		return false;
	}

}






