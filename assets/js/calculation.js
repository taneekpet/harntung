let listOfParty = {}, listOfDistrict = {};
let usedPartyName = {}, usedDistrictName = {};
let board = {}, peopleCount = 0, itemCount = 0, share = {}, itemPointer = {};

//=================================================================================

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function exportCSV() {
  let textScore = '#';
  let partyIdList = Object.keys(listOfParty);
  let districtIdList = Object.keys(listOfDistrict);
  for(let i = 0 ; i < partyIdList.length ; i++) {
    if(partyIdList[i] === '0') {
      partyIdList.splice(i,1);
      break;
    }
  }
  for(let i = 0 ; i < partyIdList.length ; i++) {
    const party = listOfParty[partyIdList[i]];
    textScore += ',';
    textScore += party.name + ':' + party.partylistAppliedNum.toString();
  }
  for(let i = 0 ; i < districtIdList.length ; i++) {
    const district = listOfDistrict[districtIdList[i]];
    textScore += '\n' + district.name;
    for(let j = 0 ; j < partyIdList.length ; j++) {
      textScore += ',' + (district.score[partyIdList[j]] 
        ? district.score[partyIdList[j]].toString() 
        : '0');
    }
  }
  download('exportScore.csv', textScore);
}

function fillInputFromCSV(inputTxt) {
  try {
    let lines = inputTxt.split('\n');
    for(let i = 0 ; i < lines.length ; i++) {
      console.log(i)
      let words = lines[i].split(',');
      for(let j = 0 ; j < words.length ; j++) {
        //create party
        if(i === 0) {
          if(j === 0) continue; // # symbol
          let [ partyName, partylistApplied ] = words[j].split(':');
          createNewPartyUI(partyName, null, partylistApplied);
        }
        //create district
        else if(j === 0) {
          createNewDistrictUI(words[j]);
        }
        else {
          let district = listOfDistrict[i.toString()];
          let party = listOfParty[j.toString()];
          //change ui score
          let inputElem = document.querySelector('input#partyId_' + party.id + '_districtId_' + district.id);
          inputElem.value = words[j];
          inputElem.dispatchEvent(new Event('change'));
        }
      }
    }
  } catch(error) {
    alert('ไฟล์ไม่รองรับ');
    console.log(error);
    calculationReset(document.querySelector('input#partyListNum').value);
  }
}

//=================================================================================

/*function calculationReset(inputPartylistRepresentativeNum) {
  for(let id in listOfDistrict) removeDistrict(id);
  for(let id in listOfParty) removeParty(id);
  partyIdAssigned = 1;
  districtIdAssigned = 1;

  partylistRepresentativeNum = inputPartylistRepresentativeNum;

  usedPartyName = {};
  usedDistrictName = {};
  clearInput();
}*/

function People(name, checkList) {
  this.id = name;
  this.index = peopleCount++;
  this.checkList = checkList;
  return this;
}

function Item(name, price) {
  this.id = name;
  this.price = price;
  this.index = itemCount++;
  itemPointer[this.index] = this;
  return this;
}

function calculateResult() {
  let countDiv = {};
  let priceShare = {};
  for(let row = 0 ; row < itemCount ; row++) {
    countDiv[row] = 0;
    for(let col = 0 ; col < peopleCount ; col++) {
      if(share[row][col]) countDiv[row]++;
    }
    try {
      priceShare[row] = itemPointer[row].price / countDiv[row];
    } catch(err) {
      priceShare[row] = 0;
    }
  }
  for(let row = 0 ; row < itemCount ; row++) {
    for(let col = 0 ; col < peopleCount ; col++) {
      if(share[row][col]) board[row][col] = priceShare[row];
      else board[row][col] = 0;
    }
  }
  console.log(board, share);
}

//=================================================================================

function createNewPeople(name, checkList) {
  for(let i in board) {
    if(!share[i]) share[i] = {};
    board[i][peopleCount] = 0;
    share[i][peopleCount] = true;
  }
  return new People(name, checkList);
}

function createNewItem(name, price) {
  const newItem = {};
  share[itemCount] = {};
  for(let i = 0 ; i < peopleCount ; i++) {
    newItem[i] = 0;
    share[itemCount][i] = true;
  }
  board[itemCount] = newItem;
  return new Item(name, price);
}

function changeBoardTick(peopleIndex, itemIndex, isShare) {
  console.log(peopleIndex, itemIndex, isShare)
  share[itemIndex][peopleIndex] = isShare;
  calculateResult();
}

/*function createNewParty(name, partylistAppliedNum) {
  let newParty = new Party(name, partylistAppliedNum);
  listOfParty[newParty.id] = newParty;
  return newParty;
}

function createNewDistrict(name) {
  let newDistrict = new District(name);
  listOfDistrict[newDistrict.id] = newDistrict;
  applyPartyAtDistrict(novote, newDistrict);
  return newDistrict;
}

function removeParty(partyId) {
  if(partyId === '0') return false; // can not remove no vote

  const party = listOfParty[partyId];
  if(party == null) return false; //no party found
  //all district
  for(let id in listOfDistrict) {
    const district = listOfDistrict[id];
    withdrawPartyFromDistrict(party, district, true);
  }
  delete listOfParty[partyId];
  return true;
}

function removeDistrict(districtId) {
  const district = listOfDistrict[districtId];
  if(district == null) return false; //no district found
  //all party
  for(let id in listOfParty) {
    const party = listOfParty[id];
    withdrawPartyFromDistrict(party, district, true);
  }
  delete listOfDistrict[districtId];
  return true;
}

function applyPartyAtDistrict(party, district) {
  party.applyForDistrict(district.id);
  district.addParty(party.id);
}

function withdrawPartyFromDistrict(party, district) {
  party.withdrawFromDistrict(district.id);
  district.removeParty(party.id);
  triggerCalculate(district);
}

function setScore(party, district, score) {
  if(district.score[party.id] == null) throw 'Party did not apply at this district';
  //old score
  party.sumScore -= district.score[party.id];
  //new score
  party.sumScore += score; 
  //console.log('0000',district.score,district.id,party.id)
  district.score[party.id] = score;
  //console.log('0000',district.score)
  triggerCalculate(district);
}

function triggerCalculate(districtChanged) {
  districtChanged.triggerWon();
  calculateResult();
}*/