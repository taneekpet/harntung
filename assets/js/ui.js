const tmpOnload = window.onload;

let peopleNameColumn, itemNameRow, summaryBalanceRow, csvScoreFile, mainTable;

window.onload = function() {
  if(tmpOnload) tmpOnload();
  peopleNameColumn = document.querySelector('thead tr#peopleNameColumn');
  itemNameRow = document.querySelector('table tbody#itemNameRow');
  summaryBalanceRow = document.querySelector('table tr#summaryBalanceRow');
  mainTable = document.querySelector('table#mainTable');
  //csvScoreFile = document.querySelector('input#csvScoreFile');
  //csvScoreFile.addEventListener('change', handleCSV);
  //calculationReset();
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

function isNumberUI(event) {
  return !isNaN(event.target.value);
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
}

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
}*/

function createShareForItemInput(peopleIndex, itemIndex) {
  let newDiv = document.createElement('div');
  let newLabel = document.createElement('label');
  newLabel.innerHTML = '0';
  newLabel.style = "width: 100px";
  newLabel.id = 'price_' + itemIndex + '_for_' + peopleIndex;
  newLabel.style.display = 'inline-block';
  let newCheck = document.createElement('input');
  newCheck.type = 'checkbox';
  newCheck.className = 'form-control';
  newCheck.addEventListener('change', (event) => {
    changeBoardTick(peopleIndex, itemIndex, event.target.checked);
  });
  newCheck.checked = true;
  newCheck.id = 'share_' + itemIndex + '_for_' + peopleIndex;
  newCheck.style.marginRight = '5px';
  newDiv.appendChild(newCheck);
  newDiv.appendChild(newLabel);
  return newDiv;
}

function createNewPeopleUI(name, checkList) {
  name = name || document.querySelector('input#newPeopleName').value;
  if(name === '') {
    alert('ใส่ชื่อคน');
    return;
  }
  const { id: peopleId, index: peopleIndex } = createNewPeople(name, checkList);

  //create UI
  Array.from(mainTable.children).forEach((row, index) => {
    let newElement;
    if(index === mainTable.childElementCount - 1) {
      newElement = document.createElement('th');
      let newLabel = document.createElement('label');
      newLabel.id = 'price_sum_for_' + peopleIndex;
      newLabel.innerHTML = '0';
      newLabel.style.width = '0%';
      newLabel.style.paddingLeft = '10px';
      newElement.appendChild(newLabel);
      row.children[0].appendChild(newElement);
      return;
    }
    if(index === 0) {
      newElement = document.createElement('th');
      newElement.scope = 'col';
      newElement.id = peopleId;
      newElement.innerHTML = name;
    } else if(index < mainTable.childElementCount - 1) {
      newElement = document.createElement('th');
      newElement.scope = 'row';
      newElement.appendChild(createShareForItemInput(
        peopleIndex, index - 1
      ));
    }
    const tr = row.children[0];
    tr.insertBefore(newElement, tr.lastElementChild);
  });
  calculateResult();
  return false;
}

function createNewItemUI(name = false, price = 0) {
  name = name || document.querySelector('input#newItemName').value;
  price = price || document.querySelector('input#newItemPrice').value;
  price = parseFloat(price);
  if(name === '') {
    alert('ใส่ชื่อรายการค่าใช้จ่าย');
    return;
  }
  let { id: itemId, index: itemIndex } = createNewItem(name, price);
  //create UI

  //name
  const newRow = document.createElement('tbody');
  const newTr = document.createElement('tr');
  const newTh = document.createElement('th');
  newTh.scope = 'row';
  newTh.innerHTML = name + '(' + price + ')';
  newTr.appendChild(newTh);

  //people
  for(let i = 0 ; i < peopleCount ; i++) {
    const newTh = document.createElement('th');
    newTh.appendChild(createShareForItemInput(i, itemIndex));
    newTr.appendChild(newTh);
  }

  //sum
  let newElement = document.createElement('th');
  let newLabel = document.createElement('label');
  newLabel.id = 'share_sum_for_' + itemIndex;
  newLabel.innerHTML = '0';
  newLabel.style.width = '0%';
  newLabel.style.paddingLeft = '10px';
  newElement.appendChild(newLabel);
  newTr.appendChild(newElement);

  newRow.appendChild(newTr);
  mainTable.insertBefore(newRow, mainTable.lastElementChild);
  calculateResult();
  return false;
}