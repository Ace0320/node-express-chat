const socket = io()
const titleMsg = 'CS Chatroom'
let x = 0; 
let y = '';

// initialize:
// Code in document ready or DOMContentLoaded will only run once (DOM) is ready for JavaScript code to execute. 
// Code in window load will run once the entire page (images or iframes), not just the DOM, is ready.

window.addEventListener('load', () => {
  console.log('Entering window.load')

  // access important elements in code............
  const formElement = $("#chatform")[0];  // jQuery CSS selectors return an array - use the first
  const messageElement = $("#m")[0];      // jQuery CSS selectors return an array - use the first

  // configure event listeners (use action - NOT ON action)......
  formElement.addEventListener('submit', submitfunction);   // onsubmit = "return submitfunction();"
  messageElement.addEventListener('keyup', notifyTyping);   // onkeyup = "notifyTyping();"
  document.getElementById("rename").addEventListener("click", renaming);
  window.addEventListener('mouseover', resetTitle)

  // additional initialization.........
  const name = naming();
  $('#user').val(name);
  // emit a chatMessage event from the System along with a message
  socket.emit('chatMessage', 'System', '<b>' + name + '</b> has joined the discussion');
  $('#m').val('').focus()

  console.log('Exiting window.load')
})

// utility function to create a new random user name....
// function makeid() {
//   let text = ''
//   const possible = 'abcdeghijklmnoprstuwxy'
//   for (let i = 0; i < 5; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length))
//   }
//   return text
// }


// emit a new chatMessage event from the client......
function submitfunction() {
  let from = $('#user').val()
  const message = $('#m').val()
  if (message !== '') {
    socket.emit('chatMessage', from, message)
  }
  // what language and selector is used below?
  // set the value to an empty string and
  // focus on the message box again
  $('#m').val('').focus()
  return false; // don't refresh
}

// emit a new notifyUser event from the client.........
function notifyTyping() {
  let user = $('#user').val()
  socket.emit('notifyUser', user)
}

// how to react to a chatMessage event.................
socket.on('chatMessage', function (from, msg) {
  const me = $('#user').val()
  const color = (from === me) ? 'green' : '#009afd'
//  const color2 = (from === me) ? 'white' : 'light grey' //Trading background for bubble arround txt
  const background = (from === me) ? 'lightblue' : 'lightgrey'
  const align = (from === me) ? 'right' : 'left'

  from = (from === me) ? 'Me' : from
  // Attempt to not say the name if it was by the same person
  if(x < 2){ x += 1
    y = from
    $('#messages').append('<li style="text-align:'+align
  +'"><b style="color:' + color + ';"><h6 style="padding: 8px;">' + from  + ':</h6></b> <span style="border-radius: 25px; background:'+ background 
  +'; padding: 5px;">' + msg + '</span></li>')
  }else if(y === from){
    $('#messages').append('<li style="text-align:'+align
  +'"><span style="border-radius: 25px; background:'+ background 
  +'; padding: 5px;">' + msg + '</span></li>')
  }else{
    y = from;
    $('#messages').append('<li style="text-align:'+align
  +'"><b style="color:' + color + ';"><h6 style="padding: 8px;">' + from  + ':</h6></b> <span style="border-radius: 25px; background:'+ background 
  +'; padding: 5px;">' + msg + '</span></li>')
  }

  

  // if(from === 'Me'){}else{
    $('#title').text(from + ' sent a message!')
  // }

  window.scrollTo(0,document.body.scrollHeight);
})

// how to react to a notifyUser event.................
socket.on('notifyUser', function (user) {
  const me = $('#user').val()
  if (user !== me) {
    $('#notifyUser').text(user + ' is typing ...')
    $('#title').text(user + ' is typing ...')
  }
  // 3 seconds after typing stops, set the notify text to an empty string
  setTimeout(function () { $('#notifyUser').text('')}, 3000)
  setTimeout(function () { $('#title').text(titleMsg)}, 2000)
})



function naming(){
  let name = prompt("Please enter you name:", "John Doe");
  if(name === null || name === ""){
    return "NoName";
  }else{
    return name;
  }
}

function renaming(){
  let currentName = $('#user').val();
  let names = prompt("Please enter you name:", currentName);
  if(names === null || names === ""){
   //stays the same
  }else{
    $('#user').val(names);
    socket.emit('chatMessage', 'System', '<b>' + currentName + '</b> has changed their name to <b>'+names+"</b>");
  }
  $('#m').val('').focus()
}

function resetTitle(){
  $('#title').text(titleMsg);
}