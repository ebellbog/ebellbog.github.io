/** config **/

const hexColors = ['tomato', '#ee5', 'mediumaquamarine', 'mediumslateblue', 'magenta']

const holes = .2 // percent

const maxPixels = 900
const minPixels = 600

// styles in JS to avoid using !important
// need to be applied directly to element;
// must match 'to' keyframe
const selectedBtnStyle = {
  'top': '55px',
  'left': '50%',
  'font-size': '64px',
  'width': '250px',
  'height': '100px'
}
const mobilePortraitSelected = {
  'top': '6.5vh',
  'left': '50%',
  'font-size': '15vw',
  'width': '100vw',
  'height': '13vh',
}
const mobileLandscapeSelected = {
  'top': '6.9vh',
  'left': '50%',
  'font-size': '13vh',
  'width': '100vw',
  'height': '14vh',
}

const desktopBtnStyle = {
  'font-size': '32px',
  'width': '118px',
  'height': '118px',
  'opacity': 1
}
const mobilePortraitStyle = {
  'font-size': '7.75vw',
  'width': '29vw',
  'height': '29vw',
  'opacity': 1
}
const mobileLandscapeStyle = {
  'font-size': '6.75vh',
  'width': '27vh',
  'height': '27vh',
  'opacity': 1
}

// enums (ish)

const statuses = {
  STOPPED: 0,
  STARTING: 1,
  RUNNING: 2,
  WAITING: 3
}

const modes = {
  BLOCK: 0,
  STAGGERED: 1,
  SEQUENTIAL: 2
}

const views = {
  HOME: 0,
  ABOUT: 1,
  PORTFOLIO: 2,
  RESUME: 3,
  CONTACT: 4
}

const devices = {
  MOBILE: 0,
  DESKTOP: 1
}

const orientations = {
  PORTRAIT: 0,
  LANDSCAPE: 1
}

let animationMode = modes.SEQUENTIAL

// animation params

const layoutSpeed = 800 // milliseconds
const selectSpeed = 1750
const selectDelay = 0
const animationSpeed = 0.035 // a little higher == a lot faster
const spinSpeed = 0.08
const waveSpeed = 1
const fadeSpeed = 0.015
const maxFade = .55
const fadeDelay = 400
const animationDelay = 350 // for moves of the same hex
const repetitionDelay = 800 // increase to reduce back-and-forth
const staggerInterval = 280 // intial staggering of hexes
const sequenceInterval = 375 // between sequential hexes

/** setup **/

function configDevice() {
  deviceMode = isMobileDevice() ? devices.MOBILE : devices.DESKTOP

  if (deviceMode === devices.DESKTOP) {
    outerBorder = 3.6
    baseInnerBorder = 4.3
    innerBorderDelta = 0.7

    setHexSize(22)
    const btnDeltaX = 170
    const btnDeltaY = 110

    $('#name').show()
    $('body').removeClass('mobile landscape portrait')
  }else {
    outerBorder = 5
    baseInnerBorder = 0
    innerBorderDelta = 0

    setHexSize(33)
    $('#name').hide()
    $('body').addClass('mobile')
  }
}

function setHexSize(size) {
  hexRadius = size

  xDelta = hexRadius*Math.cos(Math.PI/6)
  yDelta = hexRadius*(1+Math.sin(Math.PI/6))

  hexWidth = xDelta*2+outerBorder
  hexHeight = yDelta+outerBorder
}

function resetParams() {
  spinDirection = -1
  spinColor = false

  fading = false
  fadeStart = false
  fadeProgress = 0

  currentView = views.HOME
}

$(document).ready(()=>{
  $content = $('#content')
  $hexes = $('#hexes')
  $background = $('#background')

  ctxHex = getContext($hexes)
  ctxBack = getContext($background)


  $(window).resize(()=>{
    resetParams()
    configDevice()

    resizeCanvas()
    generateGrid(deviceMode === devices.DESKTOP)

    layoutButtons()
    $('#headshot').css({opacity:1})

    if (animationMode == modes.STAGGERED ||
        animationMode == modes.SEQUENTIAL)
      animationStatus = statuses.STOPPED
  })

  resetParams()
  configDevice()

  resizeCanvas()
  layoutButtons(true, layoutSpeed)
  generateGrid(deviceMode === devices.DESKTOP)

  animationStatus = statuses.STOPPED

  animationId = requestAnimationFrame(update)

  $('.btn').click((e)=>{
    e.stopPropagation()
    if (!currentView == views.HOME) return

    // $btn is itself, or highest parent with .btn class
    let $btn = $(e.target)
    const parents = $(e.target).parents('.btn')
    $btn = parents.length > 0 ? parents.last() : $btn

    const $background = $btn.find('.btn-background')
    const $border = $btn.find('.btn-border')

    const viewName = $btn.attr('id').toUpperCase()
    currentView = views[viewName]

    spinColor = colorForView(currentView)
    spinHexes(true)

    const style = deviceMode === devices.DESKTOP ?
                    selectedBtnStyle :
                    (mobileOrientation === orientations.PORTRAIT ?
                      mobilePortraitSelected :
                      mobileLandscapeSelected)

    const backgroundStyle = deviceMode === devices.DESKTOP ?
                            {opacity: .75} :
                            {'border-radius': 0}

    setTimeout(()=>{
      $btn.addClass('selected')

      // move selected button, fade border
      $btn.animate(style, selectSpeed)
      $border.animate({opacity: 0}, selectSpeed)
      $background.animate(backgroundStyle, selectSpeed)

      // hide headshot and other buttons
      $('#headshot').animate({opacity:0}, selectSpeed/2)
      $('.btn:not(.selected)').each((index, otherBtn)=>{
        $(otherBtn).animate({opacity:0}, selectSpeed/2)
      })
    }, selectDelay)
  })

  $('body').click(()=>{
    spinHexes(false)
    setTimeout(()=>{
      // fade headshot back in
      $('#headshot').animate({opacity: 1}, selectSpeed)

      // rearrange buttons (includes fade-in and removing class)
      layoutButtons(true, selectSpeed,()=>{
                      currentView = views.HOME
                    })
    }, selectDelay)
  })

  $(document).keydown(function(e) {
    if (e.which === 32) {
      //spinHexes(true)
    } else if (e.which === 13) {
      //spinHexes(false)
    }
  })
})

function resizeCanvas() {
  cWidth = $hexes.width()
  cHeight = $hexes.height()
  const aspect = cWidth/cHeight

  btnDeltaX = 170
  btnDeltaY = 110

  if (aspect < 1) {
    let pixels = Math.max(minPixels, Math.min(cHeight, maxPixels))
    cWidth = pixels*aspect
    cHeight = pixels

    if (deviceMode === devices.MOBILE) {
      mobileOrientation = orientations.PORTRAIT

      $('body').removeClass('landscape')
               .addClass('portrait')

      btnDeltaX = 275
      btnDeltaY = 400
    }
  } else {
    let pixels = Math.max(minPixels, Math.min(cWidth, maxPixels))
    cHeight = pixels/aspect
    cWidth = pixels

    if (deviceMode === devices.MOBILE) {
      mobileOrientation = orientations.LANDSCAPE

      $('body').removeClass('portrait')
               .addClass('landscape')

      btnDeltaX = 300
      btnDeltaY = 125
    }
  }

  $hexes.attr({height:cHeight, width:cWidth})
  $background.attr({height:cHeight, width:cWidth})

  scale = cHeight/$hexes.height()

  borderCols = Math.max(Math.floor((cWidth-500*scale)/
               (hexRadius*5)), 1)
  borderRows = Math.max(Math.floor((cHeight-275*scale)/
               (hexRadius*5)), 1)
}

function layoutButtons(animated, duration, callback) {
  $headshot = $('#headshot')
  const y = parseInt($headshot.css('top'), 10)
  const x = parseInt($headshot.css('left'), 10)

  const func = animated ? 'animate' : 'css'
  const btns = ['about', 'portfolio', 'resume', 'contact']

  const baseStyle = deviceMode === devices.DESKTOP ?
                      desktopBtnStyle :
                      (mobileOrientation === orientations.PORTRAIT ?
                        mobilePortraitStyle :
                        mobileLandscapeStyle)

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const $btn = $(`#${btns[j+2*i]}`)
      const $border = $btn.find('.btn-border')
      const $background = $btn.find('.btn-background')

      const style = Object.assign({}, baseStyle,
          {'top': `${y+btnDeltaY*(2*i-1)}px`,
          'left': `${x+btnDeltaX*(2*j-1)}px`})

      $btn[func](style, duration, ()=>{
        $('.btn').removeClass('selected')
        if (callback) callback()
      })

      $border[func]({'opacity': 1}, duration)
      $background[func]({'opacity': 1, 'border-radius': '300px'},
                         duration)
    }
  }

  if (!duration) $('.btn').removeClass('selected')
}

function generateGrid(asFrame) {
  let width = Math.floor(cWidth/hexWidth)
  let height = Math.floor(cHeight/(hexHeight+outerBorder/3))

  grid = []
  for (let i = 0; i < height; i++) {
    let row = []

    for (let j = 0; j < width-i%2; j++) {

      let newHex

      if (asFrame && (
          (i >= borderRows && i <= height-borderRows-1) &&
          (j >= borderCols && j <= width-borderCols-i%2-1)
          )) {
        newHex = generateFiller()
      }
      else if (Math.random() > 1-holes) {
        newHex = generateHole()
      } else {
        newHex = generateHex()
      }

      row.push(newHex)
    }

    grid.push(row)
  }
}

/** draw methods **/

function redraw () {
  ctxHex.clearRect(0, 0, cWidth, cHeight)
  if (fading) ctxBack.clearRect(0, 0, cWidth, cHeight)

  const width = grid[0].length
  const height = grid.length

  const offsetX = (cWidth-hexWidth*(width-1))/2
  const offsetY = (cHeight-hexHeight*(height-1))/2

  if (fadeStart && Date.now() > fadeStart) {
    fadeStart = false
    fading = true
    fadeProgress = spinDirection > 0 ? 0 : 1
  }

  if (fading) {
    fadeProgress += fadeSpeed*spinDirection

    if ((spinDirection > 0 && fadeProgress >= 1) ||
        (spinDirection < 0 && fadeProgress <= 0)) {
      fading = false
      fadeProgress = Math.max(0, fadeProgress)
    }

    $background.css('opacity', fadeProgress*maxFade)
  }


  let animating = false
  grid.forEach((row, i)=>{
    row.forEach((hex, j)=>{
      if (hex.hole ||
          (hex.filler && fadeProgress <= 0))
        return

      if (hex.spinStart && Date.now() > hex.spinStart) {
        hex.spinStart = false
        hex.spinning = true
        hex.spinProgress = spinDirection > 0 ? 0 : Math.PI
      }

      if (hex.spinning) {
        hex.spinProgress += spinSpeed*spinDirection

        if ((spinDirection > 0 && hex.spinProgress >= Math.PI) ||
            (spinDirection < 0 && hex.spinProgress <= 0)) {
          hex.spinning = false
          hex.isStatic = hex.spinProgress > 0
        }
      }

      let center = centerForCoords(i,j)
      let scale = 1
      if (hex.animating) {
        animating = true
        if (hex.progress < 1) {
          hex.progress += animationSpeed

          const destCoord = centerForCoords(...hex.destination)
          const deltaX = destCoord[0]-center[0]
          const deltaY = destCoord[1]-center[1]

          center = [center[0]+deltaX*hex.progress,
                    center[1]+deltaY*hex.progress]
          scale = .75*Math.abs(hex.progress-.5)+.625
        }
        else {
          hex.animating = false
          hex.lastAnimated = Date.now()
          hex.progress = 0

          const newHole = generateHole()
          if (animationMode == modes.SEQUENTIAL) {
            const oldHole = hexForCoords(hex.destination)
            newHole.index = oldHole.index
          }

          grid[hex.destination[0]][hex.destination[1]] = hex
          grid[i][j] = newHole

          center = centerForCoords(...hex.destination)
        }
      }

      drawHex(center[0]+offsetX, center[1]+offsetY,
              hex.color, scale, hex.filler, hex.spinProgress)
    })
  })

  if (animationMode == modes.BLOCK &&
      animationStatus == statuses.RUNNING &&
      !animating) {
    animationStatus = statuses.WAITING
  }
}

function drawHex(x, y, color, scale, filler, spin) {
  const ctx = filler ? ctxBack : ctxHex
  scale = scale || 1
  spin = spin || 0

  let size = hexRadius
  if (spin > Math.PI/2 || filler) {
    size += outerBorder/1.4
    color = spinColor
  }
  size *= scale

  tracePath(ctx, getHexPath(x, y, size, spin))

  ctx.fillStyle = color
  ctx.fill()

  if (innerBorder > 0 && spin < Math.PI/2 && !filler) {
    size -= scale*innerBorder/1.8

    tracePath(ctx, getHexPath(x, y, size, spin))

    ctx.strokeStyle = 'rgba(0,0,0,.2)'
    ctx.lineWidth = innerBorder
    ctx.stroke()
  }
}

function getHexPath(x, y, size, spin) {
  const rotation = Math.PI/6
  const path = []

  for (let i = 0; i < 6; i++) {
    const angle = i*Math.PI/3 + rotation

    let ptY = y+size*Math.sin(angle)
    let ptX = x+size*Math.cos(angle)

    if (spin) {
      if (ptX > x+.01) {
        ptY = y+(ptY-y)*(1-Math.sin(spin)*.25)
      } else if (ptX < x-.01) {
        ptY = y+(ptY-y)*(.25*Math.sin(spin)+1)
      }
      ptX = x+(ptX-x)*Math.cos(spin)

    }

    path.push({x: ptX, y:ptY})
  }
  return path
}

function tracePath(ctx, path) {
  let start = path.shift()

  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  path.map(p => ctx.lineTo(p.x, p.y))
  ctx.closePath()
}

/** actions **/

function update() {
  if (animationMode == modes.BLOCK) {
    if (animationStatus == statuses.STOPPED ||
        animationStatus == statuses.WAITING) {
      animationStatus = statuses.STARTING
      setTimeout(fillHoles, animationDelay)
    }
  }
  else if (animationMode == modes.STAGGERED) {
    if (animationStatus == statuses.STOPPED) {
      startStaggering()
    }

    else if (animationStatus == statuses.RUNNING) {
      const holes = getHoles(true)
      holes.forEach((hole)=>{
        animateHole(...hole.coords, hole)
      })
    }
  }
  else if (animationMode == modes.SEQUENTIAL) {
    if (animationStatus == statuses.STOPPED) {
      startSequencing()
    } else if (animationStatus == statuses.RUNNING &&
               Date.now()-lastMove > sequenceInterval) {
      const holes = getHoles()
      let nextHole = holes.find((h)=>{
        return (!h.animating && h.index == currentHoleIndex)
      })

      if (nextHole) {
        animateHole(...nextHole.coords, nextHole)
        currentHoleIndex = (currentHoleIndex+1)%holes.length
        lastMove = Date.now()
      }
    }
  }

  innerBorder = baseInnerBorder+
                innerBorderDelta*Math.sin(Date.now()/300)
  redraw()
  animationId = requestAnimationFrame(update)
}

function spinHexes(forwards) {
  newDirection = forwards ? 1 : -1

  // don't re-spin
  if (spinDirection == newDirection) return

  spinDirection = newDirection

  fadeStart = Date.now()+fadeDelay

  let origin = forwards ? [0, 0] : [grid.length,
                                    grid[grid.length-1].length]
  origin = centerForCoords(...origin)

  grid.forEach((row, i)=>{
    row.forEach((hex, j)=>{
      if (hex.hole || hex.filler) return

      hex.isStatic = true

      const center = centerForCoords(i, j)
      const dist = getDist(origin, center, true)

      hex.spinStart = Date.now()+dist*waveSpeed
    })
  })
}

function fillHoles() {
  animationStatus = statuses.RUNNING

  getHoles().forEach((hole)=>{
    animateHole(...hole.coords, hole)
  })
}

function startStaggering() {
  animationStatus = statuses.STARTING

  const holes = getHoles()
  let hole, i=0
  while (hole = randItem(holes, true)) {
    hole.lastAnimated = Date.now()
                        +(i++*staggerInterval)
  }

  animationStatus = statuses.RUNNING
}

function startSequencing() {
  animationStatus = statuses.STARTING

  const holes = getHoles()
  let hole, i=0
  while (hole = randItem(holes, true)) {
    hole.index = i++
  }

  currentHoleIndex = 0
  lastMove = Date.now()-sequenceInterval

  animationStatus = statuses.RUNNING
}

function animateHole(row, col, hole) {
  const neighbor = randNeighbor(row, col)
  if (neighbor) {
    hole.animating = true
    neighbor.destination = [row, col]
    neighbor.animating = true
  }
}


/**  helper methods **/

function isMobileDevice() {
  return ( navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) ? true : false
}

function getContext($element) {
  return $element[0].getContext('2d')
}

function randItem(list, remove) {
  if (!list.length) return false

  const index = Math.floor(Math.random()*list.length)
  const item = list[index]

  if (remove) list.splice(index,1)
  return item
}

function colorForView(view) {
  let color
  switch(view) {
    case views.ABOUT:
      color = hexColors[2]
      break
    case views.PORTFOLIO:
      color = hexColors[4]
      break
    case views.RESUME:
      color = hexColors[3]
      break
    case views.CONTACT:
      color = hexColors[1]
      break
    default:
      break
  }
  return color
}

function randColor() {
  return randItem(hexColors)
}

function centerForCoords(row, col) {
  const centerX = hexWidth*(col+.5*(row%2))
  const centerY = hexHeight*row

  return [centerX, centerY]
}

function getDist(p1, p2, manhattan) {
  let dist
  if (manhattan) {
    dist = Math.abs(p2[1]-p1[1])+Math.abs(p2[0]-p1[0])
  } else {
    dist = Math.sqrt(Math.pow(p2[0]-p1[0], 2)+
                     Math.pow(p2[1]-p1[1], 2))
  }
  return dist 
}

function generateHex() {
  return {
    color: randColor(),
    animating: false,
    spinning: false,
    lastAnimated: 0,
    destination: [],
    progress: 0,
    spinStart: 0,
    spinProgress: 0,
    isStatic: false
  }
}

function generateHole() {
  return {
    hole: true,
    animating: false,
    lastAnimated: Date.now()+(Math.random()+.5)*staggerInterval
  }
}

function generateFiller() {
  return {
    filler: true,
    isStatic: true,
  }
}

function getHoles(readyToAnimate) {
  return grid.reduce((a,b,i)=>{
                return a.concat(b.filter((h,j)=>{
                  if (h.hole && !h.empty) {
                    if (readyToAnimate &&
                        (h.animating ||
                        Date.now()-h.lastAnimated < animationDelay))
                      return
                    h.coords=[i,j]
                    return h
                  }
                }))
              }, [])
}

function randNeighbor(row, col) {
  const neighbors = getNeighbors(row, col)
  while (neighbors.length > 0) {
    const candidate = randItem(neighbors, true)
    const hex = hexForCoords(candidate)
    if (!(hex.animating ||
          hex.isStatic ||
          Date.now()-hex.lastAnimated < repetitionDelay))
      return hex
  }

  return false
}

function hexForCoords(coords) {
  return grid[coords[0]][coords[1]]
}

function getNeighbors(row, col) {
  const neighbors = []
  if (col > 0) {
    neighbors.push([row, col-1])
  }
  if (col < grid[row].length-1) {
    neighbors.push([row, col+1])
  }

  if (row > 0) {
    if (row % 2) { // short rows
      neighbors.push([row-1, col])
      neighbors.push([row-1, col+1])
    } else { // long rows
      if (col < grid[row].length-1) {
        neighbors.push([row-1, col])
      }
      if (col > 0) {
        neighbors.push([row-1, col-1])
      }
    }
  }

  if (row < grid.length-1) {
    if (row % 2) { // short rows
      neighbors.push([row+1, col])
      neighbors.push([row+1, col+1])
    } else { // long rows
      if (col < grid[row].length-1) {
        neighbors.push([row+1, col])
      }
      if (col > 0) {
        neighbors.push([row+1, col-1])
      }
    }
  }

  return neighbors.filter((n)=>{
    if (!hexForCoords(n).hole) return n
  })
}
