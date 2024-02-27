class Chatbox {
    constructor() {
        // Select DOM elements
        this.openButton = document.querySelector('.chatbox__button button');
        this.chatBox = document.querySelector('.chatbox__support');
        this.sendButton = document.querySelector('.send__button');
        this.textField = this.chatBox.querySelector('input');
        this.fullScreen = document.querySelector('.full_screen_div');

        // Initialize state and messages array
        this.state = false;
        this.messages = [];

        // Initialize chatbox
        this.initialize();
    }

    initialize() {
        // Add event listeners for sending messages
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.textField.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Toggle chatbox when open button is clicked
        this.openButton.addEventListener('click', () => this.toggleChatbox());

        // Toggle full screen mode when full screen button is clicked
        this.fullScreen.addEventListener("click", () => this.fullScreenBox());

        // Log initial state and messages
        // console.log('Initial state:', this.state);
        // console.log('Initial messages:', this.messages);

        // Add event listener for DOMContentLoaded to show flash message
        document.addEventListener('DOMContentLoaded', () => {
            // console.log('DOM fully loaded');
            this.showFlashMessage();
        });

        // Call pinging function to check server status
        this.pinging();
    }

    fullScreenBox() {
        // Toggle full screen mode
        this.state = !this.state;
        this.chatBox.classList.toggle('fullview', this.state);
        // console.log('Full screen mode toggled:', this.state);
    }

    toggleChatbox() {
        // Toggle the chatbox state
        this.state = !this.state;
        // console.log('Chatbox state toggled:', this.state);
        this.chatBox.classList.toggle('chatbox--active', this.state);
    }

    sendMessage(val) {
        // Get the message from the text input field
        let message = this.textField.value.trim();

        if (val === 'menu') {
            // console.log("Sending initial menu message...");
            // Send initial menu message
            let FirstMsg = { name: "First", msg: "menu" };
            this.messages.push(FirstMsg);
            this.updateChatText(this.chatBox);
        } else if (val) {
            message = val;
        }

        // If the message is not empty, send it
        if (message) {
            // console.log('Sending message:', message);

            // Display user's message immediately
            let userMsg = { name: "User", msg: message };
            this.messages.push(userMsg);
            this.updateChatText(this.chatBox);

            // Check if the message is a menu option
            if (message === "menu") {
                // console.log("Menu option selected.");
                // Handle menu selection
                // For now, let's just send a message back
                let msg2 = { name: "Sam", msg: "menu" };
                this.messages.push(msg2);
                this.updateChatText(this.chatBox);
            } else {
                // Handle regular messages

                // Display typing indicator
                this.displayTypingIndicator();

                // Send message to server
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
                            this.sleeping();
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Process the response from the server
                        let msg2 = { name: "Sam", msg: data.answer };
                        this.removeTypingIndicator();
                        this.messages.push(msg2);
                        this.updateChatText(this.chatBox);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        this.removeTypingIndicator();
                        this.sleeping();
                    });
            }
        }
        // Clear the input field after sending the message
        this.textField.value = '';
    }

    displayTypingIndicator() {
        // Display typing indicator
        // console.log('Displaying typing indicator...');
        let typingIndicatorMsg = { name: "Sam", msg: ". . ." };
        this.messages.push(typingIndicatorMsg);
        this.updateChatText(this.chatBox);
    }

    removeTypingIndicator() {
        // Remove typing indicator
        // console.log('Removing typing indicator...');
        this.messages = this.messages.filter(msg => msg.msg !== ". . .");
        this.updateChatText(this.chatBox);
    }

    updateChatText(chatbox) {
        // Update chat messages
        // console.log('Updating chat text...');
        var html = '';
        // Iterate through messages and generate HTML
        this.messages.slice().reverse().forEach(function (item, index) {
            if (item.name === 'First' || item.name === "Sam") {
                if (item.msg === 'menu') {
                    html += `<div class=" messages__item messages__item--visitor menuoptions__containers">
                    <div class="first__message">Welcome, I am Edibot<br>How can I help you?</div>
                    <div class="menu">
                        <div class="onerow"> 
                            <button class="custom-btn btn-5"><span>Spec Builder</span></button>
                            <button class="custom-btn btn-6"><span>XEServer</span></button>
                            <button class="custom-btn btn-5"><span>TPM</span></button>
                        </div>
                        <div class="onerow"> 
                            <button class="custom-btn btn-5"><span>Map Builder</span></button>
                            <button class="custom-btn btn-6"><span>EAM</span></button>
                            <button class="custom-btn btn-5"><span>Risk Adjustment</span></button>
                        </div>
                        <div class="onerow"> 
                            <button class="custom-btn btn-5"><span>Xengine</span></button>
                            <button class="custom-btn btn-6"><span>TM</span></button>
                            <button class="custom-btn btn-5"><span>Prior Authorization</span></button>
                        </div>
                    </div>
                    <div class="first__message">You can always come back to this menu. Type menu </div>
                </div>`;
                } else if (item.msg === '. . .') {
                    // console.log("Typing indicator detected");
                    html += '<div class="messages__item--typing messages__item--visitor"><div class="typing-indicator"></div></div>';
                } else {
                    // console.log("Normal message detected");
                    html += '<div class="messages__item messages__item--visitor">' + item.msg + '</div>';
                }
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.msg + '</div>';
            }
        });
        // Update chatbox HTML
        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }

    showFlashMessage() {
        // Show flash message
        // console.log('Showing flash message...');
        const messageBox = document.querySelector('.message-box');
        if (messageBox) {
            messageBox.classList.add('messages-box-animation');
            messageBox.style.opacity = '1';
            messageBox.style.zIndex = '-1';
            setTimeout(() => {
                messageBox.classList.remove('messages-box-animation');
                messageBox.style.opacity = '0';
                // console.log('Flash message animation completed.');
            }, 40000); // 2000 milliseconds = 2 seconds
        } else {
            console.error('Message box element not found.');
        }
    }

    whichButton(event) {
        // Check which button is clicked
        // console.log('Button clicked event:', event);
        const buttonText = event.target.textContent.trim();
        if (buttonText === 'Spec Builder') {
            this.sendMessage(buttonText);
        } else if (buttonText === 'TPM') {
            this.sendMessage(buttonText);
        } else if (buttonText === 'Map Builder') {
            this.sendMessage(buttonText);
        } else if (buttonText === 'TM') {
            this.sendMessage(buttonText);
        } else if (buttonText === 'EAM') {
            this.sendMessage(buttonText);
        } else if (buttonText === 'Xengine') {
            this.sendMessage(buttonText);
        } else if (buttonText === 'XEServer') {
            this.sendMessage(buttonText);
        } else if (buttonText === 'Risk Adjustment') {
            this.sendMessage(buttonText);
        } else if (buttonText === 'Prior Authorization') {
            this.sendMessage(buttonText);
        }
    }
    
    sleeping() {
        // Display sleeping message and disable input
        var htmlText = `
            <h4 class="chatbox__heading--header">Chat support closed</h4>
            <p class="chatbox__description--header">Edibot Down.. zz..zz</p>
        `;

        var chatboxImageHeader = document.querySelector(".chatbox__image--header");
        var chatboxContentHeader = document.querySelector(".chatbox__content--header");

        chatboxImageHeader.innerHTML = `<img class="logo_robo" src="${SleepingRobo}" alt="image">`;
        chatboxContentHeader.innerHTML = htmlText;

        this.chatBox.style.background = `white url('${SleepingGif}') no-repeat center center`;
        this.textField.placeholder = "Server down. Please refresh or try again later";
        this.sendButton.textContent = "";
        this.textField.disabled = true;
        this.sendButton.disabled = true;
        
        // Call awake after some delay
        setTimeout(() => this.pinging(), 3000);
    }
    
    pinging() {
        // Ping the server to check status
        fetch('/get', {
            method: 'POST',
            mode: "cors",
            body: JSON.stringify({ msg: "hey" }),
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
            // If server is reachable, call awake
            setTimeout(() => this.awake(), 10000);
        })
        .catch(error => {
            console.error('Error:', error);
            // If server is unreachable, call sleeping
            this.sleeping();
        });
    }
    
    awake() {
        // Display awake message and enable input
        var html__Image = `<img class="logo_robo" src="${Edibot}" alt="image">`;
        var html__Text = `<h4 class="chatbox__heading--header">Chat support</h4>
            <p class="chatbox__description--header">Edibot Ready..</p>`;
        var EdibotIcon = document.querySelector(".chatbox__image--header");
        var EdibotText = document.querySelector(".chatbox__content--header");
        
        EdibotIcon.innerHTML=html__Image;
        EdibotText.innerHTML = html__Text;

        this.textField.placeholder = "Write your question here";
        this.sendButton.textContent = "Send";
        this.textField.disabled = false;
        this.sendButton.disabled = false;
        this.chatBox.style.background = "#eee";
        this.sendMessage("menu");
    }
}

// Initialize Chatbox
const chatbox = new Chatbox();
