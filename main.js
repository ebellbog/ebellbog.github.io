const hexColors = ['tomato', '#ee5', 'mediumaquamarine', 'mediumslateblue', 'magenta']

const hexRadius = 25
const xDelta = hexRadius*Math.cos(Math.PI/6)
const yDelta = hexRadius*(1+Math.sin(Math.PI/6))

const outerBorder = 4
const innerBorder = 3

const hexWidth = xDelta*2+outerBorder
const hexHeight = yDelta+outerBorder

const maxPixels = 800
const minPixels = 600

$(document).ready(()=>{
  $content = $('#content')
  $canvas = $('canvas')
  ctx = $canvas[0].getContext('2d')

  $(window).resize(()=>{
    resizeCanvas()
    redrawGrid()})

  resizeCanvas()
  redrawGrid()
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

function redrawGrid() {
  let width = Math.floor(cWidth/hexWidth)
  let height = Math.floor(cHeight/(hexHeight+outerBorder))

  const offsetX = (cWidth-hexWidth*(width-1))/2
  const offsetY = (cHeight-hexHeight*(height-1))/2

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width-j%2; i++) {
      drawHex(j, i, offsetX, offsetY, randColor());
    }
  }
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
                 color:'rgba(0,0,0,.15)', rotation:rotation})
  }
}

function randColor() {
  return hexColors[Math.floor(Math.random()*hexColors.length)]
}
