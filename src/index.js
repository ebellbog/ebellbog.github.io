import './index.less';
import './mobile.less';

import HexGrid from './components/hexGrid.js';
import HexTimeline from './components/hexTimeline';
import HexGallery from './components/hexGallery';

import engTimelineData from './data/engineeringTimeline';
import megaMazeGalleryData from './data/megaMazeGallery';
import loremIpsum from './lorem.js';

let hexGrid;

$(document).ready(() => {
    $('.page-content').append(`<div>${loremIpsum}</div>`);

    new HexTimeline($('#eng-timeline'), engTimelineData);
    new HexGallery($('#mega-maze-gallery'), megaMazeGalleryData);
    hexGrid = new HexGrid($('#svg-hexes'));

    setupNavbar();
    hookEvents();

    let {location: {hash}} = window, $el;
    if (hash && ($el = $(hash)).length) scrollToElement($el);
});

function setupNavbar() {
    const $pageLinks = $('#page-links');
    $('.page-header').each((idx, header) => {
        const $newLink = $('<a>').html($(header).html());
        $pageLinks.append($newLink);
    });
}

function hookEvents() {
    $('#name').on('click', () => {
        scrollToPage(0);
    });
    $('#page-links a').on('click', (e) => {
        const idx = $(e.target).index();
        scrollToPage(idx + 1); // (0th page is the intro, not a section)
    });
    $('#modal-viewer').on('click', () => {
        $('body').removeClass('show-modal');
    })
}

function scrollToPage(pageIdx, doAnimate) {
    const $page = $(`.page:nth-child(${pageIdx + 1})`);
    scrollToElement($page, doAnimate);
}

function scrollToElement($el, doAnimate) {
    const $pageContainer = $('#page-container');
    const currentScroll = $pageContainer.scrollTop();

    const targetScroll = $el.offset().top + currentScroll;

    if (doAnimate) {
        const scrollDelta = Math.abs(currentScroll - targetScroll);
        $pageContainer.animate({scrollTop: targetScroll}, scrollDelta * 2.5); // ensure constant scroll speed, regardless of scroll amount
    } else {
        $('#page-container').off('scroll');

        $pageContainer.scrollTop(targetScroll);
        hexGrid.scrollSvgHexes(false);

        $('#page-container').on('scroll', () => hexGrid.scrollSvgHexes());
    }

}