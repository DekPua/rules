import fs from 'fs'; 
import fetch from 'node-fetch';
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

// Read the contents of the Markdown file asynchronously
const filePath = 'data/rule.md'; // Replace 'your_file.md' with the path to your Markdown file
fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    };

    let editText = data;
    editText = editText.replace('${Sever.Name}', "DekPua");
    editText = editText.replace('${Date.LastUpdate}', unixTimeToFormattedDate(Date.now()));

    console.log(editText);

    await editDiscordMessage({ content: editText });
});
