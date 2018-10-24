// config

const hexColors = ['tomato', '#ee5', 'mediumaquamarine', 'mediumslateblue', 'magenta']

const holes = .1

const hexRadius = 25
const xDelta = hexRadius*Math.cos(Math.PI/6)
const yDelta = hexRadius*(1+Math.sin(Math.PI/6))

const outerBorder = 4
let innerBorder = 3

const hexWidth = xDelta*2+outerBorder
const hexHeight = yDelta+outerBorder

const maxPixels = 900
const minPixels = 600

const animationSpeed = 0.04
const animationDelay = 150

// setup

$(document).ready(()=>{
  $content = $('#content')
  $canvas = $('canvas')
  ctx = $canvas[0].getContext('2d')

  $(window).resize(()=>{
    resizeCanvas()
    generateGrid()
  })

  resizeCanvas()
  generateGrid()

  doneAnimating = true
  waiting = false
  animationId = requestAnimationFrame(update)

  $(document).keydown(function(e) {
    if (e.which === 32) {
      //fillHoles()
    }
  })
})

function resizeCanvas() {
  cWidth = $content.width()
  cHeight = $content.height()
  const aspect = cWidth/cHeight

  if (aspect < 1) {
    let pixels = Math.max(minPixels, Math.min(cHeight, maxPixels))
    cWidth = pixels*aspect
    cHeight = pixels
  } else {
    let pixels = Math.max(minPixels, Math.min(cWidth, maxPixels))
    cHeight = pixels/aspect
    cWidth = pixels
  }

  $canvas.attr({height:cHeight, width:cWidth})
}

function generateGrid() {
  let width = Math.floor(cWidth/hexWidth)
  let height = Math.floor(cHeight/(hexHeight+outerBorder))

  grid = []
  for (let i = 0; i < height; i++) {
    let row = []

    for (let j = 0; j < width-i%2; j++) {

      let newHex
      if (Math.random() > 1-holes) {
        newHex = generateHole()
      } else {
        newHex = {
          color: randColor(),
          hole: false,
          animating: false,
          lastAnimated: 0,
          destination: [],
          progress: 0
        }
      }

      row.push(newHex)
    }

    grid.push(row)
  }
}

// draw methods

function redraw () {
  ctx.clearRect(0, 0, cWidth, cHeight)

  const width = grid[0].length
  const height = grid.length

  const offsetX = (cWidth-hexWidth*(width-1))/2
  const offsetY = (cHeight-hexHeight*(height-1))/2

  let animating = false
  grid.forEach((row, i)=>{
    row.forEach((hex, j)=>{
      if (hex.hole) {
        return
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

          grid[hex.destination[0]][hex.destination[1]] = hex
          grid[i][j] = generateHole()

          center = centerForCoords(...hex.destination)
        }
      }

      drawHex(center[0]+offsetX, center[1]+offsetY, hex.color, scale)
    })
  })

  doneAnimating = !animating
}

function drawHex(x, y, color, scale) {
  if (!scale) scale = 1
  const rotation = Math.PI/6

  drawPolygon(ctx,
              x, y,
              6, hexRadius*scale,
              {style:'fill', color:color, rotation:rotation})

  if (innerBorder > 0) {
    drawPolygon(ctx, 
                x, y,
                6, (hexRadius-innerBorder/1.8)*scale,
                {style:'stroke', weight:innerBorder,
                 color:'rgba(0,0,0,.2)', rotation:rotation})
  }
}

// actions

function update() {
  if (doneAnimating && !waiting) {
    waiting = true
    setTimeout(fillHoles, animationDelay)
  }

  innerBorder = 4.5+.8*Math.sin(Date.now()/350)
  redraw()
  animationId = requestAnimationFrame(update)
}

function fillHoles() {
  waiting = false
  doneAnimating = false
  grid.forEach((row,i)=>{
    row.forEach((hex,j)=>{
      if (hex.hole) {
        const neighbor = randNeighbor(i, j)
        if (neighbor) {
          neighbor.destination = [i,j]
          neighbor.animating = true
        }
      }
    })
  })
}


// helper methods

function randItem(list, remove) {
  const index = Math.floor(Math.random()*list.length)
  const item = list[index]

  if (remove) list.splice(index,1)
  return item
}

function randColor() {
  return randItem(hexColors)
}

function centerForCoords(row, col) {
  const centerX = hexWidth*(col+.5*(row%2))
  const centerY = hexHeight*row

  return [centerX, centerY]
}

function generateHole() {
  return {
    hole: true
  }
}

function randNeighbor(row, col) {
  const neighbors = getNeighbors(row, col)
  while (neighbors.length > 0) {
    const candidate = randItem(neighbors, true)
    const hex = hexForCoords(candidate)
    if (!(hex.animating || Date.now()-hex.lastAnimated < 1000)) {
      return hex
    }
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
