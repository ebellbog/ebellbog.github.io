import '../../img/paint_by_gender1.jpg';
import '../../img/paint_by_gender2.jpg';
import '../../img/paint_by_gender3.jpg';
import '../../img/paint_by_gender4.jpg';
import '../../img/paint_by_gender5.jpg';

const paintByGenderGalleryData = {
    title: "Paint by Gender",
    year: '2023 <i>(levels 1 & 2)</i>',
    platforms: ['Browser'],
    tools: ['JavaScript', 'canvas'],
    description: `Originally conceived at the <a href="https://recurse.com">Recurse Center</a> in 2018, this digital coloring book challenges players to paint inside the lines, while using an assortment of brushes and tools that don't always suit the task at hand. By presenting a tactile, visual metaphor for the narrow constraints of gender norms, <i>Paint by Gender</i> promotes empathy for those whose bodies, identities, and desires don't quite fit the mold.`,
    images: [
        {
            fileName: 'paint_by_gender1.jpg',
            caption: 'The whimsical design of <i>Paint by Gender</i> was inspired by early graphics applications for children like <a href="https://www.myabandonware.com/media/screenshots/k/kid-pix-studio-deluxe-k11/kid-pix-studio-deluxe_1.png" target="_blank"><i>KidPix</i></a>.',
            altText: 'The landing page for Paint by Gender. A graphic, centered on the page, reads: "Paint by Gender: The artsy-crafty game of learning to paint within your lines." In the upper-right corner is text reading "for kids of all ages," but an asterisk refers the reader to a subtle footnote, which reads: "May evoke feelings of sexism, transphobia, and fatphobia. Not recommended for actual children." Centered on the bottom of the page is a button, with white text over a purple paint splat, labeled "Let\'s paint!"',
        },
        {
            fileName: 'paint_by_gender2.jpg',
            caption: 'In the easiest level of the game, players use round brushes to paint curvy shapes and square brushes to paint boxy ones. The "Galbrush," featured here, follows a smoothed path and can be continuously adjusted in size.',
            altText: 'A painting in progress, with dark red paint beginning to fill a curvy white shape on a pink background. The page title reads: "Level 1: How we\'re shaped." To the right side are several meters, indicating "% painted," "Oopsies," and time remaining. On the left and bottom are a variety of painting tools and options. The current tool is displaying the following tooltip: "Galbrush: A soft brush with smooth movement and endless sizes. Great for natural curves like these!"',
        },
        {
            fileName: 'paint_by_gender3.jpg',
            caption: 'In the second, significantly harder level, players are forced to use the "wrong" brush for each painting. Here the "Guybrush," which paints square strokes and snaps to a fixed grid, is struggling to match this curvy shape.',
            altText: 'A painting in progress, with dark blue paint, in boxy, rigid, strokes, beginning to fill a curvy white shape on a pink background. The page title reads: "Level 2: Squaring Circles." To the right side are several meters, indicating "% painted," "Oopsies," and time remaining. On the left and bottom are a variety of painting tools and options. The current tool is displaying the following tooltip: "Guybrush: A solid brush with rigid movement. Good luck smoothing out these curves!"',
        },
        {
            fileName: 'paint_by_gender4.jpg',
            caption: 'Players can lose the game by running out of time or, in this case, painting too far outside the lines. With each loss, the central themes of normativity & difference begin to emerge. Future levels will incorporate issues like the toxic impact of social media.',
            altText: 'A gameover screen. It reads: "Oops... You transgressed too far. People noticed, and they care way more than they should." The "Oopsies" meter is full and outlined in red.',
        },
        {
            fileName: 'paint_by_gender5.jpg',
            caption: 'A player stopping by to try <i>Paint by Gender</i> during the <a href="https://www.egdcollective.org/wafflegames2023" target="_blank">Waffle Games 6.0</a> convention in Harlem, during the spring of 2023!',
            altText: 'Photograph of a person playing Paint by Gender on a laptop at an exhibitor\'s booth during an indie games convention. Their hands are resting on a keyboard and mouse connected to the laptop, and the table includes several business cards along with a poster attached to the front, mostly obscured.',
        },
    ],
    links: [
        {
            name: 'Code',
            url: 'https://github.com/ebellbog/paint-by-gender/tree/demo',
        },
        {
            name: 'Play',
            url: 'https://elana.games/paint-by-gender',
        },
    ]
}

export default paintByGenderGalleryData;