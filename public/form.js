let messages = [];
// Load messages from the local storage
function loadMessages() {
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
        messages = JSON.parse(storedMessages);
        updateMessages();
    }
}

// Save messages to the local storage
function saveMessages() {
    localStorage.setItem('messages', JSON.stringify(messages));
}

// Event listener to submit the form
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const responseCard = document.getElementById('response-card');

    responseCard.innerHTML = `
        <div class="card spinner-card">
            <div class="card-body">
                <h5 class="card-title">Saving...</h5>
                <div class="spinner-border text-light" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
    fetch('form.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);

        if (result.success) {
            messages.push(result.data);
            //Call saveMessages function to save the data to local storage
            saveMessages();
            responseCard.innerHTML = `
            <div class="card text-white bg-message mb-3">
                <div class="card-body d-flex flex-column">
                    <p class="card-text"><strong>${result.data.message}</strong></p>
                    <div class="d-flex justify-content-between align-items-end mt-auto">
                        <div>
                            <p class="card-info small text-muted mb-0"><strong>Name:</strong> ${result.data.name}</p>
                            <p class="card-info small text-muted mb-0"><strong>Email:</strong> ${result.data.email}</p>
                        </div>
                    <button class="button btn-view btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#messagesModal">View All</button>
                    </div>
                </div>
            </div>
            `;
            //Updates after a new data is pushed
            updateMessages();
            document.getElementById('contact-form').reset();
        } else {
            responseCard.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Error: ${result.error}
                </div>
            `;
        }
    })
    .catch(() => {
        console.error('Error:', error);
        responseCard.innerHTML = `
            <div class="alert alert-danger" role="alert">
                An error occurred while submitting the form.
            </div>
        `;
    });

    }, 500);
    
});

//Resets the entries in the form
document.getElementById('btn-reset').addEventListener('click', function () {
    document.getElementById('contact-form').reset();
});

//Updates the messages list
function updateMessages() {
    const messagesList = document.getElementById('messages-list');
    messagesList.innerHTML = '';

    messages.forEach((message, index) => {
        const listItem = document.createElement('li');

        listItem.className = 'list-group-item mb-2';
        listItem.innerHTML = `
            <div class="message-content">
                <div class="message-text">
                    <p>${message.message}</p>
                </div>
                <div class="message-info d-flex justify-content-between align-items-end mt-auto">
                    <div>
                        <p class="mb-0"><strong>Name:</strong> ${message.name}</p>
                        <p class="mb-0"><strong>Email:</strong> ${message.email}</p>
                    </div>
                    <button class="btn btn-sm btn-delete float-end" data-index="${index}">Delete</button>
                </div>
            </div>
        `;
        messagesList.appendChild(listItem);
    });

    //Delete button function
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            if (confirm('Do you want to delete this message?')) {
                messages.splice(index, 1);
                saveMessages();//for local storage
                updateMessages();//For the messages list
            }
        })
    })
}

//Loads if there is any data in the local storage
loadMessages();