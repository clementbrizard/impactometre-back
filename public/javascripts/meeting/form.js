/* eslint no-unused-vars: 0 */

// ========== UTILS ==========
function cmToInches (i) {
  return Math.round(i * 0.39370)
}

function inchesToCm (i) {
  return Math.round(i / 0.39370)
}

function getIdNumber (id) {
  // Return the number n for an id attribute ending with -n
  const idNumberFilter = /\w+-(\d{1,2}).*/
  const idNumber = id.replace(idNumberFilter, '$1')

  return idNumber
}

// ========== MAIN ==========
let participantNumber = 2
const travellers = new Map()
const participantMaxNumber = 30
const participantMinNumber = 2

for (let i = 1; i <= participantNumber; i++) {
  travellers.set('trav' + i, 0)
}

function addAParticipant () {
  if (participantNumber < participantMaxNumber) {
    participantNumber += 1
    document.querySelector('#participantNumber').innerHTML = participantNumber

    travellers.set('trav' + participantNumber, 0)

    for (var [clé, valeur] of travellers) {
      console.log(clé + ' = ' + valeur)
    }
  }
}

function removeAParticipant () {
  if (participantNumber > participantMinNumber) {
    travellers.delete('trav' + participantNumber, 0)
    participantNumber -= 1
    document.querySelector('#participantNumber').innerHTML = participantNumber

    for (var [clé, valeur] of travellers) {
      console.log(clé + ' = ' + valeur)
    }
  }
}

// =========== HARDWARE ==========
let tvScreenNumber = 0
const tvScreenMaxNumber = 50
const tvScreenMinNumber = 0

function outputUpdate (size, id) {
  document.querySelector('#screenSizeNumberInput-' + getIdNumber(id)).value = size
}

function rangeUpdate (size, id) {
  document.querySelector('#tvScreenSize-' + getIdNumber(id)).value = size
}

function updateTvScreenNumberSpan (number) {
  document.querySelector('#tvScreenNumber').innerHTML = number
}

function addATvScreen () {
  if (tvScreenNumber < tvScreenMaxNumber) {
    tvScreenNumber += 1
    updateTvScreenNumberSpan(tvScreenNumber)

    const parent = document.querySelector('#additionalScreens')
    const div = document.createElement('div')

    if (tvScreenNumber === 1) {
      div.innerHTML = '<label for="tvScreenSize-' + tvScreenNumber + '">taille du ' + tvScreenNumber + '<sup>er</sup> écran</label>'
    } else {
      div.innerHTML = '<label for="tvScreenSize-' + tvScreenNumber + '">taille du ' + tvScreenNumber + '<sup>e</sup> écran</label>'
    }

    div.innerHTML += '<input type="range" min="48" max="228" value="107" id="tvScreenSize-' + tvScreenNumber + '"' +
    'oninput="outputUpdate(value, id)">' +
    '<output for="tvScreenSize-' + tvScreenNumber + '" id="screenSize-' + tvScreenNumber + '">' +
    '<input type="number" min="48" max="228" value="107" id="screenSizeNumberInput-' + tvScreenNumber + '"' +
    'oninput="rangeUpdate(value, id)">' +
    '</output>' +
    '<select id="screenSizeUnit-' + tvScreenNumber + '" name="unit"' +
    'onchange="changeScreenUnit(value, id)">' +
    '<option value="cm" id="cm" selected>centimètres</option>' +
    '<option value="inch" id="inch">pouces</option>' +
    '</select>'
    parent.appendChild(div)
  }
}

function removeATvScreen () {
  if (tvScreenNumber > tvScreenMinNumber) {
    tvScreenNumber -= 1
    updateTvScreenNumberSpan(tvScreenNumber)

    const parent = document.querySelector('#additionalScreens')
    parent.removeChild(parent.lastChild)
  }
}

function changeScreenUnit (unit, id) {
  const screenSizesCm = new Map([
    ['min', 43],
    ['value', 107],
    ['max', 229]
  ])
  const cmIterator = screenSizesCm.entries()

  const screenSizesInch = new Map([
    ['min', 17],
    ['value', 42],
    ['max', 90]
  ])
  const inchIterator = screenSizesInch.entries()

  const n = getIdNumber(id)

  const tvScreenSizeSelector = document.querySelector('#tvScreenSize-' + n)
  const screenSizeNumberInputSelector = document.querySelector('#screenSizeNumberInput-' + n)

  if (unit === 'cm') {
    tvScreenSizeSelector.value = inchesToCm(tvScreenSizeSelector.value)
    screenSizeNumberInputSelector.value = inchesToCm(screenSizeNumberInputSelector.value)
    for (const [key, value] of cmIterator) {
      tvScreenSizeSelector.setAttribute(key, value)
      screenSizeNumberInputSelector.setAttribute(key, value)
    }
  } else {
    tvScreenSizeSelector.value = cmToInches(tvScreenSizeSelector.value)
    screenSizeNumberInputSelector.value = cmToInches(screenSizeNumberInputSelector.value)
    for (const [key, value] of inchIterator) {
      tvScreenSizeSelector.setAttribute(key, value)
      screenSizeNumberInputSelector.setAttribute(key, value)
    }
  }
}

// ========== JOURNEY ==========
const travellerNumber = participantNumber
let journeyNumber = 0
const journeyMaxNumber = 50
const journeyMinNumber = 0

function getIdNumbers (id) {
  // Return the number n for an id attribute ending with -n
  const idNumberFilter = /\w+-(\d{1,2})__\w+-(\d{1,2})/
  const idNumber = id.replace(idNumberFilter, '$2')

  return idNumber
}

function kmSliderUpdate (dist, id) {
  document.querySelector('#kmNumber-' + getIdNumber(id)).value = dist
}

function kmNumberUpdate (dist, id) {
  document.querySelector('#kmSlider-' + getIdNumber(id)).value = dist
}

function addJourneyItem (travellerId) {
  const travId = getIdNumber(travellerId)
  let actualJourneyNumber = travellers.get('trav' + travId)
  const travellerSelector = document.querySelector('#traveller-' + travId)

  travellers.set('trav' + travId, actualJourneyNumber += 1)
  const newJourneyNumber = travellers.get('trav' + travId)
  console.log('trav' + travId + ': ' + newJourneyNumber)

  if (travellers.get('trav' + travId) < journeyMaxNumber) {
    const tmpl = travellerSelector.querySelector('#journeyTmpl')
    const clone = tmpl.content.cloneNode(true)

    clone.querySelector('.traveller__journeyItem').id = 'traveller-' + travId + '__journeyItem-' + newJourneyNumber
    // clone.querySelector('#removeBtn-1-n').id = 'removeBtn-' + travellerNumber + '-' + journeyNumber
    clone.querySelector('input[type="number"]').id = 'kmNumber-' + newJourneyNumber
    clone.querySelector('input[type="range"]').id = 'kmSlider-' + newJourneyNumber

    const lastItem = travellerSelector.querySelector('.traveller__journeyItem--add')
    travellerSelector.querySelector('.traveller__journeys').insertBefore(clone, lastItem)
  }
}

function removeJourneyItem (journeyId) {
  console.log(journeyId)
  if (journeyNumber > journeyMinNumber) {
    journeyNumber -= 1

    const toRemove = document.querySelector('#' + journeyId).parentNode
    console.log(toRemove.nodeName)
    toRemove.remove()
    console.log(journeyNumber)
  }
}
