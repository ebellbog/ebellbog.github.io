import './index.less';
import './mobile.less';

import HexGrid from './components/hexGrid';
import HexTimeline from './components/hexTimeline';
import HexGallery from './components/hexGallery';

import engTimelineData from './data/engineeringTimeline';
import megaMazeGalleryData from './data/megaMazeGallery';
import safeSpaceGalleryData from './data/safeSpaceGallery';

import { isMobileDevice } from './util';
import loremIpsum from './lorem.js';

let hexGrid;

$(document).ready(() => {
    $('.page-content').append(`<div>${loremIpsum}</div>`);

    setupNavbar();
    hookEvents();

    hexGrid = new HexGrid($('#svg-hexes'));

    new HexTimeline($('#eng-timeline'), engTimelineData);
    new HexGallery($('#safe-space-gallery'), safeSpaceGalleryData);
    new HexGallery($('#mega-maze-gallery'), megaMazeGalleryData);

    let {location: {hash}} = window, $el;
    if (hash && ($el = $(hash)).length) scrollToElement($el);
});

function setupNavbar() {
    const $pageLinks = $('#page-links');
    const $mobileNavBar = $('#mobile-nav-bar');

    $('.page-header').each((idx, header) => {
        const $newLink = $('<a>').addClass('nav-link').html($(header).html());
        $pageLinks.append($newLink);
        $mobileNavBar.append($newLink.clone());
    });
}

function hookEvents() {
    $('#name').on('click', () => {
        scrollToPage(0);
    });
    $('.nav-link').on('click', (e) => {
        const idx = $(e.target).index();
        scrollToPage(idx + 1); // (0th page is the intro, not a section)
    });

    const $body = $('body');

    $('#modal-viewer').on('click', () => {
        $body.removeClass('show-modal');
    });

    $('#mobile-nav-btn').on('click', (e) => {
        e.stopPropagation();
        $body.addClass('show-mobile-nav');
    });
    $body.on('click', (e) => {
        $body.removeClass('show-mobile-nav');
    });

    const resize = () => {
        // Trick for actual full-height layout on mobile
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        const $body = $('body');
        $body.removeClass('mobile landscape portrait');
        if (isMobileDevice()) {
            $body.addClass(`mobile ${window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'}`);
        }

        $(window).trigger('resize-component'); // Optional event for components, to execute resize logic after main resize handler
    }
    $(window).on('resize', () => setTimeout(() => resize(), 0)); // For some reason, this timeout is necessary to ensure user agent has already updated
    resize();
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
        $pageContainer.animate({scrollTop: targetScroll}, scrollDelta * 2.5); // Ensure constant scroll speed, regardless of scroll amount
    } else {
        $('#page-container').off('scroll');

        $pageContainer.scrollTop(targetScroll);
        hexGrid.scrollSvgHexes(false);

        $('#page-container').on('scroll', () => hexGrid.scrollSvgHexes());
    }

}