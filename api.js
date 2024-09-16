// api.js

const username = 'juanm_marin';
const password = '19Estandar+';
const base64Credentials = btoa(`${username}:${password}`);
const tokenUrl = 'https://centralusdtapp73.epicorsaas.com/SaaS5333/TokenResource.svc/';

const tokenRequestOptions = {
    method: 'POST',
    headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Accept': 'application/json'
    }
};

async function getAccessToken() {
    try {
        const response = await fetch(tokenUrl, tokenRequestOptions);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        const token = data;
        console.log('AccessToken:', token);
        
        return token.AccessToken;
    } catch (error) {
        console.error('Error al obtener el AccessToken:', error);
    }
}

async function fetchDataWithAccessToken(token) {
    const apiUrl = 'https://centralusdtapp73.epicorsaas.com/SaaS5333/api/v1/BaqSvc/ESF_COPA_USERS(ALICO)';
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type":"application/json"
        }
    };

    try {
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log(data);
        return data.value; // Asumiendo que los datos están en una propiedad 'value'
    } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
    }
}

function populateDatalist(data) {
    const userDatalist = document.getElementById('user-datalist');
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.UserFile_DcdUserID;
        userDatalist.appendChild(option);
    });

    const userInput = document.getElementById('user-input');
    userInput.addEventListener('input', (event) => {
        const inputText = event.target.value;
        if (inputText) {
            const userData = data.find(user => user.UserFile_DcdUserID === inputText);
            if (userData) {
                displayUserDetails(userData);
            } else {
                document.getElementById('user-details').style.display = 'none';
            }
        } else {
            document.getElementById('user-details').style.display = 'none';
        }
    });
}

function displayUserDetails(userData) {
    const userDetails = document.getElementById('user-details');
    userDetails.innerHTML = `
        <p>Compañía: ${userData.UserFile_CurComp}</p>
        <p>ID: ${userData.UserFile_DcdUserID}</p>
        <p>Correo: ${userData.UserFile_EMailAddress}</p>
        <p>Celular: ${userData.UserFile_Phone}</p>
        <p>Área: ${userData.UserFile_Address1}</p>
    `;
    userDetails.style.display = 'block';
}

async function initialize() {
    const token = await getAccessToken();
    if (token) {
        const data = await fetchDataWithAccessToken(token);
        if (data) {
            populateDatalist(data);
        }
    }
}

initialize();
