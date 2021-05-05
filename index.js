let inputBox = document.querySelector('#message'),
    chatPage = document.querySelector('.container'),
    send = document.querySelector('.send-msg'),
    chatMessages = document.querySelector('.chat-messages'),
    userButton = document.querySelectorAll('.user-selection button'),
    userName = document.querySelector('.user-name');
    userSelectionPage = document.querySelector('.user-selection'),
    messagesArray = [],
    userSelected = '';

    userButton.forEach((button) => {
        button.addEventListener('click', function() {
            userSelected = this.textContent;
            userSelectionPage.classList.add('hide');
            chatPage.classList.remove('hide');

            userName.textContent = userSelected;
        })
    })

var firebaseConfig = {
    apiKey: "AIzaSyDWVyb8fiUrjeX2hrGFUkpoHCBEQirZs2w",
    authDomain: "chat-app-9c4f6.firebaseapp.com",
    projectId: "chat-app-9c4f6",
    storageBucket: "chat-app-9c4f6.appspot.com",
    messagingSenderId: "388809518058",
    appId: "1:388809518058:web:fafdd987d401e17eaa6093",
    measurementId: "G-KSXC2KV18G"
};
        // Initialize Firebase
firebase.initializeApp(firebaseConfig);
  
let db = firebase.firestore();

send.addEventListener('click', function() {
    let message = document.querySelector('#message').value;
    if(inputBox.value == '') {
        console.log('Enter a valied message');
    }
    else if(inputBox.value !== '') {
        var dateTime = new Date(),
            minute = dateTime.getMinutes(),
            seconds = dateTime.getSeconds(),
            hour = dateTime.getHours(),
            fullDate = `${hour}:${minute}:${seconds}`;
        if(userSelected == 'User One') {
            let outgoingMsg = document.createElement('p')
            outgoingMsg.classList.add('user-one-msg');

            db.collection("User One").doc(fullDate).set({
                message: message
            }, { merge: true })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });

            db.collection("User One").doc(fullDate).get().then((doc) => {
                outgoingMsg.append(doc.data().message);
                console.log(doc.data().message);
                chatMessages.append(outgoingMsg);
                inputBox.value = '';
            });

            db.collection("User Two")
                .onSnapshot((doc) => {
                    doc.forEach((d) => {
                        console.log(d.data().message);
                    })
                    let outgoingMsg = document.createElement('p')
                    outgoingMsg.classList.add('user-two-msg');
        
                    outgoingMsg.append(doc.data().message)
                    chatMessages.append(outgoingMsg);
                    inputBox.value = '';
                });
        }
        else if(userSelected == 'User Two') {
            let outgoingMsg = document.createElement('p')
            outgoingMsg.classList.add('user-two-msg');

            db.collection("User Two").doc(fullDate).set({
                message: message
            }, { merge: true })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });

            db.collection("User Two").doc(fullDate).get().then((doc) => {
                outgoingMsg.append(doc.data().message);
                console.log(doc.data().message);
                chatMessages.append(outgoingMsg);
                inputBox.value = '';
            });

            db.collection("User One")
                .onSnapshot((doc) => {
                    doc.forEach((d) => {
                        if(d.data().message) {
                            messagesArray.push(d.data().message)
                            let outgoingMsg = document.createElement('p')
                            outgoingMsg.classList.add('user-one-msg');
        
                            outgoingMsg.append(messagesArray.shift())
                            chatMessages.append(outgoingMsg);
                            inputBox.value = '';
                        }
                        else {
                            console.log('empty');
                        }
                    })
                });
        }

    }
})