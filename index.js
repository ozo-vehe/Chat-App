let inputBox = document.querySelector('#message'),
    chatPage = document.querySelector('.container'),
    send = document.querySelector('.send-msg'),
    chatMessages = document.querySelector('.chat-messages'),
    chatInputBox = document.querySelector('.chat-input-box'),
    activeChat = document.querySelector('.active-chat'),
    msgReciever = document.querySelector('.reciever'),
    loginBtn = document.querySelectorAll('.user-selection button'),
    userName = document.querySelector('.user-name'),
    userSelectionPage = document.querySelector('.user-selection'),
    spinner = document.querySelector('.spinner-container'),
    chatConversations = document.querySelector('.chat-conversations'),
    messagesArray = [],
    usersLoggedIn = [],
    currentUser = '';


var firebaseConfig = {
    apiKey: "AIzaSyDWVyb8fiUrjeX2hrGFUkpoHCBEQirZs2w",
    authDomain: "chat-app-9c4f6.firebaseapp.com",
    projectId: "chat-app-9c4f6",
    storageBucket: "chat-app-9c4f6.appspot.com",
    messagingSenderId: "388809518058",
    appId: "1:388809518058:web:fafdd987d401e17eaa6093",
    measurementId: "G-KSXC2KV18G"
};

firebase.initializeApp(firebaseConfig);  
let messageStore = firebase.firestore();


//      Functions Created

function addChatParticipant(participant) {
    let chatParticipant = document.createElement("div");
    let chatParticipantIcon = document.createElement("ion-icon");
    let chatParticipantName = document.createElement("p");

    chatParticipant.classList.add("chat-participants");
    chatParticipantIcon.setAttribute("name", "person-circle");
    chatParticipantName.classList.add("user-name");

    chatParticipantName.textContent = participant;

    chatParticipant.append(chatParticipantIcon);
    chatParticipant.append(chatParticipantName);


    chatConversations.append(chatParticipant);


    chatParticipants = document.querySelectorAll('.chat-participants'),
    chatParticipants.forEach((participant) => {
        participant.addEventListener("click", function() {
            chatMessages.classList.remove("hide");
            activeChat.classList.remove("hide");
            chatInputBox.classList.remove("hide");
            this.classList.add("current-chat");
            msgReciever.textContent = this.innerText;
        
            newMessages(this.innerText);
        })
    })

}


function addActive(outgoingMsg) {
    outgoingMsg.classList.add("active");
}

function newMessages(user) {
    messageStore.collection("Users").doc(user).onSnapshot((doc) => {
        let outgoingMsg = document.createElement('p')
        outgoingMsg.classList.add("user-two-msg");

        if(doc.data().message) {
            outgoingMsg.append(doc.data().message);
            chatMessages.append(outgoingMsg);
        }

        setTimeout(addActive(outgoingMsg), 2000) 
        
    })
}

function deleteMsgStore(user) {
    messageStore.collection("Users").doc(user).delete()
}


send.addEventListener("click", function() {
    let message = inputBox.value;

    if(message) {
        let outgoingMsg = document.createElement('p')
    
        outgoingMsg.classList.add('user-one-msg');
        outgoingMsg.append(message);
        chatMessages.append(outgoingMsg);
        inputBox.value = ""
    
        messageStore.collection("Users").doc(userName.textContent).set({
            message: message
        }).then(() => {
            setTimeout(addActive(outgoingMsg), 2000)
        })   
    }
})

loginBtn.forEach((btn) => {
    btn.addEventListener("click", function() {
        currentUser = this.textContent;

        userSelectionPage.classList.add('hide');
        chatPage.classList.remove('hide');

        userName.textContent = currentUser;

        messageStore.collection("Users").doc(userName.textContent).set({
            message: null
        }).then(() => {
            if(userName.textContent == "User 1") {
                addChatParticipant("User 2")
            }
            else if(userName.textContent == "User 2") {
                addChatParticipant("User 1")
            }
            setTimeout(function() {
                spinner.classList.add("hide")
            }, 2000)
        }).catch((e) => {
            console.log(e)
        })
    })
})        

window.addEventListener("load", function() {
    deleteMsgStore(userName.textContent)
})
