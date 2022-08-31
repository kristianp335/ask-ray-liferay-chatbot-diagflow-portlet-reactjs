<%@ include file="/init.jsp" %>

<portlet:resourceURL id="/returnUrl" var="returnUrl">
</portlet:resourceURL>
<button onClick="var portlet = document.querySelector( '#<portlet:namespace />' ); portlet.style.display === 'none' ? portlet.style.display = 'block' : portlet.style.display = 'none';" class="btn btn-primary ray-button" ><clay:icon symbol="quote-left" /></button>
<div class="ray-container" id="<portlet:namespace />"></div>

<aui:script require="react-apiai@1.0.0">
	reactApiai100.default('<portlet:namespace />', '${returnUrl}', '${accessToken}', '${conversationSession}', '${siteName}', '${serviceContextPath}', '${dialogflowProjectId}');
</aui:script>