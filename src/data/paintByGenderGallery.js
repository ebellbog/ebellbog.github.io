import '../../img/paint_by_gender1.jpg';
import '../../img/paint_by_gender2.jpg';
import '../../img/paint_by_gender3.jpg';

const paintByGenderGalleryData = {
    title: "Paint by Gender",
    year: '2018 <i>(work in progress)</i>',
    platforms: ['Browser'],
    tools: ['JavaScript', 'canvas'],
    description: `This digital coloring book challenges players to paint inside the lines, while using an assortment of brushes and
        tools that don't always suit the task at hand. By presenting a tactile, visual metaphor for the narrow constraints of gender
        norms, <i>Paint by Gender</i> promotes empathy for those whose bodies, identities, and desires don't quite fit the mold.`,
    images: [
        {
            fileName: 'paint_by_gender1.jpg',
            caption: 'In this demo, the only tool available is a paint brush, but players can choose from three brush shapes and sizes. In the future, there will be more options &mdash; but also more constraints.',
            altText: 'The word "Ready," followed by a question mark, overlaid on a blurred white and baby blue background. A purple start button is below.'
        },
        {
            fileName: 'paint_by_gender2.jpg',
            caption: 'With only 9 seconds left on the clock, the player is running out of time to finish painting this heart!',
            altText: 'A game in progress. A square shaped brush paints pink squiggles on a white heart, surrounded by a baby blue background.',
        },
        {
            fileName: 'paint_by_gender3.jpg',
            caption: 'Players can lose the game by running out of time or, in this case, by painting too far outside the lines. The "transgression meter" has reached its capacity! Future levels will focus on other related themes, including the impact of social media.',
            altText: 'A gameover screen. It reads: "Oops... You transgressed too far. People noticed, and they care way more than they should."',
        },
    ],
    links: [
        {
            name: 'Code',
            url: 'https://github.com/ebellbog/paint-by-gender/tree/demo',
        },
        {
            name: 'Demo',
            url: 'https://elanabellbogdan.com/paint-by-gender',
        },
    ]
}

export default paintByGenderGalleryData;