const { text } = require('body-parser');
const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');
const General = require('../util/general');
const general = new General();

module.exports = class Cards {
    constructor(guild, member, user) {
        this.username = member.user.username;
        this.colorTitleBorder = guild.cardSettings.border;
        this.avatar = member.user.displayAvatarURL({ format: 'png', size: 128 });
        this.opacityBorder = "0.5";
        this.colorBorder = guild.cardSettings.border;
        this.colorUsername = guild.cardSettings.user;
        this.colorUsernameBox = guild.cardSettings.border;
        this.opacityUsernameBox = "0.5";
        this.discriminator = member.user.discriminator;
        this.colorDiscriminator = guild.cardSettings.user;
        this.opacityDiscriminatorBox = "0.5";
        this.colorDiscriminatorBox = guild.cardSettings.border;
        this.colorMessage = guild.cardSettings.message;
        this.colorHashtag = guild.cardSettings.user;
        this.colorTitle = guild.cardSettings.title;
        this.colorAvatar = member.displayHexColor;
        this.guildName = guild.guildName;
        this.userLevel = `Level: ${user.level}`;
        this.levelColor = user.cardSettings.textColor;
        this.colorBackground = guild.cardSettings.background;
    }

    async createCard(textTitle) {

        const canvas = Canvas.createCanvas(1024, 450);
        const ctx = canvas.getContext("2d");

        // Draw background
        ctx.fillStyle = this.colorBackground;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw layer
        ctx.fillStyle = this.colorBorder;
        ctx.globalAlpha = this.opacityBorder;
        ctx.fillRect(0, 0, 25, canvas.height);
        ctx.fillRect(canvas.width - 25, 0, 25, canvas.height);
        ctx.fillRect(25, 0, canvas.width - 50, 25);
        ctx.fillRect(25, canvas.height - 25, canvas.width - 50, 25);
        ctx.fillStyle = this.colorUsernameBox;
        ctx.globalAlpha = this.opacityUsernameBox;
        ctx.fillRect(344, canvas.height - 296, 625, 65);
        ctx.fillStyle = this.colorDiscriminatorBox;
        ctx.globalAlpha = this.opacityDiscriminatorBox;
        ctx.fillRect(389, canvas.height - 225, 138, 65);
        ctx.fillStyle = this.colorMessageBox;
        ctx.globalAlpha = this.opacityMessageBox;
        ctx.fillRect(308, canvas.height - 110, 672, 65);

        // Draw username
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.colorUsername;
        ctx.font = general.applyText(canvas, this.username, 48, 600, "Bold");
        ctx.fillText(this.username, canvas.width - 660, canvas.height - 248);

        // Draw guild name
        ctx.fillStyle = this.colorMessage;
        if(textTitle == 'Welcome') {
            ctx.font = general.applyText(canvas, `Welcome to ${this.guildName}`, 53, 600, "Bold");
            ctx.fillText(`Welcome to ${this.guildName}`, canvas.width - 690, canvas.height - 62);
        } else if(textTitle == 'Goodbye') {
            ctx.font = general.applyText(canvas, `Left ${this.guildName}`, 53, 600, "Bold");
            ctx.fillText(`Left ${this.guildName}`, canvas.width - 690, canvas.height - 62);
        }

        // Draw discriminator
        ctx.fillStyle = this.colorDiscriminator;
        ctx.font = "40px Bold";
        ctx.fillText(this.discriminator, canvas.width - 623, canvas.height - 178);

        // Draw User Level
        ctx.fillStyle = this.levelColor;
        ctx.font = '22px Bold';
        ctx.fillText(this.userLevel, 40, canvas.height - 35);

        // Draw # for discriminator
        ctx.fillStyle = this.colorHashtag;
        ctx.font = "75px SketchMatch";
        ctx.fillText("#", canvas.width - 690, canvas.height - 165);

        // Draw title
        ctx.font = "90px Bold";
        ctx.strokeStyle = this.colorTitleBorder;
        ctx.lineWidth = 15;
        ctx.strokeText(textTitle, canvas.width - 620, canvas.height - 330);
        ctx.fillStyle = this.colorTitle;
        ctx.fillText(textTitle, canvas.width - 620, canvas.height - 330);

        // Draw avatar circle
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.strokeStyle = this.colorAvatar;
        ctx.arc(180, 225, 135, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(this.avatar);
        ctx.drawImage(avatar, 45, 90, 270, 270);

        const attachment = new MessageAttachment(canvas.toBuffer(), `${textTitle}.png`);

        return attachment;
    }
};