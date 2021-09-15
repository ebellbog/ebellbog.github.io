import './hexTimeline.less';
import HexTimelineTemplate from  '../templates/hexTimeline.handlebars';
import { createSvg } from '../util.js';

class HexTimeline {
    // Config values
    branchLength = 40;
    trunkLength = 215;

    endpointRadius = 30;
    strokeWidth = 4;

    // jQuery
    $container = null;
    $svg = null;

    // Data
    data = null;

    constructor($container, data, cfg) {
        if (data.length < 2) {
            throw 'Timeline must have at least two items';
        }

        this.data = data;
        this.$container = $container;
        Object.assign(this, cfg);

        this.setupTimeline();
    }

    setupTimeline() {
        this.$container.html(HexTimelineTemplate({data: this.data}));
        this.$svg = this.$container.find('svg');
        this.drawHexTimeline();   
    }

    drawHexTimeline() {
        const HEX_ANGLE = Math.PI / 3;
        const deltaY = Math.sin(HEX_ANGLE) * this.trunkLength;
        const deltaX = Math.cos(HEX_ANGLE) * this.trunkLength;

        const $path = $(createSvg('path'));

        let d = `M ${this.strokeWidth + this.endpointRadius * 2 + this.branchLength} ${this.strokeWidth + this.endpointRadius}`;
        this.data.forEach((datum, idx) => {
            // Alternate left/right movement
            const direction = (idx % 2) ? 1 : -1;

            // Draw branch, then trace back
            d += `l ${this.branchLength * direction} 0 `;
            d += `m ${this.branchLength * -direction} 0 `;

            // If more branches, traverse downwards
            if (idx < this.data.length - 1) d += `l ${deltaX * -direction} ${deltaY} `;
        });

        $path
            .attr({ d })
            .addClass('timeline')
            .appendTo(this.$svg);

        // Draw endpoint circles

        this.data.forEach((datum, idx) => {
            const cy = this.strokeWidth + this.endpointRadius + deltaY * idx;
            const cx = (idx % 2) ? this.strokeWidth + this.endpointRadius * 3 + deltaX + this.branchLength * 2 : this.strokeWidth + this.endpointRadius;
            const $circle = $(createSvg('circle'))
                .attr({
                    cx,
                    cy,
                    r: this.endpointRadius
                })
                .css('transform-origin', `${cx}px ${cy}px`)
                .addClass('endpoint');

            if (datum.imgUrl) {
                const id = this.createBackgroundImage(datum.imgUrl);
                $circle.css('fill', `url(#${id})`);
            }
            if (datum.orgUrl) {
                $(createSvg('a')).attr({href: datum.orgUrl, target: '_blank'}).append($circle).appendTo(this.$svg);
            } else {
                $circle.appendTo(this.$svg);
            }
        });

        // Set stroke-width programatically, to ensure alignment between JS & CSS

        this.$svg.find('.timeline, .endpoint').css('stroke-width', this.strokeWidth);

        // Size SVG to contain timeline

        const height = (this.data.length - 1) * deltaY + (this.endpointRadius + this.strokeWidth) * 2; 
        this.$svg.css({
            height,
            width: this.branchLength * 2 + deltaX + this.endpointRadius * 4 + this.strokeWidth * 2,
        });

        // Adjust vertical placement of timeline items


        const $leftItems = $('.timeline-left .timeline-item');
        const $rightItems = $('.timeline-right .timeline-item');

        const endpointSize = this.endpointRadius + this.strokeWidth;
        $leftItems.each((idx, item) => $(item).css('top', 2 * idx * deltaY + endpointSize));
        $rightItems.each((idx, item) => $(item).css('top', 2 * (idx + .5) * deltaY + endpointSize));

        const marginTop = $leftItems.first().outerHeight() / 2;
        const marginBottom = (this.data.length % 2 ? $leftItems : $rightItems).last().outerHeight() / 2;
        this.$container.css({marginTop, marginBottom});
    }

    createBackgroundImage(url) {
        const imageName = url.split('/').pop();
        const $image = $(createSvg('image'))
            .attr({
                href: `./img/${url}`,
                height: this.endpointRadius * 2,
                width: this.endpointRadius * 2,
                x: 0,
                y: 0,
            });
        const $pattern = $(createSvg('pattern'))
            .attr({
                id: imageName,
                height: 1,
                width: 1,
            });
        $image.appendTo($pattern);
        $pattern.appendTo(this.$svg.find('defs'));
        return imageName;
    }
}

export default HexTimeline;