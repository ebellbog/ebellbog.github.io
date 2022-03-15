import '../../img/mega_maze1.jpg';
import '../../img/mega_maze2.jpg';
import '../../img/mega_maze3.jpg';
import '../../img/mega_maze4.jpg';
import '../../img/mega_maze5.jpg';

const megaMazeGalleryData = {
    title: "Davis' Virtual Mega Maze",
    year: '2006 &ndash; 2010',
    platforms: ['Mac', 'PC'],
    tools: ['Python', 'Blender', 'Photoshop'],
    description: `Davis' Mega Maze is a world record-holding corn maze in western Massachusetts. For over 25 years, they've been carving designs by renowned
        maze architect <a href="https://www.mazemaker.com/">Adrian Fisher</a> into their corn field - a totally new theme each year. For five of those years,
        I developed a companion video game matching that year's maze, which was sold as official merchandise at the farmland. These games included
        several difficulty settings, a variety of environmental options (day, night, rain), and loads of hidden, unlockable content!`,
    images: [
        {
            fileName: 'mega_maze1.jpg',
            caption: 'A rotating carousel of options on the main menu screen, including a high scores list, an album for photos discovered in the game, and a help section. (Olympic Training Maze, 2008)',
            altText: 'Menu screen with Olympic torch'
        },
        {
            fileName: 'mega_maze2.jpg',
            caption: `A typical view of the maze, using low-poly models, realistic textures, and a skybox stitched together from actual photos at the farmland.
                The player has left a trail of footprints and a red flag to save their place.`,
            altText: 'A 3D corn maze, with photorealistic textures and various menu overlays'
        },
        {
            fileName: 'mega_maze3.jpg',
            caption: `A customizable HUD provides stats, maps, and other tools. Some settings can be configured while playing – including the option to enter
                "cheat codes." Awarded as end-game bonuses, these codes modify gameplay and unlock hidden features.`,
            altText: 'Another view of the 3D corn maze, with photorealistic textures and different menu overlays'
        },
        {
            fileName: 'mega_maze5.jpg',
            caption: 'Setup screen before starting each game. This maze features at least six distinct variations and three adjustable difficulty levels, to help provide fresh replay value.',
            altText: 'Setup screen, with various difficulty and environmental settings'
        },
        {
            fileName: 'mega_maze4.jpg',
            caption: 'A detailed summary of stats and achievements for each playthrough, including all "X-treme" challenges from the physical corn maze. The final score will be added to a high scores list.',
            altText: "End-game screen, with stats summarizing the player's achievements"
        },
    ],
    links: [
        {
            name: 'Client website',
            url: 'https://davismegamaze.com/mega-maze/'
        }
    ]
}

export default megaMazeGalleryData;