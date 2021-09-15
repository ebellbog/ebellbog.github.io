import './index.less';
import './mobile.less';

import HexGrid from './components/hexGrid.js';
import HexTimeline from './components/hexTimeline';

import '../img/swat_logo.jpg';
import '../img/scopely_logo.jpg';
import '../img/techchange_logo.jpg';
import '../img/liwwa_logo.jpg';
import '../img/hiq_logo.jpg';

import engTimelineData from './data/engineeringTimeline';
import loremIpsum from './lorem.js';

$(document).ready(() => {
    $('.page-content').append(`<div>${loremIpsum}</div>`);

    new HexTimeline($('#eng-timeline'), engTimelineData);
    new HexGrid($('#svg-hexes'));

    hookEvents();
})

function hookEvents() {
    $('#name').on('click', () => {
        scrollToPage(0);
    });
    $('#page-links a').on('click', (e) => {
        const idx = $(e.target).index();
        scrollToPage(idx + 1); // (0th page is the intro, not a section)
    });
}

function scrollToPage(pageIdx) {
    const $pageContainer = $('#page-container');
    const currentScroll = $pageContainer.scrollTop();

    const $page = $(`.page:nth-child(${pageIdx + 1})`);
    const targetScroll = $page.offset().top + currentScroll;

    const scrollDelta = Math.abs(currentScroll - targetScroll);
    $pageContainer.animate({scrollTop: targetScroll}, scrollDelta * 2.5); // ensure constant scroll speed, regardless of scroll amount
}