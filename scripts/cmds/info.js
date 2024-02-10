const { getStreamFromURL } = require("fb-watchman");
module.exports = {
  config: {
    name: "info",
    version: 2.0,
    author: "OtinXSandip",
    longDescription: "info about bot and owner",
    category: "ai",
    guide: {
      en: "{p}{n}",
    },
  },
  
  onStart: async function ({ api, event, args, message, usersData }) {
    const imgURL = "https://i.imgur.com/IeayQiT.jpeg";
    const attachment = await global.utils.getStreamFromURL(imgURL);

    const id = event.senderID;
    const userData = await usersData.get(id);
    const name = userData.name;

    const ment = [{ id: id, tag: name }];
    const a = "sweetie";
    const b = " + ";
    const c = "Clyde Jvsk";
const e = "Male";
    const d = "https://www.facebook.com/YOUgoTmeee";
const f = "CLYDE";
const g = "in a relationship with your mother";

    message.reply({ 
      body: `${name}, here is the information 🌝
🌺 Bot's Name: ${a}
🌺 Bot's prefix: ${b}  
🌺 Owner: ${c}
🌺 Gender: ${e}
🌺 Messenger: ${d}
🌺 Tiktok: ${f}
🌺 Relationship: ${g}`,
mentions: ment,
      attachment: attachment });
  }
};
