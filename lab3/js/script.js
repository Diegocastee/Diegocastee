document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", loadCounties);
loadStates();
document.querySelector("#username").addEventListener("input", checkUsername);
document.querySelector("#signupForm").addEventListener("submit", validateForm);
document.querySelector("#password").addEventListener("input", suggestPassword);

async function displayCity() {
   try {
    let zipCode = document.querySelector("#zip").value;
    let url = `https://csumb.space/api/geo/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();

    //the API returns false when the zip code is not found, so we can check for that case before trying to access the city property
    if (data === false) {
        document.querySelector("#zipError").textContent = "Zip code not found";
        document.querySelector("#latitude").textContent = "";
        document.querySelector("#longitude").textContent = "";
        return;
    }

    document.querySelector("#city").textContent = data.city;
    document.querySelector("#latitude").textContent = data.latitude;
    document.querySelector("#longitude").textContent = data.longitude;

   } catch (error) {
    document.querySelector("#city").textContent = "Unable to retrieve city";
    document.querySelector("#latitude").textContent = "";
    document.querySelector("#longitude").textContent = "";
    console.error(error);
   }
}

async function loadStates() {
    let stateMenu = document.querySelector("#state");
    
    stateMenu.textContent = "";

    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select One";
    stateMenu.appendChild(defaultOption);
    
    try {
        let url = "https://csumb.space/api/geo/statesAPI.php";
        let response = await fetch(url);
        let data = await response.json();
        
        for (let item of data) {
            let option = document.createElement("option");
            option.value = item.usps;
            option.textContent = item.state;
            stateMenu.appendChild(option);
        }
    } catch (error) {
        console.error(error);
        
        stateMenu.textContent = "";
        
        let errorOption = document.createElement("option");
        errorOption.value = "";
        errorOption.textContent = "Unable to load states";
        stateMenu.appendChild(errorOption);
    }
}

async function checkUsername() {
    let username = document.querySelector("#username").value;
    let usernameError = document.querySelector("#usernameError");
    
    if (username.length === 0) {
        usernameError.textContent = "Username required";
        usernameError.style.color = "red";
        return false;
    }
    
    let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
    let response = await fetch(url);
    let data = await response.json();
    
    if (data.available) {
        usernameError.textContent = "Username available!";
        usernameError.style.color = "green";
        return true;
    } else {
        usernameError.textContent = "Username taken";
        usernameError.style.color = "red";
        return false;
    }
}

async function validateForm(event) {
    event.preventDefault();
    
    let isValid = true;
    let username = document.querySelector("#username").value;
    let usernameError = document.querySelector("#usernameError");

    let password = document.querySelector("#password").value;
    let passwordAgain = document.querySelector("#passwordAgain").value;
    let passwordError = document.querySelector("#passwordError");
    
    usernameError.textContent = "";
    passwordError.textContent = "";
    
    // Validate username
    if (username.length === 0) {
        usernameError.textContent = "Username required";
        usernameError.style.color = "red";
        isValid = false;
    } else {
        let usernameAvailable = await checkUsername();
        
        if (usernameAvailable === false) {
            isValid = false;
        }
    }

    // Validate password length
    if (password.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters";
        passwordError.style.color = "red";
        isValid = false;
    }

    // Validate password matching
    else if (password !== passwordAgain) {
        passwordError.textContent = "Passwords do not match";
        passwordError.style.color = "red";
        isValid = false;
    }
    
    // Submit after all validation is done
    if (isValid) {
        document.querySelector("#signupForm").submit();
    }
}

async function loadCounties() {
    let state = document.querySelector("#state").value;
    let countyMenu = document.querySelector("#county");

    countyMenu.textContent = "";

    if (state === "") {
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Select a state first";
        countyMenu.appendChild(option);
        return;
    }

    let loadingOption = document.createElement("option");
    loadingOption.textContent = "Loading counties...";
    countyMenu.appendChild(loadingOption);

    try {
        let url =
            `https://csumb.space/api/geo/countyListAPI.php?state=${encodeURIComponent(state)}`;

        let response = await fetch(url);
        let data = await response.json();

        countyMenu.textContent = "";

        let defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select One";
        countyMenu.appendChild(defaultOption);

        for (let item of data) {
            let option = document.createElement("option");
            option.value = item.county;
            option.textContent = item.county;
            countyMenu.appendChild(option);
        }
    } catch (error) {
        console.error(error);

        countyMenu.textContent = "";

        let errorOption = document.createElement("option");
        errorOption.value = "";
        errorOption.textContent = "Unable to load counties";
        countyMenu.appendChild(errorOption);
    }
}

async function suggestPassword() {
    let suggestion = document.querySelector("#passwordSuggestion");

    try {
        let url =  `https://csumb.space/api/suggestedPassword.php?length=${document.querySelector("#password").value.length}`;
        let response = await fetch(url);
        let data = await response.json();

        suggestion.textContent = `Suggested password: ${data.password}`;
        suggestion.style.color = "green";
    } catch (error) {
        suggestion.textContent = "Unable to retrieve password suggestion";
        suggestion.style.color = "red";
        console.error(error);
    }
}