const axios = require("axios");
const fs = require("fs");
const path = require("path");
const os = require("os");

async function fetchTikTokVideos(query) {
  try {
    const response = await axios.get(`https://api.betabotz.eu.org/api/search/tiktoks?query=${query}&apikey=vrGjIdJL`);
    return response.data.result.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function downloadVideo(videoUrl) {
  try {
    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    const fileName = path.join(cacheDir, `${Date.now()}.mp4`);

    const response = await axios.get(videoUrl, { responseType: "stream" });
    const writer = fs.createWriteStream(fileName);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(fileName));
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to download video");
  }
}

module.exports = {
  config: {
    name: "tiktok2",
    author: "Kshitiz",
    version: "2.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "Search for TikTok videos",
    longDescription: "Search for TikTok videos using keywords",
    category: "social",
    guide: "{p}tiktok2 <query>",
  },

  onStart: async function ({ api, event, args }) {
    api.setMessageReaction("🕐", event.messageID, () => {}, true);

    try {
      const query = args.join(" ");
      const videos = await fetchTikTokVideos(query);

      if (!videos || videos.length === 0) {
        api.sendMessage({ body: `No TikTok videos found for the query: ${query}.` }, event.threadID, event.messageID);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return;
      }

      const videoList = videos.map((video, index) => `${index + 1}. ${video.title}`).join("\n");
      const message = `Choose a video by replying with its number:\n\n${videoList}`;

    
      api.sendMessage({ body: message }, event.threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "tiktok2",
          messageID: info.messageID,
          author: event.senderID,
          videos,
        });
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: "Sorry, an error occurred while processing your request." }, event.threadID);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  },

  onReply: async function ({ api, event, Reply, args }) {
    const { author, commandName, videos } = Reply;

    if (event.senderID !== author || !videos) {
      return;
    }

    const videoIndex = parseInt(args[0], 10);

    if (isNaN(videoIndex) || videoIndex <= 0 || videoIndex > videos.length) {
      api.sendMessage({ body: "Invalid input.\nPlease provide a valid number." }, event.threadID, event.messageID);
      return;
    }

    const selectedVideo = videos[videoIndex - 1];
    const videoUrl = selectedVideo.play;

    try {
      const videoPath = await downloadVideo(videoUrl);
      const videoStream = fs.createReadStream(videoPath);
      api.sendMessage({ body: "Here is your TikTok video:", attachment: videoStream }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: "An error occurred while processing the video.\nPlease try again later." }, event.threadID);
    } finally {
      global.GoatBot.onReply.delete(event.messageID);
    }
  },
};
