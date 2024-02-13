const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function downloadImage(url, destination) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(destination, Buffer.from(response.data, 'binary'));
}

module.exports = {
  config: {
    name: "reel",
    aliases: [],
    author: "kshitiz",
    version: "1.2",
    shortDescription: {
      en: "View Instagram reel by username",
    },
    longDescription: {
      en: "View Instagram reel by providing the username or keyword. Sends a different video each time.",
    },
    category: "FUN",
    guide: {
      en: "{p}reel [username or keyword]",
    },
  },
  onStart: async function ({ api, event, args }) {
    const usernameOrKeyword = args.join(' ');

    if (!usernameOrKeyword) {
      api.sendMessage({ body: 'Please provide an Instagram username or keyword. Example: {p}reel username or {p}reel nature' }, event.threadID, event.messageID);
      return;
    }

    const reels = await fetchInstagramReels(usernameOrKeyword);

    if (!reels || reels.length === 0) {
      api.sendMessage({ body: `No Instagram reels found for ${usernameOrKeyword}.` }, event.threadID, event.messageID);
      return;
    }

    const randomIndex = Math.floor(Math.random() * reels.length); // Generate a random index
    const selectedReel = reels[randomIndex];
    const reelUrl = selectedReel.video_url;

    if (!reelUrl) {
      api.sendMessage({ body: 'Error: Reel not found.' }, event.threadID, event.messageID);
      return;
    }

    const tempReelPath = path.join(os.tmpdir(), 'reel_video.mp4');
    await downloadImage(reelUrl, tempReelPath);

    await api.sendMessage({
      body: `Here is the Instagram reel:`,
      attachment: fs.createReadStream(tempReelPath),
    }, event.threadID, event.messageID);

    fs.unlinkSync(tempReelPath);
  },
  onReply: async function ({ api, event, Reply, args }) {
    // ... (unchanged code)
  },
};

async function fetchInstagramReels(usernameOrKeyword) {
  const options = {
    method: 'GET',
    url: 'https://instagram-scraper-api2.p.rapidapi.com/v1.2/reels',
    params: {
      username_or_id_or_url: usernameOrKeyword,
    },
    headers: {
      'X-RapidAPI-Key': '3fa82b3121msh60993f970f09819p15c22cjsncc0b065b5f1c',
      'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.data.items;
  } catch (error) {
    console.error(error);
    return null;
  }
}
