const fs = require('fs');
const fetch = require('node-fetch');
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

// Read the contents of the Markdown file asynchronously
const filePath = 'data/rule.md'; // Replace 'your_file.md' with the path to your Markdown file
fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    const newdata = {
        content: data
    };

    await editDiscordMessage(newdata);
});
