import Handlebars from 'handlebars';
const handlebarsTemplates = {};

function applyTemplate(id, context) {
    let compiledTemplate = handlebarsTemplates[id];
    if (!compiledTemplate) {
        const template = $(id).html();
        compiledTemplate = Handlebars.compile(template);
        handlebarsTemplates[id] = compiledTemplate;
    }
    return compiledTemplate(context);
}

function createSvg(element) {
    return document.createElementNS('http://www.w3.org/2000/svg', element);
}

function constrainValue(val, min, max) {
    if (typeof min === 'number') {
        val = Math.max(val, min);
    } if (typeof max === 'number') {
        val = Math.min(val, max);
    }
    return val;
}

function isMobileDevice() {
    return (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ) ? true : false
}

function randItem(list, remove) {
    if (!list.length) return false

    const index = Math.floor(Math.random() * list.length)
    const item = list[index]

    if (remove) list.splice(index, 1)
    return item
}

export {
    applyTemplate,
    constrainValue,
    createSvg,
    isMobileDevice,
    randItem
};