import { createRequire } from "module";
import fetch from 'node-fetch';
const require = createRequire(import.meta.url);
const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const rule = require('./layouts/rule.json');
const about = require('./layouts/about.json');
const ruleWebhookUrl = process.env.DISCORD_RULE_WEBHOOK_URL;
const aboutWebhookUrl = process.env.DISCORD_ABOUT_WEBHOOK_URL;

async function editDiscordMessage(content, webhookUrl) {
    try {
        const response = await fetch(webhookUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(content),
        });

        if (response.ok) {
            console.log('Discord message edited successfully.');
        } else {
            console.error('Error editing Discord message:', response.statusText);
        }
    } catch (error) {
        console.error('Error editing Discord message:', error.message);
    }
}

function unixTimeToFormattedDate(unixTime) {
    const date = new Date(unixTime);

    const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;

    const formattedDate = `${day} ${month} ${year}`;

    return formattedDate;
}

const ruleEmbedList = [];
const aboutEmbedList = [];

const processRuleEmbed = async (raw) => {
    if (raw.type === 'text') {
        try {
            const data = await fs.promises.readFile(raw.file, 'utf8');

            let description = data.replace('${Sever.Name}', "DekPua").replace('${Date.LastUpdate}', unixTimeToFormattedDate(Date.now()))
            const embed = new EmbedBuilder()
                .setColor(16722148)
                .setDescription(description);

            ruleEmbedList.push(embed);
        } catch (err) {
            console.error('Error reading the file:', err);
        }
    } else if (raw.type === 'image') {
        const embed = new EmbedBuilder()
            .setColor(16722148)
            .setImage(raw.file);

        ruleEmbedList.push(embed);
    }
};

const processAboutEmbed = async (raw) => {
    if (raw.type === 'text') {
        try {
            const data = await fs.promises.readFile(raw.file, 'utf8');

            let description = data.replace('${Sever.Name}', "DekPua").replace('${Date.LastUpdate}', unixTimeToFormattedDate(Date.now()))
            const embed = new EmbedBuilder()
                .setColor(16722148)
                .setDescription(description);

            aboutEmbedList.push(embed);
        } catch (err) {
            console.error('Error reading the file:', err);
        }
    } else if (raw.type === 'image') {
        const embed = new EmbedBuilder()
            .setColor(16722148)
            .setImage(raw.file);

        aboutEmbedList.push(embed);
    }
};

(async () => {
    for (const raw of rule) {
        await processRuleEmbed(raw);
    }

    for (const raw of about) {
        await processAboutEmbed(raw);
    }

    await editDiscordMessage({ content: '', embeds: ruleEmbedList }, ruleWebhookUrl);
    await editDiscordMessage({ content: '', embeds: aboutEmbedList }, aboutWebhookUrl);
})();