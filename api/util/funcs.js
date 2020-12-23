const path = require('path');
const Canvas = require('canvas');
const Main = require('../app');
const { client } = require('../..');

const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);
const templateDir = path.resolve(`${dataDir}${path.sep}views`);

module.exports = {
    calculateBitwise(from, to) {
        return from << to;
    },

    async colorHex(imgURL) {
        let blockSize = 5,
            defaultRGB = { r: 0, g: 0, b: 0 },
            canvas = Canvas.createCanvas(128, 128),
            context = canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = { r: 0, g: 0, b: 0 },
            count = 0;

        if (!context) {
            return "#" + Main.componentToHex(defaultRGB.r) + Main.componentToHex(defaultRGB.g) + Main.componentToHex(defaultRGB.b);
        }

        let image = await Canvas.loadImage(imgURL);

        height = canvas.height = image.naturalHeight || image.offsetHeight || image.height;
        width = canvas.width = image.naturalWidth || image.offsetWidth || image.width;

        context.drawImage(image, 0, 0);

        try {
            data = context.getImageData(0, 0, width, height);
        } catch (e) {
            console.error(e);
            return "#" + Main.componentToHex(defaultRGB.r) + Main.componentToHex(defaultRGB.g) + Main.componentToHex(defaultRGB.b);
        }
        length = data.data.length;

        while ((i += blockSize * 4) < length) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
        }

        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);

        let hex = "#" + Main.componentToHex(rgb.r) + Main.componentToHex(rgb.g) + Main.componentToHex(rgb.b);

        return hex;
    },
};