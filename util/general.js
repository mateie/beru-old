module.exports = class General {
    static list(array, lastSeparator) {
        let text = "";

        for(let i = 0; i < array.length; i++) {
            if(i == 0) {
                text += array[i];
            } else if(i == array.length - 1) {
                text += ` ${lastSeparator} ${array[i]}`;
            } else {
                text += `, ${array[i]}`;
            }
        }

        return text;
    }

    static shuffleArray(array) {
        let counter = array.length;

        while(counter) {
            let index = Math.floor(Math.random() * counter);

            counter--;

            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }

    static capitalize(string) {
        let split = string.trim().split("");
        split[0] = split[0].toUpperCase();
        return split.join("");
    }

    static wait(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    applyText(canvas, text, defaultFontSize, width, font) {
        const ctx = canvas.getContext('2d');
        do {
            ctx.font = `${defaultFontSize -= 1}px ${font}`;
        } while (ctx.measureText(text).width > width);

        return ctx.font;
    }
};