let apiKey = 'db261871155';
let apiAddress = 'https://www.behindthename.com/api';

let searchForm = document.querySelector('#searchForm');
let nameInput = document.querySelector('#nameInput');
let randomButton = document.querySelector('#randomButton');
let statusMessage = document.querySelector('#status');
let resultCard = document.querySelector('#result');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    searchName(nameInput.value.trim());
});

randomButton.addEventListener('click', function() {
    getRandomName();
});

async function searchName(name) {
  if (name === '') {
    showMessage('Please enter a name.');
    return;
  }
  
  let address = apiAddress + '/lookup.json?name=' + encodeURIComponent(name) + '&key=' + apiKey;
  let data = await getNameData(address);
  
  if (data === null) {
    return;
  }
  
  if (!data || !data.name) {
    showMessage('No result found for ' + name + '.');
    return;
  }
  
  showResult(data);
}

async function getRandomName() {
  let address = apiAddress + '/random.json?number=1&key=' + apiKey;
  let data = await getNameData(address);
  
  if (data === null) {
    return;
  }
  
  let randomName = data;
  
  if (data.names) {
    randomName = data.names[0];
  } else if (Array.isArray(data)) {
    randomName = data[0];
  }
  
  if (typeof randomName === 'string') {
    nameInput.value = randomName;
    await searchName(randomName);
  } else if (randomName && randomName.name) {
    nameInput.value = randomName.name;
    showResult(randomName);
  } else {
    showMessage('The API did not return a random name. Please try again.');
  }
}

async function getNameData(address) {
  showMessage('Loading...');
  resultCard.hidden = true;
  
  try {
    let response = await fetch(address);
    let data = await response.json();
    
    if (data.error) {
      showMessage('The API returned an error: ' + data.error);
      return null;
    }
    
    if (!response.ok) {
      showMessage('The request failed. Please check the API key and try again.');
      return null;
    }
    
    if (Array.isArray(data)) {
      data = data[0];
    }
    
    return data;
  } catch (error) {
    showMessage('Could not connect to the API. Check your internet connection or try again later.');
    return null;
  }
}

function showResult(nameData) {
  let name = nameData.name;
  let gender = nameData.gender || 'Not specified';
  let usage = nameData.usage || nameData.usages || 'Not specified';
  
  if (gender === 'M' || gender === 'm') {
    gender = 'Masculine';
  } else if (gender === 'F' || gender === 'f') {
    gender = 'Feminine';
  } else if (gender === 'B' || gender === 'b') {
    gender = 'Unisex';
  }
  
  document.querySelector('#resultName').textContent = name;
  document.querySelector('#resultGender').textContent = 'Gender: ' + gender;
  document.querySelector('#resultUsage').textContent = 'Origin: ' + getUsageText(usage);
  
  let genderBadge = document.querySelector('#genderBadge');
  genderBadge.className = 'gender-badge';
  
  if (gender === 'Feminine') {
    genderBadge.textContent = '♀';
    genderBadge.classList.add('feminine');
  } else if (gender === 'Masculine') {
    genderBadge.textContent = '♂';
    genderBadge.classList.add('masculine');
  } else if (gender === 'Unisex') {
    genderBadge.textContent = '⚥';
    genderBadge.classList.add('unisex');
  } else {
    genderBadge.textContent = '?';
  }
  
  resultCard.hidden = false;
  showMessage('');
  getRelatedNames(name);
}

async function getRelatedNames(name) {
  let relatedOutput = document.querySelector('#resultRelated');
  relatedOutput.textContent = 'Related names: Loading...';
  
  let address = apiAddress + '/related.json?name=' + encodeURIComponent(name) + '&key=' + apiKey;
  
  try {
    let response = await fetch(address);
    let data = await response.json();
    
    if (!response.ok || data.error) {
      relatedOutput.textContent = 'Related names: Could not load.';
      return;
    }
    
    let names = data.names || data.related || data;
    
    if (!Array.isArray(names)) {
      names = [names];
    }
    
    let relatedNames = [];
    
    for (let i = 0; i < names.length; i++) {
      let relatedName = names[i];
      
      if (typeof relatedName === 'object' && relatedName !== null) {
        relatedName = relatedName.name;
      }
      
      if (relatedName) {
        relatedNames.push(relatedName);
      }
    }
    
    if (relatedNames.length === 0) {
      relatedOutput.textContent = 'Related names: None found.';
    } else {
      relatedOutput.textContent = 'Related names: ' + relatedNames.join(', ');
    }
  } catch (error) {
    relatedOutput.textContent = 'Related names: Could not load.';
  }
}

function getUsageText(usage) {
  if (Array.isArray(usage)) {
    let usageNames = [];
    
    for (let i = 0; i < usage.length; i++) {
      usageNames.push(getUsageText(usage[i]));
    }
    
    return usageNames.join(', ');
  }
  
  if (typeof usage === 'object' && usage !== null) {
    return usage.name || usage.full || usage.usage_full || usage.usage_name || usage.usage || usage.code || 'Unknown';
  }
  
  return usage;
}

function showMessage(message) {
  statusMessage.textContent = message;
}

