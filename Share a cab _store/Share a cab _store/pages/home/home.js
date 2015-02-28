(function () {
    "use strict";
    var apps = WinJS.Application;
    apps.onactivated = function (args) {
        args.setPromise(WinJS.UI.processAll());
    }
    

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
        }

       
    });

    
})();
