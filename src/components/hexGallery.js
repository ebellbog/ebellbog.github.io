import './hexGallery.less';
import HexGalleryTemplate from '../templates/hexGallery.handlebars';

class HexGallery {
    constructor($container, data, cfg) {
        this.declarePublicFields();

        this.$container = $container.addClass('hex-gallery');
        this.data = data;
        Object.assign(this, cfg);

        $(window).on('resize-component', () => this.setupGallery());
        this.setupGallery();

        this.hookEvents();
    }

    // For compatibility with older Safari versions, which don't support public class fields
    declarePublicFields() {
        this.isDigital = true;
        this.maxRowSize = 3;
        this.displayingMobile = null;
    }

    setupGallery() {
        const isMobile = $('body').hasClass('mobile');
        if (this.displayingMobile === isMobile) return; // Only set up when device type has changed

        if (isMobile) {
            this.data.rows = [this.data.images]; // Single horizontal scroll for mobile
        } else {
            const rows = [];
            const images = [...this.data.images];
            while (images.length) {
                const newRowSize = (rows.length % 2) ? this.maxRowSize - 1 : this.maxRowSize; // Alternate odd/even row sizes so hexes nest
                const newRow = new Array(newRowSize).fill({placeholder: true}); // Fill row with empty placeholders by default, to ensure proper alignment
                images.splice(0, newRowSize).forEach((img, idx) => newRow[idx] = img);
                rows.push(newRow);
            }
            this.data.rows = rows;
        }
        this.$container.html(HexGalleryTemplate(Object.assign(this.data, {isMobile, isDigital: this.isDigital})));

        this.displayingMobile = isMobile;
    }

    hookEvents() {
        this.$container
            .on('click', '.hex-image', (e) => {
                const $hexImage = $(e.target);
                const $modalImage = $('#modal-image');

                $('#modal-caption').html($hexImage.data('caption') || '');

                const windowWidth = window.innerWidth;
                const maxWidth = parseInt($('body').css('max-width'));

                $modalImage
                    .css({
                        height: $hexImage.outerHeight(),
                        width: $hexImage.outerWidth(),
                        top: $hexImage.offset().top - ($('body').hasClass('scroll-container') ? 0 : window.scrollY),
                        left: $hexImage.offset().left - (windowWidth > maxWidth ? (windowWidth - maxWidth) / 2 : 0),
                        transition: 'none', // Don't animate initial placement
                    })
                    .attr({
                        src: $hexImage.attr('src'),
                        alt: $hexImage.attr('alt') || '',
                    })
                    .one('load', () => {
                        $modalImage.css('transition', ''); // Animate scale-up effect
                        $('body').addClass('show-modal');
                    });
            })
            .on('mouseover', '.hex-image', ({target}) => {
                if ($('body').hasClass('mobile')) return;

                const {naturalHeight, naturalWidth} = target;
                const aspectRatio = naturalHeight / naturalWidth;

                const $target = $(target);
                $(target).css('width', $target.innerHeight() / aspectRatio);
            })
            .on('mouseout', '.hex-image', ({target}) => {
                $(target).css('width', '');
            });
    }
}

export default HexGallery;