
document.addEventListener("DOMContentLoaded", function () {
    // Fetch data from the API

    const fetchData = () => {

        fetch("https://my-json-server.typicode.com/codebuds-fk/chat/chats")
            .then((response) => response.json())
            .then((data) => {
                // console.log("fdf",data)
                console.log(data);




                // Process data and render the Chat List
                renderChatList(data);
                // renderData(data);
                return data;
            })
            .catch((error) => console.error("Error fetching data:", error));
    }

    fetchData();



});

function renderChatList(data) {
    // Get the container element where you want to render the chat list
    const chatListContainer = document.getElementById("chatListContainer");

    // Use the map function to create HTML for each chat
    const chatListHTML = data
        .map(
            (chat) => `

            <div class=" mainCommon">

            <div   class=" ${chat.id} leftHalf-${chat.id} chat   border-2 border-black-100 flex justify-between items-center   min-h-[100px] " data-chat-title="${chat.title}" onclick="splitDiv('leftHalf-${chat.id}','rightHalf-${chat.id}')">
                <div class="flex gap-x-8 items-center ml-3"> 
                    <img src="${chat.imageURL}" alt="${chat.title}" class="max-h-[55px] max-w-[55px] text-xl font-semibold" />
                    <div class="chat-details ml-4 absolute left-[75px]">
                        <h2>${chat.title}</h2>
                        <p>Order ID: ${chat.orderId}</p>
                        <p class="text-sm">Hi, what can I help you with?</p>
                    </div>
                    </div>
                    <div class="mr-6">
                        <p>${new Date(chat.latestMessageTimestamp).toLocaleDateString()}</p>
                    </div>
                
            </div>
           
            
        </div>
        
        
            
        `
        )
        .join("");

    // Update the container with the generated HTML
    chatListContainer.innerHTML = chatListHTML;


}


async function splitDiv(left, right) {

    const searchbar = document.querySelector('.searchbar');

    searchbar.classList.toggle('w-[50%]')

    const rpartElements = document.querySelector('.rpart');
    console.log(rpartElements);

    rpartElements.classList.remove('hidden');

    const leftHalfElements = document.getElementsByClassName(left);
    const rightHalfElements = document.getElementsByClassName(right);
    const mainCommon = document.getElementsByClassName('mainDiv')
    const tempRight = document.getElementsByClassName('common2')
    const toInsert = document.getElementsByClassName('toInsert')

    console.log(leftHalfElements);


    for (let i = 0; i < leftHalfElements.length; i++) {
        const leftHalf = leftHalfElements[i];
        const match = leftHalf.className.match(/\bleftHalf-(\d+)\b/);

        if (match) {
            const id = match[1];
            console.log(`Extracted ID: ${id}`);


            try {
                // Fetch data using the extracted ID
                const data = await fetchDataById(id);

            } catch (error) {
                console.log(error);

            }
        }
    }
    const titleElements = document.getElementsByClassName('titleClass2');

    // Iterate over the title elements
    for (let i = 0; i < titleElements.length; i++) {
        const titleElement = titleElements[i];

        // Access the data-chat-title attribute
        const chatTitle = leftHalfElements[i].getAttribute('data-chat-title');

        // Log or use the chatTitle as needed


        // Insert the chatTitle into the title element

        titleElement.textContent = chatTitle;

    }





    // Convert HTMLCollection to Array for easier manipulation
    const rightHalfArray = Array.from(rightHalfElements);
    const tempArray = Array.from(mainCommon);

    tempArray.forEach(leftHalf => {
        if (leftHalf.style.width === '100%' || leftHalf.style.width === '') {
            leftHalf.style.width = '50%';
            execute(left);
            rightHalfArray.forEach(rightHalf => {
                rightHalf.style.width = '50%';
            });

            // Show elements with class 'rpart'
            for (let i = 0; i < rpartElements.length; i++) {
                rpartElements[i].style.display = 'block';
            }
        } else {
            leftHalf.style.width = '50%';
            rightHalfArray.forEach(rightHalf => {
                rightHalf.style.width = '50%';
            });

            searchbar.classList.toggle('w-[50%]')
            // Hide elements with class 'rpart'
            for (let i = 0; i < rpartElements.length; i++) {
                rpartElements[i].style.display = 'block';
            }
        }
    });

}


function fetchDataById(id) {
    fetch(`https://my-json-server.typicode.com/codebuds-fk/chat/chats/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(`Data for ID ${id}:`, data);
            renderData(data)
            // Process the data as needed
        })
        .catch(error => console.error(`Error fetching data for ID ${id}:`, error));
}

function renderData(data) {
    // Your rendering logic here
    console.log("Render data:", data);

    // Access title, imageURL, and messageList properties from data
    const title = data.title;
    const imageURL = data.imageURL;
    const messageList = data.messageList;

    // Log title and imageURL
    console.log("Title:", title);
    console.log("Image URL:", imageURL);

    // Access the elements with the specified classes
    const photoContainer = document.querySelector('.photo');
    const titleClass2 = document.querySelector('.titleClass2');
    const messagesContainer = document.querySelector('.messages-container');

    // Update the content of the elements
    if (photoContainer) {
        // Create a new img element
        const imgElement = document.createElement('img');
        imgElement.src = imageURL;

        // Clear any existing content and append the img element
        photoContainer.innerHTML = '';
        photoContainer.appendChild(imgElement);
    }

    if (titleClass2) {
        // Update the content of the titleClass2 element
        titleClass2.textContent = title;
    }

    if (messagesContainer) {
        // Clear any existing content in the messages container
        messagesContainer.innerHTML = '';

        // Append messages to the messages container
        messageList.forEach(message => {
            // Create a new div element for each message
            const messageElement = document.createElement('div');

            // Add a class based on the sender type
            messageElement.classList.add(message.sender.toLowerCase());

            // Set the text content of the message element
            messageElement.textContent = message.message;

            // Set text color based on sender type
            messageElement.style.color = message.sender.toLowerCase() === 'bot' ? ' ' : ' ';

            // Append the message element to the messages container
            messagesContainer.appendChild(messageElement);

         

            // Render options if the message type is "optionedMessage"
            if (message.messageType === "optionedMessage") {
                renderOptions(messageElement, message.options);
            }


            
        });
    }
}
function renderOptions(container, options) {
    // Create a new div element for options
    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');

    // Append options to the options container
    options.forEach(option => {
        // Create a new div element for each option
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');

        // Set text color to green for options
        optionElement.style.color = ' ';

        // Create a new div element for option text
        const optionTextElement = document.createElement('div');
        optionTextElement.textContent = option.optionText;

        // Create a new div element for option subtext
        const optionSubTextElement = document.createElement('div');
        optionSubTextElement.textContent = option.optionSubText;

        // Append the option text and subtext elements to the option element
        optionElement.appendChild(optionTextElement);
        optionElement.appendChild(optionSubTextElement);

        // Append the option element to the options container
        optionsContainer.appendChild(optionElement);
    });

    // Append the options container below the message container
    container.appendChild(optionsContainer);
}





const searchResult = () => {
    const searchQuery = document.getElementById("query").value.toLowerCase();
    console.log(searchQuery);

    // If the search query is empty, use the original data
    if (searchQuery === "") {
        fetchData();
    } else {
        // Fetch data and filter based on the search query
        fetch("https://my-json-server.typicode.com/codebuds-fk/chat/chats")
            .then((response) => response.json())
            .then((data) => {
                const filteredData = data.filter(chat => {
                    // Adjust the condition based on your search requirements
                    return chat.title.toLowerCase().includes(searchQuery);
                });

                // Render the filtered data
                renderChatList(filteredData);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }
};