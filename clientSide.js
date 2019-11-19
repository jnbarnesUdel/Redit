
// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyBLgGEA6cpy7bGfDI9yEBoQEyk4_0hkdKg",
	authDomain: "classreddit.firebaseapp.com",
	databaseURL: "https://classreddit.firebaseio.com",
	projectId: "classreddit",
	storageBucket: "classreddit.appspot.com",
	messagingSenderId: "33211303766",
	appId: "1:33211303766:web:22607a3773e069fc5ff8f7",
	measurementId: "G-S5ZF4S8SV2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var h = document.getElementById("head").innerHTML;
var root = "/";
var url = "https://us-central1-classreddit.cloudfunctions.net/app";
var loc = root.concat(h);
var db = firebase.database();
var stuff;
var count = 0;
var user;
/*
db.ref(loc).on("value", function(snapshot) {
  var stuff = snapshot.val()
  for(var id in stuff){
    console.log(id);
  }
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
*/

//lets do user stuff here




let clickableBoard = function(yourname, mov){
  this.yourname = yourname;
  this.mov = mov;
  
  this.generateEl = function(){
    var that = this;
    this.$el = $(`<p>${yourname}</p>`);
    this.$el.on('click', function(){
      that.selected();
    });
  };
  
  this.selected = function(){
    document.getElementById("head").innerHTML = this.yourname;
    loc = this.mov;
    render();
    $("#but").empty();
    $("#but").append("<button id = b1 type = 'button'> create thread </button>");
    document.getElementById("b1").addEventListener("click", addThreadBut.bind(window));
}
  
  this.generateEl();
}

let clickableThread = function(yourname, mov){
  this.yourname = yourname;
  this.mov = mov;
  
  this.generateEl = function(){
    var that = this;
    this.$el = $(`<p>${yourname}</p>`);
    this.$el.on('click', function(){
      that.selected();
    });
  };
  
  this.selected = function(){
    document.getElementById("head").innerHTML = this.yourname;
    loc = this.mov;
    render();
    $("#but").empty();
    $("#but").append("<button id = b1 type = 'button'> add comment </button>");
    document.getElementById("b1").addEventListener("click", addCommentBut.bind(window));
}
  
  this.generateEl();
}

let Comment = function(yourname, text){
  this.yourname = yourname;
  this.text = text;
  
  this.generateEl = function(){
    var that = this;
    this.$el = $(`<p>${yourname}: `.concat(`${text}</p>`));
    this.$el.on('click', function(){
      that.upvote();
    });
  };
  
  this.upvote = function(){
    //document.getElementById("head").innerHTML = this.yourname;
   // loc = this.mov;
    //render();
}
  
  this.generateEl();
}

var createBoard = function(yourname, mov){
  var board = new clickableBoard(yourname, mov);
  $("#boards").append(board.$el);
}

var createThread = function(yourname, mov){
  var thread = new clickableThread(yourname, mov);
  $("#boards").append(thread.$el);
}

var createComment = function(yourname, text){
  var comment = new Comment(yourname, text);
  $("#boards").append(comment.$el);
}

var addThread = function(){
  count++;
  var thing = "thread";
  thing += count;
  var address = loc.split("/").pop(); //take off last part of loc 
  address = "/".concat(address, "/", thing); //set up in style /$board/$thread
  var b = document.getElementById("blurb").value;
  var n = document.getElementById("title").value;
  var t = `{blurb: "${b}",`.concat(` threadAddress: "${address}", `,`threadName: "${n}"}`);
  //t = JSON.stringify(t);
  console.log(t);
  db.ref(loc).child(thing).set({blurb: b, threadAddress: address, threadName: n}); //create thread and add to database
  var k = "/threads";
  k = k.concat(loc.split("boards")[1], "/", thing); //take off /boards part of address and replace with /threads and end with the threadUUID
  db.ref(k).child("comment1").set({author: user.displayName, authorUUID: user.uid, text: b}); //make blurb the first comment in the thread
  $("#but").empty();
  $("#but").append("<button id = b1 type = 'button'> create thread </button>");
  document.getElementById("b1").addEventListener("click", addThreadBut);
}

var addComment = function(){
  count++
  var thing = "comment";
  thing += count;
  var address = loc.split("/").pop();
  address = "/".concat(address, "/", thing);
  var b = document.getElementById("text").value;
  var t = `{blurb: "${b}",`.concat(` threadAddress: "${address}"}`);
  //t = JSON.stringify(t);
  console.log(t);
  db.ref(loc).child(thing).set({author: user.displayName, authorUUID: user.uid, text: b}) //need to add user stuff to this can't do till after authentication
  $("#but").empty();
  $("#but").append("<button id = b1 type = 'button'> add comment </button>");
  document.getElementById("b1").addEventListener("click", addCommentBut);
}

var addThreadBut = function(){
  $("#but").empty();
  $("#but").append("<input id = 'title' type = 'text'> add title </input>");
  $("#but").append("<input id = 'blurb' type = 'text'> add blurb </input>");
  $("#but").append("<button id = 'b2' type = 'button'> enter </button>");
  document.getElementById("b2").addEventListener("click", addThread);
}

var addCommentBut = function(){
  $("#but").empty();
  $("#but").append("<input id='text' type = 'text'> add text </input>");
  $("#but").append("<button id = 'b1' type = 'button'> enter </button>");
  document.getElementById("b1").addEventListener("click", addComment);
}


function render(){
  count = 0;
  console.log("render");
  console.log(loc);
  db.ref(loc).on("value", function(snap){
    $("#boards").empty();
    stuff = snap.val();
    console.log(stuff);
    for(var id in stuff){
        //count++;
        if(loc === "/home"){
          console.log("home");
          console.log(stuff[id]);
          let yourname = stuff[id].boardName;
          let mov = "/boards".concat(stuff[id].boardAddress);
          createBoard(yourname, mov);
       }
       else if(loc.startsWith("/boards")){
          console.log("boards");
          console.log(stuff[id]);
          let yourname = stuff[id].threadName;
          let mov = "/threads".concat(stuff[id].threadAddress);
          count = stuff[id].threadAddress.split("thread").pop();
          createThread(yourname, mov);
       }
       else{
          console.log("threads");
          count = id.split("comment").pop();
          let yourname = stuff[id].author;
          let text = stuff[id].text;
          //count = stuff[id].commentAddress.split("thread").pop();
          //let mov = stuff[id].parent;
          createComment(yourname, text);
       }
      }
    },
function (errorObject) {
  console.log("The read failed: " + errorObject.code);
}); 
}

$(document).ready(function(){
  render();
  
  var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    user = result.user;
    console.log(user);
	console.log(user.displayName);
	$("#bot").append(`<h1>Welcome ${user.displayName}</h1>`);
  });
});



