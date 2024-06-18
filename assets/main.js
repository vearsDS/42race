async function getAuth() {
    try {
        const response = await fetch('/api/account/inituser');
        const data = await response.json();
        if (data.data?.logedin) {
            document.getElementById('CTAButton').addEventListener('click', async () => {
                await fetch('/api/account/disconnect', {
                    method: "POST",
                    credentials: 'include'
                });
                window.location.href = '/'

            })
            document.getElementById('CTAButton').innerHTML = 'Disconnect';
            return true
        } else {
            document.getElementById('CTAButton').addEventListener('click', async () => {
                // await fetch('/api/account/connect')
                window.location.href = "/api/account/connect"
            })
            document.getElementById('CTAButton').innerHTML = 'Connect';
            return false;
        }

    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('content').innerText = 'Error fetching data';
    }
}

async function getUserAccount() {
    try {
        const response = await fetch('/api/account/getUserAccount');
        if (!response.ok) {
            throw new Error('Network getUserAccount was not ok');
        };
        const data = await response.json();

        if (data.data) {
            document.getElementById('CTALink').innerHTML = `${data.data}`
        } else {
            document.getElementById('CTALink').innerHTML = `${data.message}`
        }

    } catch (err) {
        console.error('Fetch Account:', err);
        document.getElementById('CTALink').innerText = '';
    }
};
async function getListAccounts() {
    try {
        const response = await fetch('/api/account/getListAccounts');
        if (!response.ok) {
            throw new Error('Network getUserListAccounts was not ok');
        };
        const data = await response.json();
        const currentDiv = document.getElementById("list-accounts");
        if (data.data) {
            data.data.map(user => {
                const newDiv = document.createElement("div");
                newDiv.className = 'list-account'
                const newLabelUsername = document.createElement("label");
                const newlabelTextUsername = document.createTextNode(`${user.username}`);
                const newLabelState = document.createElement("label");
                newLabelState.className = user.logedin ? 'text-green' : 'text-white'
                const newlabelTextState = document.createTextNode(`${user.logedin ? 'Online' : 'Offline'}`);
                newLabelState.appendChild(newlabelTextState)
                newLabelUsername.appendChild(newlabelTextUsername);
                newDiv.appendChild(newLabelUsername);
                newDiv.appendChild(newLabelState);
                currentDiv.appendChild(newDiv)
            })
        }
    } catch (err) {
        console.error('Fetch Account:', err);
        document.getElementById('CTALink').innerText = '';
    }
};

async function getListActivities() {
    try {
        const response = await fetch('/api/activity/getActivities');
        if (!response.ok) {
            throw new Error('Network getListActivities was not ok');
        };
        const data = await response.json();
        const currentDiv = document.getElementById("activity-container");
        if (data.data) {
            data.data.map(activity => {
                const newDiv = document.createElement("div");
                newDiv.className = 'activity-list'
                const newLabelId = document.createElement("label");
                const newlabelTextId = document.createTextNode(`${activity._id}`);
                const newLabelUser = document.createElement("label");
                const newlabelTextUser = document.createTextNode(`${activity.athlete.username}`);
                const newLabelType = document.createElement("label");
                const newlabelTextType = document.createTextNode(`${activity.type}`);
                const newLabelCreatedAt = document.createElement("label");
                const newlabelTextCreatedAt = document.createTextNode(`${activity.start_date_local}`);
                newLabelId.appendChild(newlabelTextId)
                newLabelUser.appendChild(newlabelTextUser);
                newLabelType.appendChild(newlabelTextType)
                newLabelCreatedAt.appendChild(newlabelTextCreatedAt);
                newDiv.appendChild(newLabelId);
                newDiv.appendChild(newLabelUser);
                newDiv.appendChild(newLabelType);
                newDiv.appendChild(newLabelCreatedAt);
                currentDiv.appendChild(newDiv)
            })
        }
    } catch (err) {
        console.error('Fetch Account:', err);
        document.getElementById('CTALink').innerText = '';
    }
};



function addElement(text) {
    const newLabel = document.createElement("label");

    // and give it some content
    const newContent = document.createTextNode("Hi there and greetings!");

    // add the text node to the newly created div
    newLabel.appendChild(newContent);

    // add the newly created element and its content into the DOM
    const currentDiv = document.getElementById("list-accounts");
    const clone = document.importNode(newLabel, true);
    clone.appendChild(newContent)
    currentDiv.appendChild(newLabel);
    currentDiv.appendChild(clone)

}

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('CTAButton').innerHTML = 'Loading...';

    console.log('dom loaders');
    const statusAuth = await getAuth();
    if (statusAuth) {
        await getUserAccount();
        await getListAccounts();
        await getListActivities()
    }
});