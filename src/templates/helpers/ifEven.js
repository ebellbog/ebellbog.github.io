module.exports = function (data, options) {
    return (data % 2) ? options.inverse(this) : options.fn(this);
};