module.exports = function (data, options) {
    const skillToColor = {
        JavaScript: 'red',
        Handlebars: 'red',
        webpack: 'purple',
        Babel: 'purple',
        Node: 'red',
        Less: 'red',
        Python: 'green',
        'C++': 'green',
        Django: 'green',
        Flask: 'green',
        'Objective-C': 'blue',
        iOS: 'blue',
        MySQL: 'green',
        Chef: 'purple',
        AI: 'gray',
        Bioinformatics: 'gray',
        Gamification: 'gray'
    }
	return skillToColor[data] || 'green';
};