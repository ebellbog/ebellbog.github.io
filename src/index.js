import './index.less';
import './mobile.less';

import HexGrid from './components/hexGrid';
import HexTimeline from './components/hexTimeline';
import HexGallery from './components/hexGallery';

import engTimelineData from './data/engineeringTimeline';

import megaMazeGalleryData from './data/megaMazeGallery';
import safeSpaceGalleryData from './data/safeSpaceGallery';
import paintByGenderGalleryData from './data/paintByGenderGallery';
import justFiveGalleryData from './data/justFiveGallery';

import sanctumGalleryData from './data/sanctumGallery';
import mudfishGalleryData from './data/mudfishGallery';

import './data/hobbyDecals';
import '../img/tree_climber.png';
import '../img/hex_elana.png';
import '../img/og_image.jpg';

import {isMobileDevice, isChrome, isSafari, isIE} from './util';

let hexGrid;

if (isIE()) {
    alert('This browser made not be supported. Please try switching to a modern browser.');
}

$(document).ready(() => {
    setupNavbar();
    hookEvents();

    // Improve performance on Chrome by scrolling inside container div

    $('body').toggleClass('scroll-container', isChrome() && !isMobileDevice());
    $('body').toggleClass('no-shadow', isSafari());

    // Initialize components

    new HexTimeline($('#eng-timeline'), engTimelineData);

    new HexGallery($('#safe-space'), safeSpaceGalleryData);
    new HexGallery($('#mega-maze'), megaMazeGalleryData);
    new HexGallery($('#paint-by-gender'), paintByGenderGalleryData);
    new HexGallery($('#just-five-lights'), justFiveGalleryData);

    new HexGallery($('#sanctum'), sanctumGalleryData, {isDigital: false});
    new HexGallery($('#mudfish'), mudfishGalleryData, {isDigital: false});

    // All links open new tabs by default

    $('a:not(.nav-link)').attr('target', '_blank');

     // Give other components a chance to update layout before updating grid

    setTimeout(() => {
        hexGrid = new HexGrid($('#svg-hexes'));
        setScroll(); // Auto-scroll to URL target
    }, 0);
});

function setScroll() {
    history.scrollRestoration = 'manual'; // https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration

    let {location: {hash}} = window, $el;
    if (hash && ($el = $(hash)).length) {
        history.locked = true; // Don't update history until after scroll complete
        scrollToElement($el);
        history.locked = false;
    };
}

function setupNavbar() {
    const $pageLinks = $('#page-links');
    const $mobileNav = $('#mobile-nav-menu');

    $('.page-header').each((idx, header) => {
        const $newLink = $('<a>').addClass('nav-link').html($(header).html());
        $pageLinks.append($newLink);
        $mobileNav.append($newLink.clone());
    });

    $('<div class="social-links">').html($('#nav-bar .social-links').html()).appendTo($mobileNav);
    $('<div class="copyright">').html('&copy; Elana Bell Bogdan, 2022').appendTo($mobileNav);
}

function hookEvents() {
    $('.home-link').on('click', () => {
        scrollToPage(0, !isMobileDevice());
    });
    $('.nav-link').on('click', (e) => {
        const idx = $(e.target).index(); // (0th page is the intro, not a section)
        scrollToPage(idx, !isMobileDevice());
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
    const usingScrollContainer = $('body').hasClass('scroll-container');

    const $scrollParent = usingScrollContainer  ? $('#page-container') : $('html, body');
    const currentScroll = usingScrollContainer ? $scrollParent.scrollTop() : window.scrollY;
    const targetScroll = $el.offset().top + (usingScrollContainer ? currentScroll : 0);

    if (doAnimate) {
        const scrollDelta = Math.abs(currentScroll - targetScroll);
        $scrollParent.animate(
            {scrollTop: targetScroll},
            scrollDelta * 2); // Ensure constant scroll speed, regardless of scroll amount
    } else {
        $(window).off('scroll');

        $scrollParent.scrollTop(targetScroll);
        hexGrid.scrollSvgHexes(false);

        $(window).on('scroll', () => hexGrid.scrollSvgHexes());
    }
}