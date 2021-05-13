let chosenSquare = ''
let possibilitiesShown = false
let userTakesOver = false

const grid = document.querySelector('.grid')
const solveButton = document.querySelector('[solve-button]')
const cleanButton = document.querySelector('[clean-button]')
const showButton = document.querySelector('[show-possibilities-button]')
showButton.addEventListener('click', showPossibilities)
cleanButton.addEventListener('click', cleanAll)
solveButton.addEventListener('click', () => {
  freezeAll('freeze')
  hardSolveSudoku()
})
const integerButtons = document.querySelectorAll('[integer]')
integerButtons.forEach(integerButton => {
  integerButton.addEventListener('click', () => { enterInteger(integerButton) })
})
const infoButton = document.querySelector('[information]')
infoButton.addEventListener('click', showTutorial)
const overlay = document.querySelector('[overlay]')
const tutorial = document.querySelector('[tutorial]')
const hideInfoButton = document.querySelector('[hide-info]')
hideInfoButton.addEventListener('click', hideTutorial)


function showPossibilities() {
  if (possibilitiesShown) {
    showButton.innerText = 'Show Possibilities'
    let possibilities = document.querySelectorAll('.minisquare')
    possibilities.forEach(possibility => possibility.style.display = 'none')
    possibilitiesShown = false
    return
  }
  showButton.innerText = 'Hide Possibilities'
  possibilitiesShown = true
  let possibilities = document.querySelectorAll('.minisquare')
  possibilities.forEach(possibility => possibility.style.display = 'flex')
}


createGrid() // As the page opened 

function createGrid() {
  for (let i = 0; i < 9; i++) {
    let row = Number(i) + 1

    for (let a = 0; a < 9; a++) {
      let column = Number(a) + 1
      let kare

      const square = document.createElement('div')
      square.classList.add('square')
      grid.append(square)
      square.setAttribute('filled', 'false')
      // square.setAttribute('possibilities', 'f9')
      square.setAttribute('id', a + i * 9)
      square.addEventListener('click', () => {
        if (square.getAttribute('filled') === 'false') { fillSquare(square) }
        if (square.getAttribute('filled') === 'true') { emptySquare(square) }
      })

      if (row === 1 || row === 2 || row === 3) { kare = 'a' }
      if (row === 4 || row === 5 || row === 6) { kare = 'b' }
      if (row === 7 || row === 8 || row === 9) { kare = 'c' }
      if (column === 1 || column === 2 || column === 3) { kare = kare + 1 }
      if (column === 4 || column === 5 || column === 6) { kare = kare + 2 }
      if (column === 7 || column === 8 || column === 9) { kare = kare + 3 }

      for (let i = 0; i < 9; i++) {
        const minisquare = document.createElement('div')
        minisquare.classList.add('minisquare')
        minisquare.innerText = `${i + 1}`
        minisquare.setAttribute('id', `f${Number(i + 1)}`)
        square.append(minisquare)
      }
      // Attribute them 
      square.setAttribute('row', `f${row}`)
      square.setAttribute('column', `f${column}`)
      square.setAttribute('kare', `f${kare}`)
    }
  }
}

function fillSquare(square) {
  if (chosenSquare === square) { // if the chosen one already the chosen square
    chosenSquare = ''
    square.style.backgroundColor = 'white'
    return
  }
  if (chosenSquare !== '') { chosenSquare.style.backgroundColor = 'white' }
  chosenSquare = square
  square.style.backgroundColor = 'var(--fadedblue)'
}

const emptySquareButton = document.querySelector('[empty-square-button]')
emptySquareButton.addEventListener('click', fillPossibilities)

function emptySquare(square) {
  if (chosenSquare !== '') {
    chosenSquare.style.backgroundColor = 'white'
    chosenSquare = '' // This might be unnceseaasty
  }
  chosenSquare = square
  square.style.backgroundColor = 'var(--fadedblue)'
}

function fillPossibilities() {
  if (chosenSquare === '') { return }
  if (chosenSquare.getAttribute('filled') === 'false') { return }
  chosenSquare.innerText = ''
  chosenSquare.setAttribute('filled', 'false')
  let arr = document.querySelectorAll('[filled=true]')
  cleanAll()
  arr.forEach(prev => {
    let newIndex = document.getElementById(`${prev.getAttribute('id')}`)
    chosenSquare = newIndex
    enterInteger(prev)
  })
  chosenSquare = ''
}


function enterInteger(integer) {
  if (chosenSquare === '') { return }
  if (chosenSquare.querySelector(`[id=f${integer.innerText}]`) === null) { // Fire a warning shot past its ear, 
    alert('You shall not put that integer there')
    return
  }
  chosenSquare.innerText = `${integer.innerText}`
  chosenSquare.style.justifyContent = 'center'
  chosenSquare.setAttribute('filled', 'true')
  chosenSquare.style.background = 'white'
  setPossbilities(chosenSquare)
  chosenSquare = ''
}

function setPossbilities(square) {
  square.setAttribute('filled', 'true')
  // row
  let rowArr = document.querySelectorAll(`[row=${square.getAttribute('row')}]`)
  // column
  let colArr = document.querySelectorAll(`[column=${square.getAttribute('column')}]`)
  // kare
  let kareArr = document.querySelectorAll(`[kare=${square.getAttribute('kare')}]`)

  let toBeRemoved = square.innerText
  removePossibilities(rowArr, toBeRemoved)
  removePossibilities(colArr, toBeRemoved)
  removePossibilities(kareArr, toBeRemoved)
}

function freezeAll(command) {
  if (command === 'freeze') {
    Array.from(document.body.children).forEach(child => { child.style.pointerEvents = 'none' })
    selfButton.style.pointerEvents = 'auto'
  }
  if (command === 'unfreeze') {
    Array.from(document.body.children).forEach(child => { child.style.pointerEvents = 'auto' })
  }
}

function removePossibilities(arr, integer) { // This is already happening as the user enters integers
  arr.forEach(square => {
    if (square.getAttribute('filled') === 'true') { return }
    let noMo = square.querySelector(`[id=f${integer}]`) || ''
    if (noMo === '') { return }
    noMo.parentElement.removeChild(noMo)
  })
  // Children sayısına göre bir ayar çekeceeam
}



// Seperators
let seperators = []
seperators.push(document.querySelector('[s1]'))
seperators.push(document.querySelector('[s2]'))
seperators.push(document.querySelector('[s3]'))
seperators.push(document.querySelector('[s4]'))

function cleanAll() {
  grid.innerHTML = ''
  createGrid()
  seperators.forEach(seperator => { grid.append(seperator) }) // seperators are put back
  showPossibilities() // Twice because I want it to behave :) 
  showPossibilities() // Twice because I want it to behave :)
}


function singlePossibility() {
  const theUnfilled = document.querySelectorAll('[filled=false]')
  theUnfilled.forEach(unfilled => {
    if (unfilled.children.length === 1) {
      let inner = unfilled.firstElementChild.innerText
      unfilled.removeChild(unfilled.firstElementChild)
      unfilled.innerText = inner
      unfilled.style.justifyContent = 'center'
      unfilled.setAttribute('filled', 'true')
      setPossbilities(unfilled)
      unfilled.style.animation = 'red-pulse 500ms ease-in-out'
    }
  })
}


function hardSolveSudoku() {
  if (userTakesOver) { return }
  const theUnfilled = document.querySelectorAll('[filled=false]')
  if (theUnfilled.length === 0) {
    freezeAll('unfreeze') // cool, this got only once
    return
  }

  for (let i = 1; i < 10; i++) {
    // rows
    let rowArr = document.querySelectorAll(`[row=f${i}]`)
    // columns
    let columnArr = document.querySelectorAll(`[column=f${i}]`)
    // kares
    let kareArr
    if (i < 4) { kareArr = document.querySelectorAll(`[kare=fa${i}]`) }
    if (i < 7 && i > 3) { kareArr = document.querySelectorAll(`[kare=fb${i - 3}]`) }
    if (i < 10 && i > 6) { kareArr = document.querySelectorAll(`[kare=fc${i - 6}]`) }

    loneShephard(rowArr)
    loneShephard(columnArr)
    loneShephard(kareArr)
  }
  setTimeout(() => { singlePossibility() }, 1000)
  setTimeout(() => { hardSolveSudoku() }, 2000)
}

function loneShephard(arr) { // Which is the alone integer in here, one of its kind

  let n1, n2, n3, n4, n5, n6, n7, n8, n9 // All integers
  let n1e, n2e, n3e, n4e, n5e, n6e, n7e, n8e, n9e // That integer is where again?
  n1 = n2 = n3 = n4 = n5 = n6 = n7 = n8 = n9 = 0
  let numbers = [n1, n2, n3, n4, n5, n6, n7, n8, n9]
  let numberElements = [n1e, n2e, n3e, n4e, n5e, n6e, n7e, n8e, n9e]

  arr.forEach(square => {
    for (let i = 1; i < 10; i++) {
      if (square.querySelector(`[id=f${i}]`) !== null) {
        numbers[i - 1] += 1
        numberElements[i - 1] = square.querySelector(`[id=f${i}]`).parentElement
      }
    }
  })

  for (let i = 1; i < 10; i++) {
    if (numbers[i - 1] === 1) {
      numberElements[i - 1].innerText = i
      numberElements[i - 1].style.justifyContent = 'center'
      numberElements[i - 1].setAttribute('filled', 'true')
      numberElements[i - 1].style.animation = 'blue-pulse 500ms ease-in-out'
      setPossbilities(numberElements[i - 1])
    }
  }
}


function showTutorial() {
  overlay.style.display = 'flex'
  overlay.append(tutorial)
  tutorial.style.display = 'flex'
}

function hideTutorial() {
  overlay.style.display = 'none'
}


// Ill do the rest button

const selfButton = document.querySelector('[self-try]')
selfButton.addEventListener('click', letTheUser)

function letTheUser() {
  userTakesOver = true
  freezeAll('unfreeze')
}

/* Array huh
const arr = [
  [[0, 0, 0],     [0, 0, 0],      [0, 0, 0]],
  [[0, 0, 0],     [0, 0, 0],      [0, 0, 0]],
  [[0, 0, 0],     [0, 0, 0],      [0, 0, 0]],

  [[0, 0, 0],     [0, 0, 0],      [0, 0, 0]],
  [[0, 0, 0],     [0, 0, 0],      [0, 0, 0]],
  [[0, 0, 0],     [0, 0, 0],      [0, 0, 0]],

  [[0, 0, 0],     [0, 0, 0],      [0, 0, 0]],
  [[0, 0, 0],     [0, 0, 0],      [0, 0, 0]],
  [[0, 0, 0],     [0, 0, 0],      [0, 0, 0]]
]
*/