<%@ include file="/init.jsp" %>

<portlet:resourceURL id="/returnUrl" var="returnUrl">
</portlet:resourceURL>

<div id="<portlet:namespace />"></div>

<aui:script require="react-apiai@1.0.0">
	reactApiai100.default('<portlet:namespace />', '${returnUrl}');
</aui:script>