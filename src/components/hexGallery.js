import './hexGallery.less';
import HexGalleryTemplate from '../templates/hexGallery.handlebars';

class HexGallery {
    maxRowSize = 3;

    constructor($container, data, cfg) {
        this.$container = $container.addClass('hex-gallery');

        const rows = [], {images} = data;
        while (images.length) {
            const newRowSize = (rows.length % 2) ? this.maxRowSize - 1 : this.maxRowSize; // Alternate odd/even row sizes so hexes nest
            const newRow = new Array(newRowSize).fill({placeholder: true}); // Fill row with empty placeholders by default, to ensure proper alignment
            images.splice(0, newRowSize).forEach((img, idx) => newRow[idx] = img);
            rows.push(newRow);
        }
        data.rows = rows;
        $container.html(HexGalleryTemplate(data));

        this.hookEvents();
    }

    hookEvents() {
        this.$container.find('.hex-image')
            .on('click', (e) => {
                const $hexImage = $(e.target);
                const $modalImage = $('#modal-image');

                $('#modal-caption').html($hexImage.data('caption') || '');

                $modalImage
                    .css({
                        height: $hexImage.outerHeight(),
                        width: $hexImage.outerWidth(),
                        top: $hexImage.offset().top,
                        left: $hexImage.offset().left,
                        transition: 'none', // Don't animate initial placement
                    })
                    .attr({
                        src: $hexImage.attr('src'),
                    })
                    .one('load', () => {
                        $modalImage.css('transition', ''); // Animate scale-up effect
                        $('body').addClass('show-modal');
                    });
            })
            .hover(({target}) => {
                const {naturalHeight, naturalWidth} = target;
                const aspectRatio = naturalHeight / naturalWidth;
                $(target).css('width', 300 / aspectRatio);
            }, ({target}) => {
                $(target).css('width', 260);
            });
    }
}

export default HexGallery;