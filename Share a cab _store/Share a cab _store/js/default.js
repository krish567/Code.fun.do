// For an introduction to the Navigation template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";
    var lastposition=null;
    var activation = Windows.ApplicationModel.Activation;
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;

    var gl = new Windows.Devices.Geolocation.Geolocator();
    gl.getGeopositionAsync().done(function (position) {    
        var lastPosition = { latitude: position.coordinate.latitude, longitude: position.coordinate.longitude };
        callFrameScript(document.frames["map"], "pinLocation", [position.coordinate.latitude, position.coordinate.longitude]);
    }, function (err) {
        var dlg = new Windows.UI.Popups.MessageDialog(err.message, "Location Lookup Error!");
        dlg.showAsync();
    });

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            nav.history = app.sessionState.history || {};
            nav.history.current.initialPlaceholder = true;

            // Optimize the load of the application and while the splash screen is shown, execute high priority scheduled work.
            ui.disableAnimations();
            var p = ui.processAll().then(function () {
                return nav.navigate(nav.location || Application.navigator.home, nav.state);
            }).then(function () {
                return sched.requestDrain(sched.Priority.aboveNormal + 1);
            }).then(function () {
                ui.enableAnimations();
            });

            args.setPromise(p);
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };
    function callFrameScript(frame,targetfunction,args){
        var message={functionName: targetfunction,args:args};
        frame.postMessage(JSON.stringify(message), "ms-appx-web://" + documment.location.host);
    }

    app.start();
    
})();
