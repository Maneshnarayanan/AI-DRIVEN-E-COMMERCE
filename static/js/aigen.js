
  "use strict";
  const fadeIn_fadeOut_transition_speed = 300;
  const messages = [];
  let popupDialog = document.querySelector(".popup-dialog")

  // onload function will run when page is rendered
  window.onload = function () {
    // ChatBot dialog popup function
    setTimeout(() => {
      // ChatBot dialog will only popup if user haven't used the chatBot.
      if (messages.length === 0) {
        popupDialog.classList.remove("hidden");
        popupDialog.style.opacity = 0;
        setTimeout(()=>{
          popupDialog.style.opacity = 1;
        }, fadeIn_fadeOut_transition_speed)
      }
    }, 5000);
  }

  // updates the chats
  function updateChatText() {
    let html = "";
    let botHtmlTag = '<div class = "bot-message-block floatup-msg"><img class = "bot-profile" src="{% static "chatbot_project/images/bot.png" %}"><p class= bot_message>';
    let userHtmlTag = '<div class = "user-message-block floatup-msg"><img class = "user-profile" src="{% static "chatbot_project/images/user.png" %}"><p class= user_message>';
    messages.slice().reverse().forEach(function (item, index) {
      if (item.name === "Bot") {
        if (item.message.includes("https://") == true){
          html += `<div class = "bot-message-block floatup-msg"><img class = "bot-profile" src="{% static "chatbot_project/images/bot.png" %}"><a class= bot_message href="${item.message}">${item.message}</a></div>`
        }
        else{
          html += botHtmlTag + item.message + '</p></div>'
        }
      } else {
        html += userHtmlTag + item.message + '</p></div>'
      }
    });
    const chatMessage = document.querySelector(".body");
    chatMessage.innerHTML = html;
  }

  // To give chat like feel
  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function showBotFun() {
    // Initialize Variables
    const chatBotWindow = document.getElementById("botWindow");

    //Main Logic to show chatBot
    chatBotWindow.style.opacity = 0;
    chatBotWindow.style.transform = `translateY(10%)`;
    document.querySelector(".container").classList.remove("hidden");

    //Pausing the flow of the code for 0.3 secs
    setTimeout(() => {
      chatBotWindow.style.transform = `translateY(0%)`;
      chatBotWindow.style.opacity = 1;
    }, fadeIn_fadeOut_transition_speed);

    //Main Logic to hide Chat button
    const showBot = document.getElementById("showBotbtn");
    showBot.style.opacity = 0;
    popupDialog.style.opacity = 0;

    //Pausing the flow of the code for 0.3 secs
    setTimeout(() => {
      document.querySelector(".showBot").classList.add("hidden");
      popupDialog.classList.add("hidden");
    }, fadeIn_fadeOut_transition_speed);

    if (messages.length === 0) {
      let msg2 = { name: "Bot", message: "Hello! How can I help you? <br> Type 'help' to get help" };
      messages.push(msg2);
      updateChatText();
      scrollToBottom();
    }
  }

  function hideBotFun() {
    // Initialize Variables
    const showBot = document.getElementById("showBotbtn");

    //Main Logic to show Chat button
    showBot.style.opacity = 0;

    //Pausing the flow of the code for 0.3 secs
    document.querySelector(".showBot").classList.remove("hidden");
    setTimeout(() => {
      showBot.style.opacity = 1;
    }, fadeIn_fadeOut_transition_speed);

    //Main Logic to hide chat bot
    const chatBotWindow = document.getElementById("botWindow");
    chatBotWindow.style.transform = `translateY(11%)`;
    chatBotWindow.style.opacity = 0;

    //Pausing the flow of the code for 0.3 secs
    setTimeout(() => {
      document.querySelector(".container").classList.add("hidden");
    }, fadeIn_fadeOut_transition_speed);


  }

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  const csrftoken = getCookie('csrftoken');

  // Disable the send button if there is no text in query field

  const regex = /[A-Za-z0-9]/
  let submit_btn = document.querySelector(".submit_btn");
  function checkText() {
    const inp_string = document.querySelector("#query").value
    if (regex.test(inp_string) === false) {
      submit_btn.disabled = true
    } else {
      submit_btn.disabled = false
    }
  }

  // Here is the main code which Posts and gets responses
  const form1 = document.getElementById("myForm");
  const botTyping = document.querySelector(".botTyping")
  const txtUserInp = document.querySelector("#query");
  form1.addEventListener("submit", function (e) {
    e.preventDefault();
    if (txtUserInp.value == "") {
      return
    }
    let msg1 = { name: "user1", message: txtUserInp.value }
    messages.push(msg1);
    updateChatText();
    submit_btn.disabled = true;
    botTyping.classList.remove("hidden");
    
    // converting use input to lowerCase
    let lowerCaseInput = $('#query').val().toLowerCase();
    
    // Create the data object with the lowercase input
    let requestData = { query: lowerCaseInput };

    $.ajax({
      method: "GET",
      url: "{%url 'chatbot_project:chatBot'%}",
      headers: {
        "Content-type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": csrftoken,
      },
      data: requestData
    })
      // This steps should be done if the input is successfully submitted to the bot and get response
      .done(function (response) {
        const botRes = JSON.stringify(response);
        const obj = JSON.parse(botRes);
        let msg2 = { name: "Bot", message: obj.Bot };
        messages.push(msg2);
        updateChatText();
        scrollToBottom();
        submit_btn.disabled = false;
        botTyping.classList.add("hidden");
        txtUserInp.value = "";
      })
      // if any errors they will be thrown into the console
      .fail(function (response) {
        let msg2 = { name: "Bot", messages: "Internal server error, Please reload the page." }
        messages.push(msg2);
        updateChatText();
        scrollToBottom();
        submit_btn.disabled = false;
        botTyping.classList.add("hidden");
        txtUserInp.value = "";
      })
  })