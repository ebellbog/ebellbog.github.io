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
        browser or using physical light bulbs! Debuted at <a href="https://recurse.com">The Recurse Center</a> in NYC.`,
    images: [
        {
            fileName: 'just_five1.jpg',
            caption: '',
        },
        {
            fileName: 'just_five2.jpg',
            caption: '',
        },
        {
            fileName: 'just_five3.jpg',
            caption: 'You can watch gameplay on Phlips Hue bulbs (installed at The Recurse Center in NYC) <a href="https://vimeo.com/265251092" target="_blank">here</a>!',
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