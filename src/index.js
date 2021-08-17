import './index.less';
import './mobile.less';
import loremIpsum from './lorem.js';

const colorClasses = ['red', 'yellow', 'green', 'blue', 'purple'];

/** config **/

const HOLES_PERCENT = .2 // percent

const MAX_PIXELS = 1000
const MIN_PIXELS = 600

const HEX_BORDER_PERCENT = .2;
const HEX_SCALE = 1 / (1 + HEX_BORDER_PERCENT / 2); // maintain constant overall hex size, regardless of border width

const DEBOUNCE_DURATION = 500;

/** global variables **/

let $svgHexes, $content;

let cWidth, cHeight;
let isMobile;

let outerBorder;
let hexRadius, hexWidth, hexHeight;

let grid;
let borderCols, borderRows;
let offsetX, offsetY;

let lastResize;

/** setup **/

$(document).ready(() => {
    window.scrollTo(0, 1); // fullscreen hack

    $svgHexes = $('#svg-hexes');
    $content = $('#content');

    $('#page').html(loremIpsum);

    $(window).on('resize', () => {
        const resize = () => {
            resizeCanvas();
            generateGrid();

            clearSvg();
            setupSvg();

            if ($content.hasClass('page-view')) {
                spinSvgHexes(getColorClass($('.selected')), false);
            }
        }

        const wasMobile = isMobile;
        configDevice();

        if (wasMobile || isMobile) {
            resize(); // Don't debounce when rotating mobile device
        } else {
            lastResize = Date.now();
            setTimeout(() => {
                if (Date.now() - lastResize < DEBOUNCE_DURATION) return;
                resize();
            }, DEBOUNCE_DURATION);
        }
    });

    configDevice();

    resizeCanvas();
    generateGrid();

    setupSvg();
    startSvgSequencing();

    hookEvents();
    $content.addClass('loaded');
})

function hookEvents() {
    $('.btn').on('click', (e) => {
        if ($content.hasClass('page-view') || $('.btn.moving').length) return; // Don't load new page if previous page still loaded or fading out
        e.stopPropagation();

        const colorClass = getColorClass($(e.currentTarget));
        spinSvgHexes(colorClass);

        $('#page-wrapper').scrollTop(0);
        $content.addClass('page-view');
        $(e.currentTarget).addClass('selected moving');
    });

    $('body, .selected').on('click', () => {
        if (!$content.hasClass('page-view') || $('.hex:not(.spin, .filler)').length) return; // Don't return back to home if some hexes still spinning

        $content.removeClass('page-view');
        $('.selected').removeClass('selected');

        // This class deactivates animations, and applies additional CSS transitions, while button is moving
        const moveDuration = 1750; // Don't remove class until after move has completed; sync this value with .btn.moving styles
        setTimeout(() => $('.moving').removeClass('moving'), moveDuration);

        spinSvgHexes()
    });

    $('body').on('mouseover', '.hex:not(.moving, .spin, .filler)', (e) => {
        const $hex = $(e.target);

        const row = parseInt($hex.attr('data-row'));
        const col = parseInt($hex.attr('data-col'));

        const neighboringHoles = getNeighbors(row, col, true);
        const holeCoords = randItem(neighboringHoles);

        if (holeCoords) {
            moveSvgHex([row, col], holeCoords);
        }
    });
}

function configDevice() {
    isMobile = isMobileDevice();

    if (!isMobile) {
        outerBorder = 3.6
        setHexSize(22)

        $('body').removeClass('mobile landscape portrait')
    } else {
        outerBorder = 5
        setHexSize(33)

        $('body').addClass('mobile')
    }
}

function setHexSize(size) {
    hexRadius = size

    const xDelta = hexRadius * Math.cos(Math.PI / 6)
    const yDelta = hexRadius * (1 + Math.sin(Math.PI / 6))

    hexWidth = xDelta * 2 + outerBorder
    hexHeight = yDelta + outerBorder
}

function resizeCanvas() {
    if (isMobile) {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    cWidth = $svgHexes.width()
    cHeight = $svgHexes.height()
    const aspect = cWidth / cHeight

    if (aspect < 1) {
        const pixels = Math.max(MIN_PIXELS, Math.min(cHeight, MAX_PIXELS))
        cWidth = pixels * aspect
        cHeight = pixels

        if (isMobile) {
            $('body')
                .removeClass('landscape')
                .addClass('portrait')
        }
    } else {
        let pixels = Math.max(MIN_PIXELS, Math.min(cWidth, MAX_PIXELS))
        cHeight = pixels / aspect
        cWidth = pixels

        if (isMobile) {
            $('body')
                .removeClass('portrait')
                .addClass('landscape')
        }
    }

    $svgHexes.attr('viewBox', `0 0 ${cWidth} ${cHeight}`);

    const scale = cHeight / $svgHexes.height();
    borderCols = Math.max(Math.floor((cWidth - 500 * scale) / (hexRadius * 5)), 1)
    borderRows = Math.max(Math.floor((cHeight - 275 * scale) / (hexRadius * 5.5)), 1)
}

function generateGrid() {
    let width = Math.floor(cWidth / hexWidth)
    let height = Math.floor(cHeight / (hexHeight + outerBorder / 3))

    grid = []
    for (let i = 0; i < height; i++) {
        let row = []

        for (let j = 0; j < width - i % 2; j++) {

            let newHex

            if (!isMobile && (
                (i >= borderRows && i <= height - borderRows - 1) &&
                (j >= borderCols && j <= width - borderCols - i % 2 - 1)
            )) {
                newHex = generateFiller()
            }
            else if (Math.random() > 1 - HOLES_PERCENT) {
                newHex = generateHole()
            } else {
                newHex = generateHex()
            }

            row.push(newHex)
        }

        grid.push(row)
    }

    // Update offsets (for centering) based on new grid dimensions
    offsetX = (cWidth - hexWidth * (grid[0].length - 1)) / 2,
    offsetY = (cHeight - hexHeight * (grid.length - 1)) / 2
}

/** draw methods **/

function getHexPath(x, y, size, spin) {
    const rotation = Math.PI / 6
    const path = []

    for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3 + rotation

        let ptY = y + size * Math.sin(angle)
        let ptX = x + size * Math.cos(angle)

        if (spin) {
            if (ptX > x + .01) {
                ptY = y + (ptY - y) * (1 - Math.sin(spin) * .25)
            } else if (ptX < x - .01) {
                ptY = y + (ptY - y) * (.25 * Math.sin(spin) + 1)
            }
            ptX = x + (ptX - x) * Math.cos(spin)

        }

        path.push({ x: ptX, y: ptY })
    }
    return path
}

/** SVG methods **/

function createSvg(element) {
    return document.createElementNS('http://www.w3.org/2000/svg', element);
}

function clearSvg() {
    $svgHexes.find('g, polygon').remove();
}

function drawSvgHex([x, y], color) {
    const path = getHexPath(x, y, hexRadius);
    return $(createSvg('polygon'))
        .attr('points', path.map((p) => `${p.x},${p.y}`).join(' '))
        .addClass(`hex ${color}`)
        .css({
            'stroke-width': hexRadius * HEX_BORDER_PERCENT,
            transform:  `scale(${getDefaultScale(color)})`,
            'transform-origin': `${x}px ${y}px`,
        })
        .appendTo($svgHexes);
}

function getDefaultScale(color) {
    if (color === 'filler' || isMobile) return 1;
    else return HEX_SCALE;
}

function updateSvgHex($hex, [newRow, newCol]) {
    const [newX, newY] = centerForCoords(newRow, newCol, true);
    const newPath = getHexPath(newX, newY, hexRadius);

    $hex
        .css({
            transition: 'none',
            transform:  `scale(${getDefaultScale()})`,
            'transform-origin': `${newX}px ${newY}px`,
        })
        .attr({
            'points': newPath.map((p) => `${p.x},${p.y}`).join(' '),
            'data-row': newRow,
            'data-col': newCol,
        });
    setTimeout(() => $hex.css('transition', ''), 350);
}

function moveSvgHex(hexCoords, holeCoords) {
    const hexCenter = centerForCoords(...hexCoords, true);
    const holeCenter = centerForCoords(...holeCoords, true);

    const deltaX = hexCenter[0] - holeCenter[0];
    const deltaY = hexCenter[1] - holeCenter[1];

    const {$hex} = hexForCoords(hexCoords);
    $hex
        .addClass('moving') // Prevent further interaction until animation complete
        .css('transform', `translate(${-deltaX / 2}px, ${-deltaY / 2}px) scale(${HEX_SCALE * .6})`);

    // Delay other hexes from moving into this hole while first hex is still leaving
    const hole = hexForCoords(holeCoords);
    hole.isStatic = true;

    // Swap hole & hex in grid
    const [hexRow, hexCol] = hexCoords;
    const [holeRow, holeCol] = holeCoords;
    [grid[hexRow][hexCol], grid[holeRow][holeCol]] = [grid[holeRow][holeCol], grid[hexRow][hexCol]];

    setTimeout(() => {
        $hex.css('transform', `translate(${-deltaX}px, ${-deltaY}px) scale(${getDefaultScale()})`);
        hole.isStatic = false;
    }, 200);
    setTimeout(() => {
        $hex.removeClass('moving');
        updateSvgHex($hex, holeCoords); // Update actual SVG path, clear transformation
    }, 700);
}

function setupSvg() {
    setHexSize(hexRadius);

    const $fillers = [];
    grid.forEach((row, i) => {
        row.forEach((hex, j) => {
            if (hex.hole) return;

            const center = centerForCoords(i, j, true);
            const $hex = drawSvgHex(center, hex.color);
            $hex.attr({'data-row': i, 'data-col': j});
            Object.assign(hex, {$hex});

            if (hex.filler) $fillers.push($hex);
        });
    });

    // Group fillers together for smoother fading, using parent element
    const $fillerGroup = $(createSvg('g')).attr('id', 'fillers');
    $fillers.forEach(($filler) => $filler.detach().appendTo($fillerGroup));
    $fillerGroup.appendTo($svgHexes);
}

function startSvgSequencing() {
    setInterval(() => {
        const holes = getHoles();
        let hole, hex;
        while (holes.length && !(hole && hex)) {
            hole = randItem(holes, true);
            if (!hole) return;

            const neighbors = getNeighbors(...hole.coords);
            if (neighbors.length) {
                hex = randItem(neighbors);
            }
        }
        if (hex && hole) moveSvgHex(hex, hole.coords);
    }, 600);
}

/** actions **/

function spinSvgHexes(color, doAnimate = true) {
    const forwards = Boolean(color);
    const origin = centerForCoords(...(forwards ? [0, 0] : [grid.length, grid[grid.length - 1].length]));

    grid.forEach((row, i) => {
        row.forEach((hex, j) => {
            if (hex.hole) return

            const {$hex} = hex;
            const allColors = colorClasses.join(' ');

            if (hex.filler) {
                if (forwards) {
                    $hex.removeClass(allColors).addClass(color);
                }
                return;
            }

            if (forwards) hex.isStatic = true; // Halt other animations

            const center = centerForCoords(i, j)
            const dist = getDist(origin, center, true)

            setTimeout(() => {
                $hex.removeClass(`spin ${allColors} no-animation`); // Reset all color & animation classes
                if (forwards) {
                    $hex.addClass(`spin ${color}${doAnimate ? '' : ' no-animation'}`);
                } else {
                    hex.isStatic = false; // Resume animations
                    $hex.addClass(hex.color);
                }
            }, dist * (doAnimate ? 1.1 : 0));
        })
    });

    $('#fillers').toggleClass('show', forwards);
}

/**  helper methods **/

function isMobileDevice() {
    return (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ) ? true : false
}

function randItem(list, remove) {
    if (!list.length) return false

    const index = Math.floor(Math.random() * list.length)
    const item = list[index]

    if (remove) list.splice(index, 1)
    return item
}

function randColorClass() {
    return randItem(colorClasses);
}

function getColorClass($el) {
    const allColors = colorClasses.join(' ');
    const validColors = $el.attr('class').split(' ').filter((color) => colorClasses.includes(color));
    if (validColors.length) return validColors[0];
}

function centerForCoords(row, col, usingSvg = false) {
    const centerX = hexWidth * (col + .5 * (row % 2));
    const centerY = hexHeight * row;

    return [centerX + offsetX, centerY + offsetY];
}

function getDist(p1, p2, manhattan) {
    let dist
    if (manhattan) {
        dist = Math.abs(p2[1] - p1[1]) + Math.abs(p2[0] - p1[0])
    } else {
        dist = Math.sqrt(
            Math.pow(p2[0] - p1[0], 2) +
            Math.pow(p2[1] - p1[1], 2))
    }
    return dist
}

function generateHex() {
    return {
        color: randColorClass(),
    }
}

function generateHole() {
    return {
        hole: true,
    }
}

function generateFiller() {
    return {
        color: 'filler',
        filler: true,
        isStatic: true,
    }
}

function getHoles() {
    return grid.reduce((a, b, i) => {
        return a.concat(b.filter((h, j) => {
            if (h.hole && !h.isStatic) {
                h.coords = [i, j]
                return h
            }
        }))
    }, [])
}

function hexForCoords(coords) {
    return grid[coords[0]][coords[1]]
}

function getNeighbors(row, col, getHoles) {
    const neighbors = []
    if (col > 0) {
        neighbors.push([row, col - 1])
    }
    if (col < grid[row].length - 1) {
        neighbors.push([row, col + 1])
    }

    if (row > 0) {
        if (row % 2) { // short rows
            neighbors.push([row - 1, col])
            neighbors.push([row - 1, col + 1])
        } else { // long rows
            if (col < grid[row].length - 1) {
                neighbors.push([row - 1, col])
            }
            if (col > 0) {
                neighbors.push([row - 1, col - 1])
            }
        }
    }

    if (row < grid.length - 1) {
        if (row % 2) { // short rows
            neighbors.push([row + 1, col])
            neighbors.push([row + 1, col + 1])
        } else { // long rows
            if (col < grid[row].length - 1) {
                neighbors.push([row + 1, col])
            }
            if (col > 0) {
                neighbors.push([row + 1, col - 1])
            }
        }
    }

    return neighbors.filter((n) => {
        const hex = hexForCoords(n);
        if (hex.isStatic) return false;
        if (getHoles) return hex.hole;
        else return !hex.hole && !hex.$hex.hasClass('moving');
    });
}