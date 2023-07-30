(function(){
    const app = document.querySelector(".app");
    const socket = io();
    
    let uname;

    app.querySelector(".join_screen #join_user").addEventListener("click", function(){
        let username = app.querySelector(".join_screen #username").value;
        if(username.length == 0){
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join_screen").classList.remove("active");
        app.querySelector(".chat_screen").classList.add("active");
    });

    app.querySelector(".chat_screen #send_message").addEventListener("click", function(){
        let message = app.querySelector(".chat_screen #message_input").value;
        if(message.length == 0){
            return;
        }
        renderMessage("my",{
            username:uname,
            text:message
        });
        socket.emit("chat",{
            username:uname,
            text:message
        });
        app.querySelector(".chat_screen #message_input").value = "";
    });

    app.querySelector(".chat_screen #exit_chat").addEventListener("click", function(){
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    })

    socket.on("update", function(update){
        renderMessage("update", update);
    });
    
    socket.on("chat", function(message){
        renderMessage("other", message);
    });

    function renderMessage(type, message){
        let messageContainer = app.querySelector(".chat_screen .messages");
        if(type == "my"){
            let e = document.createElement("div");
            e.setAttribute("class", "message my_message");
            e.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(e);
        }else if(type == "other"){
            let e = document.createElement("div");
            e.setAttribute("class", "message other_message");
            e.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(e);
        }else if(type == "update"){
            let e = document.createElement("div");
            e.setAttribute("class", "update");
            e.innerText = message;
            messageContainer.appendChild(e);
        }
        // scroll chat to end
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

})();