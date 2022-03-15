import '../../img/sanctum_3.jpg';
import '../../img/sanctum_7.jpg';
import '../../img/sanctum_8.jpg';
import '../../img/sanctum_9.jpg';
import '../../img/sanctum_composite_2.jpg';

const sanctumGalleryData = {
    title: "The Artist's Sanctum",
    year: '2017',
    platforms: ['Escape room'],
    tools: ['Blender renders', 'Design document', 'Game writing', 'Copywriting'],
    description: `I consulted on this escape room as a lead game writer, puzzle designer, and technologist. The client
        was a successful, woman-owned business in Media, PA, with four existing rooms already in operation. Our goal was
        to offer a new kind of escape experience, blending interactive theater with game design, and eschewing traditional
        locks & keys in favor of immersive IOT technology (Kinect, Philips Hue, electric door strikes, etc). In the end,
        the client constructed a much simplified version of these high-tech designs, due to tightened budgetary constraints.`,
    images: [
        {
            fileName: 'sanctum_9.jpg',
            caption: 'To facilitate the design process and improve communication with the client, I built a simple 3D model of the escape room using Blender.',
            altText: 'A top-down, wireframe view of a 3D model of the escape room',
        },
        {
            fileName: 'sanctum_3.jpg',
            caption: `As seen in this 3D render, the escape room evoked the feeling of a Greco-Roman temple, where the Muses
                would challenge and inspire artists. A one-way mirror could swing aside to reveal a hidden chamber.`,
            altText: 'A 3D render of the escape room, featuring a tree, an easel, an altar, and some mirrors',
        },
        {
            fileName: 'sanctum_8.jpg',
            caption: 'The final escape room, as it was constructed by the team at Xscape The Room. Some of my original design features were kept the same, while others were simplified to suit a tightened budget.',
            altText: 'A photograph of the physical escape room, featuring a papier-mâché tree, a piano, and a framed painting with colored stripes',
        },
        {
            fileName: 'sanctum_composite_2.jpg',
            caption: `The design process involved months of back-and-forth with the client, as we refined the puzzles and narrative.
                Our goal was to provide a unique, immersive experience, with varied challenges that a group of players could
                solve in parallel, and a few dramatic moments to bring everyone back together.`,
            altText: 'A scattering of handwritten design notes, including sketches and blueprints',
        },
        {
            fileName: 'sanctum_7.jpg',
            caption: `I provided the official description for "The Artist's Sanctum" on this promotional post card, and also played a significant role in choosing the name of the room.`,
            altText: `A promotional postcard with short blurbs about three escape rooms - "The Basement," "The Safe House," and "The Artist's Sanctum"`,
        },
    ],
    links: [
        {
            name: 'TripAdvisor',
            url: 'https://www.tripadvisor.com/Attraction_Review-g53158-d11096795-Reviews-Xscape_the_Room_Media_Pa-Media_Pennsylvania.html',
        }
    ]
}

export default sanctumGalleryData;