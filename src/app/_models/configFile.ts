


const dbgPrint = false;


export var constSrvUrl:any;

//Todo: that as service

export class ServerConfigs {


    private serverURL : string = "";
    private host : string = "";
    private userId: string = "";
    //var sshPort = 8443;

    public onDevelopmentEnv = false;

    constructor()
    {

        let locUrl = window.location;
        //locUrl =

        if (dbgPrint) console.log("locUrl=",locUrl );

        if (locUrl.pathname.indexOf('Plone') == -1)
        {
            //we're on developent system, so we need rest-login and authorization token
            this.host = 'http://192.168.159.130:8080'; //for vmWare with PLone-instance running
            this.serverURL = this.host + '/Plone';
            this.userId = 'mueller';
            this.onDevelopmentEnv  = true;
        }
        else
        {
            //we're on production system
            this.onDevelopmentEnv  = false;
            this.host= locUrl.host;
            this.serverURL = locUrl.protocol + '//' + this.host + '/Plone';

            //todo:found userId in url
            if (locUrl.pathname.indexOf('applications') != -1)
            {

                let splitPathname = locUrl.pathname.split("/");
                console.log("splitPathname =",splitPathname );
                if (splitPathname.length)
                {
                    this.userId = splitPathname[splitPathname.length-1];
                }

            }
        }




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


        if (dbgPrint)  console.log("serverURL=",this.serverURL);

        constSrvUrl = this.serverURL;
    }


    get_serverConfigs()
    {

        let srvObj = {
            userId: this.userId,
            url : this.serverURL ,
            host: this.host
        };

        return srvObj;
    }

}

export const RunningConfigs = {
    runWithFakeBackend : false
}
