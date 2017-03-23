"use strict";
var port = 8443;
var dbgPrint = false;
var ServerConfigs = (function () {
    //constructor(@Inject(WindowRef) private _window: WindowRef)
    //constructor(_window: Window)
    function ServerConfigs(_window) {
        this._window = _window;
        var window = _window.nativeWindow;
        console.log("window=", window.location);
        /*
        this.host = _window.location.toString();
        var splitString = this.host.split('/');
        console.log("splitString=",splitString);

        var protocol =  splitString[0];
        var host_port = splitString[2].split(':');


        if (dbgPrint) console.log("host_port=",host_port);

        /*

        var host = "";
        var port = "";
        if (host_port.length>1)
        {
            host = host_port[0];
            port = host_port[1];
        }
        else host = splitString[2];

        */
        //var host = '192.168.159.130:8080';
        var host = 'localhost:8080';
        /*
        var port;
        if (protocol == 'http:')
            port = '8080';
        else
            port = '8443';
        */
        var host = 'http://192.168.159.130:8080';
        //this.serverURL = protocol + '//' + host + ':' + port + '/Plone';
        //this.serverURL = protocol + '//' + host + '/Plone';
        this.serverURL = host + '/Plone';
        if (dbgPrint)
            console.log("serverURL=", this.serverURL);
        exports.constSrvUrl = this.serverURL;
    }
    ServerConfigs.prototype.get_serverConfigs = function () {
        var srvObj = {
            url: this.serverURL,
            host: this.host
        };
        return srvObj;
    };
    return ServerConfigs;
}());
exports.ServerConfigs = ServerConfigs;
exports.RunningConfigs = {
    runWithFakeBackend: false
};
//# sourceMappingURL=configFile.js.map