class Chatbox {
    constructor() {
        // Select DOM elements
        this.openButton = document.querySelector('.chatbox__button button');
        this.chatBox = document.querySelector('.chatbox__support');
        this.sendButton = document.querySelector('.send__button');
        this.textField = this.chatBox.querySelector('input');

        // Initialize state and messages array
        this.state = false;
        this.messages = [];

        // Initialize chatbox
        this.initialize();
    }

    initialize() {
        // Add event listeners
        console.log('Adding event listeners...');
        this.openButton.addEventListener('click', () => this.toggleChatbox());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.textField.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                console.log('Enter key pressed, sending message...');
                this.sendMessage();
            }
        });

        // Debugging: Log the initial state
        console.log('Initial state:', this.state);
        console.log('Initial messages:', this.messages);

        // Debugging: Log a message when the DOM is fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM fully loaded');
            // Show flash message when the page is fully loaded
            this.showFlashMessage();
        });
    }

    toggleChatbox() {
        // Toggle the chatbox state
        this.state = !this.state;

        // Debugging: Log the new state
        console.log('New state:', this.state);

        // Toggle the 'chatbox--active' class based on the state
        this.chatBox.classList.toggle('chatbox--active', this.state);
    }

    sendMessage() {
        // Get the message from the text input field
        const message = this.textField.value.trim();
        console.log('Sending message:', message);
        
                // console.log('Message from User:', msg1);
                // this.userchat(this.chatBox)
        // If the message is not empty, send it to the server
        if (message) {
            // Fetch the response from the Flask server
            console.log('Sending message to server...');
            fetch('/get', {
                method: 'POST',
                mode: "cors",
                body: JSON.stringify({ msg: message }),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Process the response from the server
                let msg1 = { name: "User", msg: message };
                let msg2 = { name: "Sam", msg: data.answer };
    
                // Update chat messages with user's message first, then Sam's response
                
                this.messages.push(msg1);
                this.messages.push(msg2);
                console.log('Message from Sam:', msg2);
    
                // Update the chat text
                this.updateChatText(this.chatBox);
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
                this.updateChatText(this.chatBox);
            });
    
            // Clear the input field after sending the message
            this.textField.value = '';
        }
    }
    
    showFlashMessage() {
        const messageBox = document.querySelector('.message-box');
        if (messageBox) {
            // Add the animation class to the message box
            messageBox.classList.add('messages-box-animation');
    
            // Set opacity to 1 to make the message box visible
            messageBox.style.opacity = '1';
            messageBox.style.zIndex='-1';
    
            // After 2 seconds, remove the animation class and hide the message box
            setTimeout(() => {
                messageBox.classList.remove('messages-box-animation');
                messageBox.style.opacity = '0';
                console.log('Flash message animation completed.');
            }, 2000); // 2000 milliseconds = 2 seconds
        } else {
            console.error('Message box element not found.');
        }
    }
    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.msg + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.msg + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }


    // userchat(chatBox)
    // {
    //     var html = '';
    //     this.messages.slice().reverse().forEach(item => {
    //         if (item.name === "User") {
    //             html += '<div class="messages__item messages__item--operator">' + item.msg + '</div>';
    //         } 
    //     });
    //     const chatMessages = chatBox.querySelector('.chatbox-user__messages');
    //     chatMessages.innerHTML = html;
    //     console.log('Chat user text updated.');

    // }

    // updateChatText(chatBox) {
    //     var html = '';
    //     this.messages.slice().reverse().forEach(item => {
    //         // if (item.name === "User") {
    //         //     html += '<div class="messages__item messages__item--operator">' + item.msg + '</div>';
    //         // } else 
    //         if (item.name === "Sam") {
    //             html += '<div class="messages__item messages__item--visitor">' + item.msg + '</div>';
    //         }
    //     });
    //     const chatMessages = chatBox.querySelector('.chatbox__messages');
    //     chatMessages.innerHTML = html;
    //     console.log('Chat text updated.');
    // }
}    

// Initialize Chatbox
const chatbox = new Chatbox();
