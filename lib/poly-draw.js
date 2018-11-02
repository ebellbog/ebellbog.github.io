function getPolyPath(x, y, sides, size, rotateZ, rotateY, starred) {
  const rotation = rotateZ || (Math.PI-(Math.PI*2/sides))/2
  const path = []

  if (starred) sides = sides*2
  for (let i = 0; i < sides; i++) {
    const dist = starred ? (i%2 ? size/2 : size) : size
    const angle = (Math.PI*2/sides)*i + rotation

    let ptY = y+dist*Math.sin(angle)
    let ptX = x+dist*Math.cos(angle)

    if (rotateY) {
      if (ptX > x+.01) {
        ptY = y+(ptY-y)*(1-Math.sin(rotateY)*.25)
      } else if (ptX < x-.01) {
        ptY = y+(ptY-y)*(.25*Math.sin(rotateY)+1)
      }
      ptX = x+(ptX-x)*Math.cos(rotateY)

    }

    path.push({x: ptX, y:ptY})
  }
  return path
}

function drawPolygon(ctx, x, y, sides, size, options) {
  options = options || {}

  const path = getPolyPath(x, y, sides, size, options.rotateZ, options.rotateY, options.starred)
  const start = path.shift()

  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  path.map(p => ctx.lineTo(p.x, p.y))
  ctx.closePath()

  if (options.style=='fill') {
    if(options.color) ctx.fillStyle=options.color
    ctx.fill()
  } else {
    if(options.color) ctx.strokeStyle=options.color
    if(options.weight) ctx.lineWidth=options.weight
    ctx.stroke()
  }
}
