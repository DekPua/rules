import fs from 'fs';
import fetch from 'node-fetch';
import { EmbedBuilder } from 'discord.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const rule = require('./layouts/rule.json')
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

async function editDiscordMessage(content) {
    try {
        const response = await fetch(discordWebhookUrl, {
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
    // Create a new Date object using the milliseconds
    const date = new Date(unixTime);

    // Define month names in Thai
    const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    // Get day, month, and year
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // Convert to Thai Buddhist calendar year

    // Format the date string
    const formattedDate = `${day} ${month} ${year}`;

    return formattedDate;
}

const embedList = [];

let ready = true;

const processRule = async (raw) => {
    if (raw.type === 'text') {
        try {
            const data = await fs.promises.readFile(raw.file, 'utf8');
            const embed = new EmbedBuilder()
                .setColor(16722148)
                .setDescription(data);
    
            embedList.push(embed);
            console.log(embed);
        } catch (err) {
            console.error('Error reading the file:', err);
        }
    } else if (raw.type === 'image') {
        const embed = new EmbedBuilder()
            .setColor(16722148)
            .setImage(raw.file);
    
        embedList.push(embed);
        console.log(embed);
    }
};

(async () => {
    for (const raw of rule) {
        await processRule(raw);
    }

    console.log(JSON.stringify(embedList));

    await editDiscordMessage({ content: '', embeds: embedList });
})();