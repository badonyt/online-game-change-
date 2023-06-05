class players {
    constructor(x: number, y: number, identifier: string, publicid: string) {
        this.x = x;
        this.y = y;
        this.identifier = identifier;
        this.publicid = publicid;
    }
}

let Players: players[] = [];
Bun.serve({
    fetch(req, server) {
        // upgrade the request to a WebSocket
        if (server.upgrade(req)) {
            return; // do not return a Response
        }
        return new Response("Upgrade failed :(", { status: 500 });
    },
    websocket: {
        publishToSelf: false,
        message(ws, message) { 
            //@ts-ignore
            const messagejson = JSON.parse(message)
            if (messagejson["type"] == "initial"){
                console.log(messagejson["data"])
                Players.push(new players(messagejson["data"]["x"],messagejson["data"]["y"],messagejson["data"]["identifier"],messagejson["data"]["publicid"]))
            }else if(messagejson["type"] == "movement"){
                console.log(messagejson["data"])
                for (let i = 0; i < Players.length; i++) {
                    if(Players[i].identifier === messagejson["data"]["identifier"]){
                        Players[i] = new players(messagejson["data"]["x"],messagejson["data"]["y"],messagejson["data"]["identifier"],messagejson["publicid"])
                        ws.publish('the-group-chat', JSON.stringify({type: "posplayer",data: {x:messagejson["data"]["x"],y:messagejson["data"]["y"],publicid:messagejson["publicid"]}}))
                    }
                    console.log("HEY"+Players)
                } 
                
                
                
            }
        }, 
        open(ws) { console.log(ws);ws.subscribe('the-group-chat'); }, // a socket is opened
        close(ws, code, message) {ws.unsubscribe('the-group-chat'); }, // a socket is closed
        //  drain(ws) {}, // the socket is ready to receive more data
    },
    port: 3000
});
