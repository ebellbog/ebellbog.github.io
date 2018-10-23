const hexColors = ['tomato', '#ee5', 'mediumaquamarine', 'mediumslateblue', 'magenta']

const hexRadius = 25
const xDelta = hexRadius*Math.cos(Math.PI/6)
const yDelta = hexRadius*(1+Math.sin(Math.PI/6))

const outerBorder = 2
const innerBorder = 3

const maxPixels = 910

$(document).ready(()=>{
  $content = $('#content')
  $canvas = $('canvas')
  ctx = $canvas[0].getContext('2d')

  $(window).resize(layoutGrid)
  layoutGrid()
})

function layoutGrid() {
  cWidth = $content.width()
  cHeight = $content.height()
  const aspect = cWidth/cHeight

  if (aspect < 1) {
    cWidth = maxPixels*aspect
    cHeight = maxPixels
  } else {
    cHeight = maxPixels/aspect
    cWidth = maxPixels
  }
  $canvas.attr({height:cHeight, width:cWidth})

  drawGrid()
}

function drawGrid() {
  const width = Math.ceil(cWidth/(2*(xDelta+outerBorder)))
  const height = Math.floor(cHeight/(yDelta+2*outerBorder))

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width-j%2; i++) {
      drawHex(j, i, randColor());
    }
  }
}

function drawHex(row, col, color) {
  const rotation = Math.PI/6

  drawPolygon(ctx, 
              (xDelta+outerBorder/2)*(2*col+1+row%2)+outerBorder/2,
              (yDelta+outerBorder)*row+hexRadius+outerBorder,
              6, hexRadius,
              {style:'fill', color:color, rotation:rotation})

  if (innerBorder > 0) {
    drawPolygon(ctx, 
                (xDelta+outerBorder/2)*(2*col+1+row%2)+outerBorder/2,
                (yDelta+outerBorder)*row+hexRadius+outerBorder,
                6, hexRadius-innerBorder/1.8,
                {style:'stroke', weight:innerBorder,
                 color:'rgba(0,0,0,.15)', rotation:rotation})
  }
}

function randColor() {
  return hexColors[Math.floor(Math.random()*hexColors.length)]
}
