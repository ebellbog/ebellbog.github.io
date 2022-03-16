import '../../img/safe_space1.jpg';
import '../../img/safe_space2.jpg';
import '../../img/safe_space3.jpg';

const safeSpaceGalleryData = {
    title: "Safe Space",
    year: '2018',
    platforms: ['Browser', 'Arcade cabinet'],
    tools: ['JavaScript', 'canvas'],
    description: `I developed this game as part of the <a href="https://www.deathbyaudioarcade.com/dreamboxxx">DreamboxXx<a>,
        a project of <a href="https://www.deathbyaudioarcade.com/">Death by Audio Arcade</a> highlighting the work of local queer
        game developers in NYC. Designed around the unique control layout of the arcade cabinet, <i>Safe Space</i> is a cooperative
        game for two players. Together, they scramble to protect Earth from impending doom by drawing a rainbow safety net around
        the planet.`,
    images: [
        {
            fileName: 'safe_space1.jpg',
            caption: 'From the landing screen, players can choose three difficulty levels and visit a training area. The UI supports either mouse or keyboard input and can also be configured to work in an arcade cabinet.',
            altText: 'A landing screen reads: "Safe Space, a game of cooperation and community in outer space." Two buttons are labeled "How to play" and "Start easy." Colored lines encircle the text, against a starry backdrop.'
        },
        {
            fileName: 'safe_space2.jpg',
            caption: `Meteors may approach Earth in a straight line or a dangerous, spiraling orbit. The players have worked together
                to create one protective barrier, but Earth has already taken a hit. For accessibility, satellites and meteors are
                distinguished by both color and shape.`,
            altText: 'A game in progress. Small shapes, with different colors and numbers of sides, orbit a cartoon Earth. Meteors are headed on a collison course for the planet.',
        },
        {
            fileName: 'safe_space3.jpg',
            caption: 'You can watch footage from launch night at The Dreamhouse <a href="https://vimeo.com/276498823" target="_blank">here</a>!',
            altText: 'A photograph of an arcade cabinet at a night club, with two people playing Safe Space.'
        },
    ],
    links: [
        {
            name: 'News',
            url: 'https://gothamist.com/arts-entertainment/step-inside-the-dreamhouse-where-diy-arcade-games-meet-queer-culture',
        },
        {
            name: 'Code',
            url: 'https://github.com/ebellbog/safe-space',
        },
        {
            name: 'Play',
            url: 'https://elanabellbogdan.com/safe-space',
        },
    ]
}

export default safeSpaceGalleryData;