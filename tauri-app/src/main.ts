let x: number;
let y: number;
let publicid = generateRandomString(6);
const identifier: string = generateRandomString(20);
x = 30
y = 30

let enemys:string[] = [];
function generateRandomString(length: number): string {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()$!!???';
  var result = '';
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * chars.length);
    result += chars.charAt(randomIndex);
  }
  return result;
}


function setup() {
  createCanvas(400, 400);
}
function draw() {
  background(100);
  ellipse(x, y, 20);
  for (let i = 0; i < enemys.length; i++) {
    let c = color(255, 204, 0);
    fill(c);
    ellipse(enemys[i]["x"],enemys[i]["y"],20)
    fill("white")
  }
}
var ws = new WebSocket("ws://localhost:3000/");
ws.onopen = function () {

  ws.send(JSON.stringify({ type: "initial", data: { x: x, y: y, identifier: identifier, publicid: publicid } }))
};
ws.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
  const stuff = JSON.parse(event.data)
  console.log(stuff)
  if (stuff["type"] == "posplayer") {
    //@ts-ignore
    let stop = false;
    console.log("ellipse")
    for (let i = 0; i < enemys.length; i++) {
      if (stuff["data"]["publicid"] == enemys[i]["publicid"] && stop == false) {
        enemys[i] = { x: stuff["data"]["x"], y: stuff["data"]["y"], publicid: stuff["data"]["publicid"] }
        stop = true;

      }
    }
    if(stop==false){
      enemys.push({ x: stuff["data"]["x"], y: stuff["data"]["y"], publicid: stuff["data"]["publicid"] })
    }
    
    //backround
  }
});


document.addEventListener('keydown', function (event) {
  if (event.key === 'w') {
    
    if(y != 10){
      y = y - 5
    }
  }
  if (event.key === 's') {
    if(y != 390){
      y = y + 5
    }
    
  }
  if (event.key === 'a') {
    if(x != 10){
      x = x - 5
    }
    
  }
  if (event.key === 'd') {
    if(x != 390){
      x = x + 5
    }
    
  }
  ws.send(JSON.stringify({ type: "movement", data: { x: x, y: y, identifier: identifier } }))
});
