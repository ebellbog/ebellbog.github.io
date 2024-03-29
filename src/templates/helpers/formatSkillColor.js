module.exports = function (data, options) {
    const skillToColor = {
        JavaScript: 'red',
        Handlebars: 'red',
        Less: 'red',
        CSS: 'red',
        'CSS / Less': 'red',
        canvas: 'red',
        SVG: 'red',
        Node: 'green',
        Python: 'green',
        'C++': 'green',
        'C#': 'green',
        'Objective-C': 'green',
        Django: 'green',
        Flask: 'green',
        MySQL: 'green',
        iOS: 'blue',
        webpack: 'purple',
        Babel: 'purple',
        Chef: 'purple',
        Blender: 'blue',
        'Blender renders': 'blue',
        Photoshop: 'blue',
        Unity: 'blue',
        Bitsy: 'blue',
        'Bitsy 3D': 'blue',
        AI: 'gray',
        Bioinformatics: 'gray',
        Gamification: 'gray'
    }
	return skillToColor[data] || 'gray';
};