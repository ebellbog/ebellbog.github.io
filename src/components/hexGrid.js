import './hexGrid.less';
import { constrainValue, createSvg, isMobileDevice, randItem } from '../util';

/** constants **/

const HEX_SIZE_DESKTOP = 44;
const HEX_SIZE_MOBILE_LANDSCAPE = 50;
const HEX_SIZE_MOBILE_PORTRAIT = 85;

const COLOR_CLASSES = ['red', 'yellow', 'green', 'blue', 'purple', 'gray'];

/** global variables **/

let hexRadius, hexWidth, hexHeight;

let grid, rowHeights;
let offsetX, offsetY;

let lastResize;
let wasMobile = isMobileDevice();

let currentPage = 0;

function randColorClass() {
    return randItem(COLOR_CLASSES.slice(0, -1)); // exclude gray
}

function getColorClass($el) {
    const validColors = $el.attr('class').split(' ').filter((color) => COLOR_CLASSES.includes(color));
    if (validColors.length) return validColors[0];
}

class HexGrid {
    constructor($el) {
        this.$svgHexes = $el;

        this.configDevice();
        this.generateGrid();

        this.setupSvg();
        this.scrollSvgHexes(false);
        this.startSvgSequencing();

        this.hookEvents();
    }

    setupSvg() {
        rowHeights = [];
        grid.forEach((row, i) => {
            row.forEach((hex, j) => {
                const center = this.centerForCoords(i, j, true);
                if (!rowHeights[i]) rowHeights.push(Math.round(center[1])); // Index row heights to optimize scroll animations

                const $hex = this.drawSvgHex(center, hex);
                $hex.attr({'data-row': i, 'data-col': j});
                if (!hex.hole) {
                    $hex.attr('data-color', hex.color);
                }

                Object.assign(hex, {$hex});
            });
        });
    }

    hookEvents() {
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
            const [row, col] = this.getCoordsForHex($hex);

            const neighboringHoles = this.getNeighbors(row, col, true);
            const holeCoords = randItem(neighboringHoles);

            if (holeCoords) {
                this.moveSvgHex([row, col], holeCoords);
            }
        });

        $(window).add('#page-container').on('scroll', () => this.scrollSvgHexes());
        $(window).on('resize-component', () => this.resizeGrid());
    }

    /** resize functions */

    resizeGrid() {
        const DEBOUNCE_DURATION = 500;

        const resize = () => {
            this.configDevice();
            this.generateGrid();

            this.clearHexes();
            this.setupSvg();
            this.scrollSvgHexes(false);
        }

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

        wasMobile = isMobileDevice();
    }

    configDevice() {
        const $body = $('body');
        if ($body.hasClass('mobile')) {
            this.setHexSize($body.hasClass('portrait') ? HEX_SIZE_MOBILE_PORTRAIT : HEX_SIZE_MOBILE_LANDSCAPE);
        } else {
            this.setHexSize(HEX_SIZE_DESKTOP);
        }
    }

    setHexSize(size) {
        hexRadius = size;
        hexWidth = 2 * hexRadius * Math.cos(Math.PI / 6);
        hexHeight = hexRadius * (1 + Math.sin(Math.PI / 6));
    }

    /** grid functions **/

    generateGrid() {
        const svgWidth = this.$svgHexes.innerWidth();
        const svgHeight = this.$svgHexes.innerHeight();

        const mathFunc = (wasMobile) ? Math.round : Math.floor;
        let width = mathFunc((svgWidth - (wasMobile ? 0 : hexWidth / 4)) / hexWidth);
        let height = Math.floor((svgHeight - (wasMobile ? 0 : hexHeight / 4)) / hexHeight);

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

    getHexForCoords(coords) {
        return grid[coords[0]][coords[1]]
    }


    getCoordsForHex($hex) {
        return [
            parseInt($hex.attr('data-row')),
            parseInt($hex.attr('data-col'))
        ];
    }

    getNeighbors(row, col, getHoles) {
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
            const hex = this.getHexForCoords(n);
            if (hex.isStatic) return false;
            if (getHoles) return hex.hole;
            else return !hex.hole && !hex.$hex.hasClass('moving');
        });
    }

    getHoles() {
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

    centerForCoords(row, col) {
        const centerX = hexWidth * (col + .5 * (row % 2));
        const centerY = hexHeight * row;

        return [centerX + offsetX, centerY + offsetY];
    }

    /** render functions **/

    clearHexes() {
        this.$svgHexes.find('g, polygon').remove();
    }

    getHexPath(x, y, size, spin) {
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

    drawSvgHex([x, y], hex) {
        const path = this.getHexPath(x, y, hexRadius);
        return $(createSvg('polygon'))
            .attr('points', path.map((p) => `${p.x},${p.y}`).join(' '))
            .addClass(`hex ${hex.hole ? 'hole' : hex.color}`)
            .css({'transform-origin': `${x}px ${y}px`})
            .appendTo(this.$svgHexes);
    }

    updateSvgHex(hex, [newRow, newCol]) {
        const [newX, newY] = this.centerForCoords(newRow, newCol, true);
        const newPath = this.getHexPath(newX, newY, hexRadius);

        hex.$hex
            .css({
                transition: 'none',
                transform:  `scale(${this.getDefaultScale(hex)})`,
                'transform-origin': `${newX}px ${newY}px`,
            })
            .attr({
                'points': newPath.map((p) => `${p.x},${p.y}`).join(' '),
                'data-row': newRow,
                'data-col': newCol,
            });
        setTimeout(() => hex.$hex.css('transition', ''), 350);
    }

    getDefaultScale({$hex}) {
        if ($hex.hasClass('outlined')) return .8;
        return hexWidth / (parseInt($hex.css('stroke-width')) * .7 + hexWidth);
    }

    /** actions **/

    scrollSvgHexes(doAnimate = true) {
        const {innerHeight: windowHeight, scrollY} = window;
        let maxVisible = 0, maxIdx = 0;
        $('.page').each((pageIdx, page) => {
            const $page = $(page);

            const height = $page.outerHeight();
            let top = $page.offset().top - scrollY;
            const bottom = top + height;

            const visibleAmount = constrainValue(bottom, 0, windowHeight) - constrainValue(top, 0, windowHeight);
            if (visibleAmount > 0) {
                const color = getColorClass($page);
                rowHeights.forEach((rowHeight, rowIdx) => {
                    if (rowHeight < bottom && rowHeight > top) this.setRowColor(rowIdx, pageIdx, color, doAnimate);
                })

                if (visibleAmount > maxVisible) {
                    maxVisible = visibleAmount;
                    maxIdx = pageIdx;
                }
            }
        });

        if (maxIdx !== currentPage) {
            currentPage = maxIdx;

            $('.nav-link, .home-link').removeClass('active');
            if (currentPage > 0) {
                $(`.nav-link:nth-child(${currentPage + 1})`).addClass('active');
                if (!history.locked) history.replaceState(null, null, '#' + $(`.page:nth-child(${currentPage + 1})`).attr('id'));
            } else {
                $('.home-link').addClass('active');
                if (!history.locked) history.replaceState(null, null, '/');
            }
        }
    }

    setRowColor(rowIdx, pageIdx, color, doAnimate) {
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
            const scale = `scale(${this.getDefaultScale(hex)})`;
            $hex.css('transform', rotation + scale);

            // Handle animatinos

            hex.isStatic = pageIdx > 0;
        });
    }

    moveSvgHex(hexCoords, holeCoords) {
        const hexCenter = this.centerForCoords(...hexCoords, true);
        const holeCenter = this.centerForCoords(...holeCoords, true);

        const deltaX = hexCenter[0] - holeCenter[0];
        const deltaY = hexCenter[1] - holeCenter[1];

        const hex = this.getHexForCoords(hexCoords);
        hex.$hex
            .addClass('moving') // Prevent further interaction until animation complete
            .css('transform', `translate(${-deltaX / 2}px, ${-deltaY / 2}px) scale(${this.getDefaultScale(hex) * .6})`);

        // Delay other hexes from moving into this hole while first hex is still leaving
        const hole = this.getHexForCoords(holeCoords);
        hole.isStatic = true;

        // Swap hole & hex in grid
        const [hexRow, hexCol] = hexCoords;
        const [holeRow, holeCol] = holeCoords;
        [grid[hexRow][hexCol], grid[holeRow][holeCol]] = [grid[holeRow][holeCol], grid[hexRow][hexCol]];

        setTimeout(() => {
            hex.$hex.css('transform', `translate(${-deltaX}px, ${-deltaY}px) scale(${this.getDefaultScale(hex)})`);
            hole.isStatic = false;
        }, 200);
        setTimeout(() => {
            hex.$hex.removeClass('moving');

            // Update actual SVG path, clear transformation
            this.updateSvgHex(hex, holeCoords);
            this.updateSvgHex(hole, hexCoords);
        }, 700);
    }

    startSvgSequencing() {
        setInterval(() => {
            const holes = this.getHoles();
            let hole, hex;
            while (holes.length && !(hole && hex)) {
                hole = randItem(holes, true);
                if (!hole) return;

                const neighbors = this.getNeighbors(...hole.coords);
                if (neighbors.length) {
                    hex = randItem(neighbors);
                }
            }
            if (hex && hole) this.moveSvgHex(hex, hole.coords);
        }, 500);
    }
}

export default HexGrid;