const tmpOnload = window.onload;

let peopleNameColumn, itemNameRow, summaryBalanceRow, csvScoreFile;

window.onload = function() {
  if(tmpOnload) tmpOnload();
  peopleNameColumn = document.querySelector('thead tr#peopleNameColumn');
  itemNameRow = document.querySelector('table tbody#itemNameRow');
  summaryBalanceRow = document.querySelector('table tr#summaryBalanceRow');
  csvScoreFile = document.querySelector('input#csvScoreFile');
  csvScoreFile.addEventListener('change', handleCSV);
  calculationReset();
}

function handleCSV(evt) {
  var files = evt.target.files;
  var file = files[0];           
  var reader = new FileReader();
  reader.onload = function(event) {
    inputTxt = event.target.result;
    calculationReset();
    fillInputFromCSV(inputTxt);
  }
  reader.readAsText(file)
}

function isNumberUI(evt) {
  return isNumber(event.target.value);
}

/*function updateResultUI() {
  for(let i = 1 ; i < localWonColumn.children.length ; i++) {
    let id = (i-1).toString();
    localWonColumn.children[i].innerHTML = listOfParty[id].localWonNum;
  }
  for(let i = 1 ; i < partylistWonColumn.children.length ; i++) {
    let id = (i-1).toString();
    partylistWonColumn.children[i].innerHTML = listOfParty[id].partylistWonNum;
  }
  for(let i = 1 ; i < sumWonColumn.children.length ; i++) {
    let id = (i-1).toString();
    sumWonColumn.children[i].innerHTML = listOfParty[id].localWonNum + listOfParty[id].partylistWonNum;
  }
  for(let i = 0 ; i < districtNameRow.children.length - 3 ; i++) {
    let districtElement = districtNameRow.children[i];
    let districtId = districtElement.id;
    for(let j = 1 ; j < districtElement.children.length ; j++) {
      let partyObject = listOfParty[(j-1).toString()];
      let highlightElement = districtElement.children[j].children[0];
      if(partyObject.districtAppliedList[districtId].won) {
        highlightElement.style = "width: 100px; color: darkgreen; font-weight: bolder; border: 8px solid #ced4da";
      }
      else {
        highlightElement.style = "width: 100px";
      }
    }
  }

  updateSortedResultUI();
}*/

function clearInput() {
  for(let i = 1 ; i < peopleNameColumn.children.length - 1 ; i++) {
    const child = peopleNameColumn.children[i];
    peopleNameColumn.removeChild(child);
  }
  for(let i = 1 ; i < itemNameRow.children.length ; i++) {
    const child = itemNameRow.children[i];
    itemNameRow.removeChild(child);
  }
  for(let i = 1 ; i < summaryBalanceRow.children.length - 1; i++) {
    const child = summaryBalanceRow.children[i];
    summaryBalanceRow.removeChild(child);
  }
}

/*function createNewScoreInput(party, district) {
  let newInput = document.createElement('input');
  newInput.type = 'number';
  newInput.className = 'form-control';
  newInput.onkeypress = function(event) {
    return isNumber(event);
  }
  newInput.addEventListener('change', () => {
    setScore(party, district, parseInt(newInput.value));
  });
  newInput.value = 0;
  newInput.style = "width: 100px";
  newInput.id = 'partyId_' + party.id + '_districtId_' + district.id;
  return newInput;
}

function createNewPeopleUI(name, checkList) {
  name = name || document.querySelector('input#newPeopleName').value;
  applied = applied || document.querySelector('input#newPartyNumPartylist').value;
  if(name === '') {
    alert('ใส่ชื่อคน');
    return;
  }
  partyId = createNewParty(name, partylistAppliedNum).id;
  //create UI
  let newPartyUI = document.createElement('th');
  newPartyUI.scope = 'col';
  newPartyUI.id = partyId;
  newPartyUI.innerHTML = name === novote.name ? name : 'พรรค ' + name;
  partyNameColumn.appendChild(newPartyUI);

  for(let i = 0 ; i < districtNameRow.children.length ; i++) {
    let child = districtNameRow.children[i];
    let district = listOfDistrict[child.id];
    let newScore = document.createElement('td');
    if(i < districtNameRow.children.length - 3) {
      newScore.appendChild(createNewScoreInput(listOfParty[partyId], district));
    }
    else newScore.innerHTML = 0;
    child.appendChild(newScore);
  }
  return false;
}

function createNewItemUI(name = false) {
  name = name || document.querySelector('input#newDistrictName').value;
  let districtId = createNewDistrict(name).id;
  //create UI
  let newDistrictUI = document.createElement('tr');
  newDistrictUI.id = districtId;
  let newDistrictInnerUI = document.createElement('th');
  newDistrictInnerUI.scope = 'row';
  newDistrictInnerUI.innerHTML = 'เขต ' + name;
  newDistrictUI.appendChild(newDistrictInnerUI);
  for(let i = 1 ; i < partyNameColumn.children.length ; i++) {
    let party = listOfParty[partyNameColumn.children[i].id];
    let newScore = document.createElement('td');
    newScore.appendChild(createNewScoreInput(party, listOfDistrict[districtId]));
    newDistrictUI.appendChild(newScore);
  }
  districtNameRow.insertBefore(
    newDistrictUI, 
    districtNameRow.children[districtNameRow.children.length - 3]
  );
  return false;
}*/