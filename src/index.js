import './index.less';
import './mobile.less';
import '../img/elana.jpg';
import loremIpsum from './lorem.js';

/** constants **/

const COLOR_CLASSES = ['red', 'yellow', 'green', 'blue', 'purple'];

const INNER_BORDER = 4; // Should always match stroke-width for .hex class
const HEX_SIZE_DESKTOP = 44;
const HEX_SIZE_MOBILE_LANDSCAPE = 36;
const HEX_SIZE_MOBILE_PORTRAIT = 60;

/** global variables **/

let $svgHexes;
let svgWidth, svgHeight;

let hexRadius, hexWidth, hexHeight;

let grid, rowHeights;
let offsetX, offsetY;

let isMobile;
let lastResize;

let currentPage = 0;

/** setup functions **/

$(document).ready(() => {
    $svgHexes = $('#svg-hexes');
    $('.section-content').html(loremIpsum);

    configDevice();
    generateGrid();

    setupSvg();
    scrollSvgHexes(false);
    startSvgSequencing();

    hookEvents();
})

function hookEvents() {
    $('.page:nth-child(1)').on('mousemove', (e) => {
        // Find target for mousemove over obscured layer; equivalent to
        // $('body').on('mousemove', 'polygon.outlined:not(.moving, .hole)',...)
        const hex = document
            .elementsFromPoint(e.clientX, e.clientY)
            .filter(({tagName, classList}) =>
                tagName === 'polygon' &&
                classList.contains('outlined') &&
                !classList.contains('moving') &&
                !classList.contains('hole')
            );
        if (!hex.length) return;

        const $hex = $(hex[0]);
        const [row, col] = getCoordsForHex($hex);

        const neighboringHoles = getNeighbors(row, col, true);
        const holeCoords = randItem(neighboringHoles);

        if (holeCoords) {
            moveSvgHex([row, col], holeCoords);
        }
    });

    $('#page-container').on('scroll', () => scrollSvgHexes());

    $(window).on('resize', () => {
        const DEBOUNCE_DURATION = 500;

        const resize = () => {
            configDevice();
            generateGrid();

            clearSvg();
            setupSvg();
            scrollSvgHexes(false);
        }

        const wasMobile = isMobile;
        if (wasMobile || isMobileDevice()) {
             // Don't debounce when rotating mobile device
            setTimeout(resize, 0);
        } else {
            lastResize = Date.now();
            setTimeout(() => {
                if (Date.now() - lastResize < DEBOUNCE_DURATION) return;
                resize();
            }, DEBOUNCE_DURATION);
        }
    });

    $('#name').on('click', () => {
        scrollToPage(0);
    });
    $('#sections a').on('click', (e) => {
        const idx = $(e.target).index();
        scrollToPage(idx + 1); // (0th page is the intro, not a section)
    });
}

function setupSvg() {
    rowHeights = [];
    grid.forEach((row, i) => {
        row.forEach((hex, j) => {
            const center = centerForCoords(i, j, true);
            if (!rowHeights[i]) rowHeights.push(Math.round(center[1])); // Index row heights to optimize scroll animations

            const $hex = drawSvgHex(center, hex);
            $hex.attr({'data-row': i, 'data-col': j});
            if (!hex.hole) {
                $hex.attr('data-color', hex.color);
            }

            Object.assign(hex, {$hex});
        });
    });
}

/** resize functions */

function configDevice() {
    isMobile = isMobileDevice();

    // Trick for actual full-height layout on mobile
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)

    svgWidth = $svgHexes.innerWidth()
    svgHeight = $svgHexes.innerHeight()
    const aspect = svgWidth / svgHeight

    const $body = $('body');
    $body.removeClass('mobile landscape portrait');

    if (!isMobile) {
        setHexSize(HEX_SIZE_DESKTOP);
    } else {
        setHexSize(aspect < 1 ? HEX_SIZE_MOBILE_PORTRAIT : HEX_SIZE_MOBILE_LANDSCAPE);
        $body.addClass(`mobile ${aspect < 1 ? 'portrait' : 'landscape'}`);
    }
}

function setHexSize(size) {
    hexRadius = size;
    hexWidth = 2 * hexRadius * Math.cos(Math.PI / 6);
    hexHeight = hexRadius * (1 + Math.sin(Math.PI / 6));
}

/** grid functions **/

function generateGrid() {
    const width = Math.floor((svgWidth - hexWidth / 4) / hexWidth);
    const height = Math.floor((svgHeight - hexHeight / 4) / hexHeight);

    const HOLES_PERCENT = .2;

    grid = [];
    for (let i = 0; i < height; i++) {
        let row = [];

        for (let j = 0; j < width - i % 2; j++) {
            let newHex;

        if (Math.random() > 1 - HOLES_PERCENT) {
                newHex = {hole: true};
            } else {
                newHex = {color: randColorClass()};
            }

            row.push(newHex);
        }
        grid.push(row);
    }

    // Update offsets (for centering) based on new grid dimensions
    offsetX = (svgWidth - hexWidth * (width - 1)) / 2;
    offsetY = (svgHeight - hexHeight * (height - 1)) / 2;
}

function getHexForCoords(coords) {
    return grid[coords[0]][coords[1]]
}


function getCoordsForHex($hex) {
    return [
        parseInt($hex.attr('data-row')),
        parseInt($hex.attr('data-col'))
    ];
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
        const hex = getHexForCoords(n);
        if (hex.isStatic) return false;
        if (getHoles) return hex.hole;
        else return !hex.hole && !hex.$hex.hasClass('moving');
    });
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

/** geometry functions **/

function centerForCoords(row, col) {
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

/** render functions **/

function createSvg(element) {
    return document.createElementNS('http://www.w3.org/2000/svg', element);
}

function clearSvg() {
    $svgHexes.find('g, polygon').remove();
}

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

function drawSvgHex([x, y], hex) {
    const path = getHexPath(x, y, hexRadius);
    return $(createSvg('polygon'))
        .attr('points', path.map((p) => `${p.x},${p.y}`).join(' '))
        .addClass(`hex ${hex.hole ? 'hole' : hex.color}`)
        .css({'transform-origin': `${x}px ${y}px`})
        .appendTo($svgHexes);
}

function updateSvgHex(hex, [newRow, newCol]) {
    const [newX, newY] = centerForCoords(newRow, newCol, true);
    const newPath = getHexPath(newX, newY, hexRadius);

    hex.$hex
        .css({
            transition: 'none',
            transform:  `scale(${getDefaultScale(hex)})`,
            'transform-origin': `${newX}px ${newY}px`,
        })
        .attr({
            'points': newPath.map((p) => `${p.x},${p.y}`).join(' '),
            'data-row': newRow,
            'data-col': newCol,
        });
    setTimeout(() => hex.$hex.css('transition', ''), 350);
}

function getDefaultScale({$hex}) {
    if ($hex.hasClass('outlined')) return .8;
    return hexWidth / (INNER_BORDER - 1 + hexWidth);
}

/** actions **/

function scrollSvgHexes(doAnimate = true) {
    const windowHeight = window.innerHeight;
    let maxVisible = 0, maxIdx = 0;
    $('.page').each((pageIdx, page) => {
        const $page = $(page);

        const height = $page.outerHeight();
        const top = $page.offset().top;
        const bottom = top + height;

        const visibleAmount = constrainValue(bottom, 0, windowHeight) - constrainValue(top, 0, windowHeight);
        if (visibleAmount > 0) {
            const color = getColorClass($page);
            rowHeights.forEach((rowHeight, rowIdx) => {
                if (rowHeight < bottom && rowHeight > top) setRowColor(rowIdx, pageIdx, color, doAnimate);
            })

            if (visibleAmount > maxVisible) {
                maxVisible = visibleAmount;
                maxIdx = pageIdx;
            }
        }
    });

    if (maxIdx !== currentPage) {
        currentPage = maxIdx;
        $('#sections a').removeClass('active');
        if (currentPage > 0) $(`#sections a:nth-child(${currentPage})`).addClass('active');
    }
}

function setRowColor(rowIdx, pageIdx, color, doAnimate) {
    const allColors = COLOR_CLASSES.join(' ');
    grid[rowIdx].forEach((hex) => {
        const {$hex} = hex;
        const currentPage = $hex.attr('data-page');
        if (currentPage && currentPage === pageIdx) return; // Row has already been set

        $hex.attr('data-page', pageIdx);
        $hex.toggleClass('no-animation', !doAnimate);

        // Handle color

        const colorClass = (pageIdx > 0) ? color : `${hex.color} outlined`;
        $hex.removeClass(`${allColors} outlined`).addClass(colorClass);

        // Handle transform

        const effectiveIdx = hex.hole ? Math.max(pageIdx - 1, 0) : pageIdx;
        const rotation = `rotate3d(1, 0, 0, ${180 * effectiveIdx}deg) `;
        const scale = `scale(${getDefaultScale(hex)})`;
        $hex.css('transform', rotation + scale);

        // Handle animatinos

        hex.isStatic = pageIdx > 0;
    });
}

function moveSvgHex(hexCoords, holeCoords) {
    const hexCenter = centerForCoords(...hexCoords, true);
    const holeCenter = centerForCoords(...holeCoords, true);

    const deltaX = hexCenter[0] - holeCenter[0];
    const deltaY = hexCenter[1] - holeCenter[1];

    const hex = getHexForCoords(hexCoords);
    hex.$hex
        .addClass('moving') // Prevent further interaction until animation complete
        .css('transform', `translate(${-deltaX / 2}px, ${-deltaY / 2}px) scale(${getDefaultScale(hex) * .6})`);

    // Delay other hexes from moving into this hole while first hex is still leaving
    const hole = getHexForCoords(holeCoords);
    hole.isStatic = true;

    // Swap hole & hex in grid
    const [hexRow, hexCol] = hexCoords;
    const [holeRow, holeCol] = holeCoords;
    [grid[hexRow][hexCol], grid[holeRow][holeCol]] = [grid[holeRow][holeCol], grid[hexRow][hexCol]];

    setTimeout(() => {
        hex.$hex.css('transform', `translate(${-deltaX}px, ${-deltaY}px) scale(${getDefaultScale(hex)})`);
        hole.isStatic = false;
    }, 200);
    setTimeout(() => {
        hex.$hex.removeClass('moving');

        // Update actual SVG path, clear transformation
        updateSvgHex(hex, holeCoords);
        updateSvgHex(hole, hexCoords);
    }, 700);
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
    }, 500);
}

function scrollToPage(pageIdx) {
    const $pageContainer = $('#page-container');
    const currentScroll = $pageContainer.scrollTop();

    const $page = $(`.page:nth-child(${pageIdx + 1})`);
    const targetScroll = $page.offset().top + currentScroll;

    const scrollDelta = Math.abs(currentScroll - targetScroll);
    $pageContainer.animate({scrollTop: targetScroll}, scrollDelta * 2.5); // ensure constant scroll speed, regardless of scroll amount
}

/**  helper functions **/

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

function constrainValue(val, min, max) {
    if (typeof min === 'number') {
        val = Math.max(val, min);
    } if (typeof max === 'number') {
        val = Math.min(val, max);
    }
    return val;
}

function randItem(list, remove) {
    if (!list.length) return false

    const index = Math.floor(Math.random() * list.length)
    const item = list[index]

    if (remove) list.splice(index, 1)
    return item
}

function randColorClass() {
    return randItem(COLOR_CLASSES);
}

function getColorClass($el) {
    const validColors = $el.attr('class').split(' ').filter((color) => COLOR_CLASSES.includes(color));
    if (validColors.length) return validColors[0];
}