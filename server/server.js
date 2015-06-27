var HEADERS = {
    HTML: {
        "Content-Type": "text/html; charset=utf-8"
    },
    PLAIN: {
        "Content-Type": "text/plain; charset=utf-8"
    },
    JSON: {
        "Content-Type": "text/plain; charset=utf-8"
    },
    CORS: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Access-Control-Allow-Methods": "HEAD, POST, GET, OPTION, DELETE"
    }
}

var CONFIG = {
    IP_ADDRESS: 'localhost',
    PORT: 8080,
    messages: {
        START: 'Server is listening on ',
        STARTED: 'Server is Starting',
        STOP: 'Server is going down',
        STOPED: 'Server stopped'
    },
    routes: {
        '/': {
            name: 'index',
            file: null,
            headers: HEADERS.PLAIN
        },
        '/json': {
            name: 'json',
            file: null,
            type: HEADERS.JSON
        },
        '/nocase': {
            name: 'json',
            file: null,
            type: HEADERS.JSON
        },
        '404': {
            name: '404',
            code: 404,
            file: null,
            content: 'No such a file',
            type: HEADERS.PLAIN
        }
    },
}

var app = {
    http: require('http'),
    fs: require('fs'),
    url: require('url'),
    start: function() {
        console.log(CONFIG.messages.START);
        app.http.createServer(app.requestHandler).listen(CONFIG.PORT);
        console.log(CONFIG.messages.STARTED);
    },
    stop: function() {
        console.log(CONFIG.messages.STOPPING);
        console.log(CONFIG.messages.STOPPED);
    },
    content: function(route) {
    	console.log(route)
    	return (route.content)?route.content:app.getContent(route);
    },
    getContent: function(route) {
    	return (route.file)?app.fs.readFileSync(route.file):'';
    },
    getRoute: function(request) {
        var route =  CONFIG.routes[app.url.parse(request.url).pathname]
        return (route)?route:CONFIG.routes['404'];
    },
    requestHandler: function(request, response) {
        var route = app.getRoute(request);
        response.writeHead(route.code || 418,route.headers);
        response.write(app.content(route));
        response.end('');
    }
}
app.start();

var data = {
    users: [{
        name: 'user',
        password: 'user'
    }]
}
