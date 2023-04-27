import '../../img/just_five1.jpg';
import '../../img/just_five2.jpg';
import '../../img/just_five3.jpg';

const justFiveGalleryData = {
    title: "Just Five Lights",
    year: '2018',
    platforms: ['Browser', 'Philips Hue'],
    tools: ['JavaScript', 'CSS'],
    description: `An experiment in minimalist game design and "weird I/O." What kind of gameplay is possible when there is only
        one spatial dimension and five "pixels" to control? The simplicity of this game makes it possible to play either in a
        browser or using physical light bulbs! Debuted at the <a href="https://recurse.com">Recurse Center</a> in NYC.`,
    images: [
        {
            fileName: 'just_five1.jpg',
            caption: 'Five levels offer increasing difficulty. After each level is completed in order, it becomes available as a shortcut from the main screen.',
            altText: 'Five white dots on a minimalist main menu screen'
        },
        {
            fileName: 'just_five2.jpg',
            caption: `By design, the gameplay is as minimalist as the visual aesthetic. Various numbers of blue and red dots chase the player,
                a white dot, through a looping one-dimensional environment. Subtle symbols at the bottom of the screen offer clues about
                what each level might involve.`,
            altText: 'A game in action, with two red dots chasing the player on level 3',
        },
        {
            fileName: 'just_five3.jpg',
            caption: 'You can watch gameplay on five Philips Hue bulbs (installed at The Recurse Center in NYC) <a href="https://vimeo.com/265251092" target="_blank">here</a>!',
            altText: 'Five physical light bulbs attached to a ceiling, with bright red and white colors'
        },
    ],
    links: [
        {
            name: 'Slides',
            url: 'https://docs.google.com/presentation/d/1lKA-wnIpfu8XNAjZ5dZEPLIwjguDMVkSReufOiMSE98/edit?usp=sharing'
        },
        {
            name: 'Code',
            url: 'https://github.com/ebellbog/just-five-lights',
        },
        {
            name: 'Play',
            url: 'https://elanabellbogdan.com/just-five-lights/',
        },
    ]
}

export default justFiveGalleryData;