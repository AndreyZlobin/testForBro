import Drawer from './drawer';
import * as util from './utils/index';

export default class CanvasDrawer extends Drawer {
    constructor(container, params) {
        super(container, params);
        this.maxCanvasWidth = params.maxCanvasWidth;
        this.maxCanvasElementWidth = Math.round(
            params.maxCanvasWidth / params.pixelRatio
        );

        this.hasProgressCanvas = params.waveColor != params.progressColor;

        this.halfPixel = 0.5 / params.pixelRatio;

        this.canvases = [];
        this.progressWave = null;
    }

    init() {
        this.createWrapper();
        this.createElements();
    }

    createElements() {
        this.progressWave = this.wrapper.appendChild(
            this.style(document.createElement('wave'), {
                position: 'absolute',
                zIndex: 3,
                left: 0,
                top: 0,
                bottom: 0,
                overflow: 'hidden',
                width: '0',
                display: 'none',
                boxSizing: 'border-box',
                borderRightStyle: 'solid',
                pointerEvents: 'none'
            })
        );

        this.addCanvas();
        this.updateCursor();
    }

    updateCursor() {
        this.style(this.progressWave, {
            borderRightWidth: this.params.cursorWidth + 'px',
            borderRightColor: this.params.cursorColor
        });
    }

    updateSize() {
        const totalWidth = Math.round(this.width / this.params.pixelRatio);
        const requiredCanvases = Math.ceil(
            totalWidth / (this.maxCanvasElementWidth + 2)
        );

        while (this.canvases.length < requiredCanvases) {
            this.addCanvas();
        }

        while (this.canvases.length > requiredCanvases) {
            this.removeCanvas();
        }

        this.canvases.forEach((entry, i) => {
            let canvasWidth =
                this.maxCanvasWidth + 2 * Math.ceil(this.params.pixelRatio / 2);

            if (i == this.canvases.length - 1) {
                canvasWidth =
                    this.width -
                    this.maxCanvasWidth * (this.canvases.length - 1);
            }

            this.updateDimensions(entry, canvasWidth, this.height);
            this.clearWaveForEntry(entry);
        });
    }

    addCanvas() {
        const entry = {};
        const leftOffset = this.maxCanvasElementWidth * this.canvases.length;

        entry.wave = this.wrapper.appendChild(
            this.style(document.createElement('canvas'), {
                position: 'absolute',
                zIndex: 2,
                left: leftOffset + 'px',
                top: 0,
                bottom: 0,
                height: '100%',
                pointerEvents: 'none'
            })
        );
        entry.waveCtx = entry.wave.getContext('2d');

        if (this.hasProgressCanvas) {
            entry.progress = this.progressWave.appendChild(
                this.style(document.createElement('canvas'), {
                    position: 'absolute',
                    left: leftOffset + 'px',
                    top: 0,
                    bottom: 0,
                    height: '100%'
                })
            );
            entry.progressCtx = entry.progress.getContext('2d');
        }

        this.canvases.push(entry);
    }

    removeCanvas() {
        const lastEntry = this.canvases.pop();
        lastEntry.wave.parentElement.removeChild(lastEntry.wave);
        if (this.hasProgressCanvas) {
            lastEntry.progress.parentElement.removeChild(lastEntry.progress);
        }
    }

    updateDimensions(entry, width, height) {
        const elementWidth = Math.round(width / this.params.pixelRatio);
        const totalWidth = Math.round(this.width / this.params.pixelRatio);

        entry.start = entry.waveCtx.canvas.offsetLeft / totalWidth || 0;
        entry.end = entry.start + elementWidth / totalWidth;

        entry.waveCtx.canvas.width = width;
        entry.waveCtx.canvas.height = height;
        this.style(entry.waveCtx.canvas, { width: elementWidth + 'px' });

        this.style(this.progressWave, { display: 'block' });

        if (this.hasProgressCanvas) {
            entry.progressCtx.canvas.width = width;
            entry.progressCtx.canvas.height = height;
            this.style(entry.progressCtx.canvas, {
                width: elementWidth + 'px'
            });
        }
    }

    clearWave() {
        this.canvases.forEach(entry => this.clearWaveForEntry(entry));
    }

    clearWaveForEntry(entry) {
        entry.waveCtx.clearRect(
            0,
            0,
            entry.waveCtx.canvas.width,
            entry.waveCtx.canvas.height
        );
        if (this.hasProgressCanvas) {
            entry.progressCtx.clearRect(
                0,
                0,
                entry.progressCtx.canvas.width,
                entry.progressCtx.canvas.height
            );
        }
    }

    drawBars(peaks, channelIndex, start, end) {
        return this.prepareDraw(
            peaks,
            channelIndex,
            start,
            end,
            ({ absmax, hasMinVals, height, offsetY, halfH, peaks }) => {
                if (start === undefined) {
                    return;
                }
                // Skip every other value if there are negatives.
                const peakIndexScale = hasMinVals ? 2 : 1;
                const length = peaks.length / peakIndexScale;
                const bar = 3 * this.params.pixelRatio;
                const gap =
                    this.params.barGap === null
                        ? Math.max(this.params.pixelRatio, ~~(bar / 2))
                        : Math.max(
                              this.params.pixelRatio,
                              this.params.barGap * this.params.pixelRatio
                          );
                const step = bar + gap;

                const scale = length / this.width;
                const first = start;
                const last = end;
                let i;

                for (i = first; i < last; i += step) {
                    const peak =
                        peaks[Math.floor(i * scale * peakIndexScale)] || 0;
                    const h = Math.round((peak / absmax) * halfH);
                    this.fillRect(
                        i + this.halfPixel,
                        halfH - h + offsetY,
                        bar + this.halfPixel,
                        h * 2
                    );
                }
            }
        );
    }

    drawLine(peaks, absmax, halfH, offsetY, start, end) {
        this.canvases.forEach(entry => {
            this.setFillStyles(entry);
            this.drawLineToContext(
                entry,
                entry.waveCtx,
                peaks,
                absmax,
                halfH,
                offsetY,
                start,
                end
            );
            this.drawLineToContext(
                entry,
                entry.progressCtx,
                peaks,
                absmax,
                halfH,
                offsetY,
                start,
                end
            );
        });
    }

    drawLineToContext(entry, ctx, peaks, absmax, halfH, offsetY, start, end) {
        if (!ctx) {
            return;
        }

        const length = peaks.length / 2;

        const first = Math.round(length * entry.start);
        // Use one more peak value to make sure we join peaks at ends -- unless,
        // of course, this is the last canvas.
        const last = Math.round(length * entry.end) + 1;

        const canvasStart = first;
        const canvasEnd = last;
        let i;
        let j;

        const scale = entry.progress.width / (canvasEnd - canvasStart - 1);
        // optimization
        const halfOffset = halfH + offsetY;
        const absmaxHalf = absmax / halfH;

        ctx.beginPath();
        ctx.moveTo((canvasStart - first) * scale, halfOffset);

        ctx.lineTo(
            (canvasStart - first) * scale,
            halfOffset - Math.round((peaks[2 * canvasStart] || 0) / absmaxHalf)
        );

        for (i = canvasStart; i < canvasEnd; i++) {
            const peak = peaks[2 * i] || 0;
            const h = Math.round(peak / absmaxHalf);
            ctx.lineTo((i - first) * scale + this.halfPixel, halfOffset - h);
        }

        // Draw the bottom edge going backwards, to make a single
        // closed hull to fill.
        for (j = canvasEnd - 1; j >= canvasStart; j--) {
            const peak = peaks[2 * j + 1] || 0;
            const h = Math.round(peak / absmaxHalf);
            ctx.lineTo((j - first) * scale + this.halfPixel, halfOffset - h);
        }

        ctx.lineTo(
            (canvasStart - first) * scale,
            halfOffset -
                Math.round((peaks[2 * canvasStart + 1] || 0) / absmaxHalf)
        );

        ctx.closePath();
        ctx.fill();
    }

    fillRect(x, y, width, height) {
        const startCanvas = Math.floor(x / this.maxCanvasWidth);
        const endCanvas = Math.min(
            Math.ceil((x + width) / this.maxCanvasWidth) + 1,
            this.canvases.length
        );
        let i;
        for (i = startCanvas; i < endCanvas; i++) {
            const entry = this.canvases[i];
            const leftOffset = i * this.maxCanvasWidth;

            const intersection = {
                x1: Math.max(x, i * this.maxCanvasWidth),
                y1: y,
                x2: Math.min(
                    x + width,
                    i * this.maxCanvasWidth + entry.waveCtx.canvas.width
                ),
                y2: y + height
            };

            if (intersection.x1 < intersection.x2) {
                this.setFillStyles(entry);

                this.fillRectToContext(
                    entry.waveCtx,
                    intersection.x1 - leftOffset,
                    intersection.y1,
                    intersection.x2 - intersection.x1,
                    intersection.y2 - intersection.y1
                );

                this.fillRectToContext(
                    entry.progressCtx,
                    intersection.x1 - leftOffset,
                    intersection.y1,
                    intersection.x2 - intersection.x1,
                    intersection.y2 - intersection.y1
                );
            }
        }
    }

    prepareDraw(peaks, channelIndex, start, end, fn) {
        return util.frame(() => {
            if (peaks[0] instanceof Array) {
                const channels = peaks;
                if (this.params.splitChannels) {
                    this.setHeight(
                        channels.length *
                            this.params.height *
                            this.params.pixelRatio
                    );
                    return channels.forEach((channelPeaks, i) =>
                        this.prepareDraw(channelPeaks, i, start, end, fn)
                    );
                }
                peaks = channels[0];
            }
            let absmax = 1 / this.params.barHeight;
            if (this.params.normalize) {
                const max = util.max(peaks);
                const min = util.min(peaks);
                absmax = -min > max ? -min : max;
            }

            const hasMinVals = [].some.call(peaks, val => val < 0);
            const height = this.params.height * this.params.pixelRatio;
            const offsetY = height * channelIndex || 0;
            const halfH = height / 2;

            return fn({
                absmax: absmax,
                hasMinVals: hasMinVals,
                height: height,
                offsetY: offsetY,
                halfH: halfH,
                peaks: peaks
            });
        })();
    }

    fillRectToContext(ctx, x, y, width, height) {
        if (!ctx) {
            return;
        }
        ctx.fillRect(x, y, width, height);
    }

    setFillStyles(entry) {
        entry.waveCtx.fillStyle = this.params.waveColor;
        if (this.hasProgressCanvas) {
            entry.progressCtx.fillStyle = this.params.progressColor;
        }
    }

    getImage(type, quality) {
        const images = this.canvases.map(entry =>
            entry.wave.toDataURL(type, quality)
        );
        return images.length > 1 ? images : images[0];
    }

    updateProgress(position) {
        this.style(this.progressWave, { width: position + 'px' });
    }
}
