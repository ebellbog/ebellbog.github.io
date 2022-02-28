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
        'Objective-C': 'blue',
        AI: 'gray',
        Bioinformatics: 'gray',
        Gamification: 'gray'
    }
	return skillToColor[data] || 'gray';
};