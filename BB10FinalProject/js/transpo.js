function openWebLinkInBrowser() {
    // open web link in browser
    blackberry.invoke.invoke({
        target: "sys.browser",
        uri: "http://www.octranspo.com/mobi/"
    }, onInvokeSuccess, onInvokeError);
}

function onInvokeSuccess() {
}

function onInvokeError(error) {
    alert("Browser Launch Failed: " + error);
}

