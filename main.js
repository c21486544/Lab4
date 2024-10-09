
// Split names and append data to the table
function appendToTable(data) {
    const tbody = document.getElementById('data-table').querySelector('tbody');
    data.forEach(item => {
        const row = document.createElement('tr');
        const [firstName, lastName] = item.name.split(' ');
        const id = item.id;

        row.innerHTML = `
            <td>${firstName}</td>
            <td>${lastName}</td>
            <td>${id}</td>
        `;
        tbody.appendChild(row);
    });
}

// Clear the table before appending new data
function clearTable() {
    const tbody = document.getElementById('data-table').querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows
}


function fetchDataSynchronous() {
    // Clear the table before adding new data
    clearTable(); 

    try {
        // Fetch reference.json synchronously
        const refRequest = new XMLHttpRequest();
        // Synchronous request
        refRequest.open('GET', 'data/reference.json', false); 
        // Make the request
        refRequest.send(); 
        if (refRequest.status !== 200) {
            throw new Error(`Failed to load reference.json: ${refRequest.status}`);
        }
        const reference = JSON.parse(refRequest.responseText);
        const data1File = reference.data_location;

        // Fetch data1.json synchronously
        const data1Request = new XMLHttpRequest();
        data1Request.open('GET', `data/${data1File}`, false);
        data1Request.send();
        if (data1Request.status !== 200) {
            throw new Error(`Failed to load ${data1File}: ${data1Request.status}`);
        }
        const data1 = JSON.parse(data1Request.responseText);

        // Fetch data2.json synchronously
        const data2Request = new XMLHttpRequest();
        data2Request.open('GET', `data/${data1.data_location}`, false);
        data2Request.send();
        if (data2Request.status !== 200) {
            throw new Error(`Failed to load data2.json: ${data2Request.status}`);
        }
        const data2 = JSON.parse(data2Request.responseText);

        // Fetch data3.json synchronously
        const data3Request = new XMLHttpRequest();
        data3Request.open('GET', 'data/data3.json', false);
        data3Request.send();
        if (data3Request.status !== 200) {
            throw new Error(`Failed to load data3.json: ${data3Request.status}`);
        }
        const data3 = JSON.parse(data3Request.responseText);

        // Append the data in order: data1, data2 and data3
        appendToTable(data1.data);
        appendToTable(data2.data);
        appendToTable(data3.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function fetchDataAsynchronous() {
    clearTable();

    // Create XMLHttpRequest to fetch reference.json
    const refRequest = new XMLHttpRequest();
    // Open a GET request to reference.json asynchronously
    refRequest.open('GET', 'data/reference.json', true);

    refRequest.onload = function () {
        const reference = JSON.parse(refRequest.responseText);
        // Extracting the location of data1.json from the reference data
        const data1File = reference.data_location;

        // Create a new XMLHttpRequest to fetch data1.json
        const data1Request = new XMLHttpRequest();
        data1Request.open('GET', `data/${data1File}`, true);

        data1Request.onload = function () {
            const data1 = JSON.parse(data1Request.responseText);

            const data2Request = new XMLHttpRequest();
            data2Request.open('GET', `data/${data1.data_location}`, true);

            data2Request.onload = function () {
                const data2 = JSON.parse(data2Request.responseText);

                const data3Request = new XMLHttpRequest();
                data3Request.open('GET', 'data/data3.json', true);

                data3Request.onload = function () {
                    const data3 = JSON.parse(data3Request.responseText);

                    // Append the data in order: data1, data2 and data3
                    appendToTable(data1.data);
                    appendToTable(data2.data);
                    appendToTable(data3.data);
                };

                // Send the request to fetch data3.json
                data3Request.send();
            };

            data2Request.send();
        };

        data1Request.send();
    };

    refRequest.send();
}


function fetchDataWithFetch() {
    clearTable();

    fetch('data/reference.json')
        .then(response => response.json())
        // Using the parsed reference data to fetch data1.json
        .then(reference => fetch(`data/${reference.data_location}`))
        .then(response => response.json())
        // Processing the data from data1
        .then(data1 => {
            appendToTable(data1.data);
            // Fetching the file_name specified in data_location from the file (data1) that was retrieved
            return fetch(`data/${data1.data_location}`);
        })
        .then(response => response.json())
        .then(data2 => {
            appendToTable(data2.data);
            return fetch('data/data3.json');
        })
        .then(response => response.json())
        .then(data3 => {
            appendToTable(data3.data);
        })
        .catch(error => console.error('Error fetching data:', error));
}