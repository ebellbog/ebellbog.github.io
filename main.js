// config

const hexColors = ['tomato', '#ee5', 'mediumaquamarine', 'mediumslateblue', 'magenta']

const holes = .05

const hexRadius = 25
const xDelta = hexRadius*Math.cos(Math.PI/6)
const yDelta = hexRadius*(1+Math.sin(Math.PI/6))

const outerBorder = 4
let innerBorder = 3

const hexWidth = xDelta*2+outerBorder
const hexHeight = yDelta+outerBorder

const maxPixels = 800
const minPixels = 600

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

  animationId = requestAnimationFrame(update)
})

function update() {
  innerBorder = 3.5+1*Math.sin(Date.now()/400)
  redraw()
  animationId = requestAnimationFrame(update)
}

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
      let newHex = {
        color: '',
        hole: false,
        animating: false,
        coords: [i, j],
        destination: [],
        progress: 0
      }

      if (Math.random() > 1-holes) {
        newHex.hole = true
      } else {
        newHex.color = randColor()
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

  grid.forEach((row)=>{
    row.forEach((hex)=>{
      if (hex.hole) {
        return
      }

      drawHex(hex.coords[0], hex.coords[1],
              offsetX, offsetY,
              hex.color)
    })
  })
}

function drawHex(row, col, offsetX, offsetY, color) {
  const rotation = Math.PI/6
  const centerX = hexWidth*(col+.5*(row%2))+offsetX
  const centerY = hexHeight*row+offsetY

  drawPolygon(ctx, 
              centerX, centerY,
              6, hexRadius,
              {style:'fill', color:color, rotation:rotation})

  if (innerBorder > 0) {
    drawPolygon(ctx, 
                centerX, centerY,
                6, hexRadius-innerBorder/1.8,
                {style:'stroke', weight:innerBorder,
                 color:'rgba(0,0,0,.2)', rotation:rotation})
  }
}

// helper methods

function randColor() {
  return hexColors[Math.floor(Math.random()*hexColors.length)]
}
