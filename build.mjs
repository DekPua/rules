import fs from 'fs';
import fetch from 'node-fetch';
import { EmbedBuilder } from 'discord.js';
import rule from './layouts/rule.json' with { type: "json" };
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

rule.forEach((raw) => {
    if (raw.type == 'text') {
        fs.readFile(raw.file, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading the file:', err);
                return;
            }

            const embed = new EmbedBuilder()
                .setColor(16722148)
                .setDescription(data);

            embedList.push(embed);
        })
    } else if (raw.type == 'image') {
        const embed = new EmbedBuilder()
            .setColor(16722148)
            .setImage(raw.file);

        embedList.push(embed);
    }
});

await editDiscordMessage({ content: '', embeds: embedList });