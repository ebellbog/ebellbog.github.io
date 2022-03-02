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

import {isMobileDevice, isSafari} from './util';

let hexGrid;

$(document).ready(() => {
    setupNavbar();
    hookEvents();

    // Initialize components

    hexGrid = new HexGrid($('#svg-hexes'));

    new HexTimeline($('#eng-timeline'), engTimelineData);

    new HexGallery($('#safe-space'), safeSpaceGalleryData);
    new HexGallery($('#mega-maze'), megaMazeGalleryData);
    new HexGallery($('#paint-by-gender'), paintByGenderGalleryData);
    new HexGallery($('#just-five-lights'), justFiveGalleryData);

    new HexGallery($('#sanctum'), sanctumGalleryData, {isDigital: false});
    new HexGallery($('#mudfish'), mudfishGalleryData, {isDigital: false});

    // All links open new tabs by default

    $('a:not(.nav-link)').attr('target', '_blank');

    // Auto-scroll to URL target

    let {location: {hash}} = window, $el;
    if (hash && ($el = $(hash)).length) scrollToElement($el);
});

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
        // Trick for actual full-height layout on mobile
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        const $body = $('body');
        $body.removeClass('mobile landscape portrait');
        if (isMobileDevice()) {
            $body.addClass(`mobile ${window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'}`);
        }

        // Remove drop shadows on Safari & mobile, since they hurt performance of SVG animation on scroll
        $('body').toggleClass('no-shadow', isSafari() || isMobileDevice());

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
    history.locked = true; // Don't update history until after scroll complete

    if (doAnimate) {
        const scrollDelta = Math.abs(currentScroll - targetScroll);
        $pageContainer.animate(
            {scrollTop: targetScroll},
            scrollDelta * 2.5, // Ensure constant scroll speed, regardless of scroll amount
            () => history.locked = false);
    } else {
        $('#page-container').off('scroll');

        $pageContainer.scrollTop(targetScroll);
        hexGrid.scrollSvgHexes(false);
        history.locked = false;

        $('#page-container').on('scroll', () => hexGrid.scrollSvgHexes());
    }

}