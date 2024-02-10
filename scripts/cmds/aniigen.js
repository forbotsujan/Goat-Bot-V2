const axios = require('axios');

module.exports = {
  config: {
    name: 'anigen',
    version: '1.0',
    author: 'OtinXSandip',
    countDown: 0,
    role: 0,
    longDescription: {
      en: 'Text to Image'
    },
    category: 'ai',
    guide: {
      en: `{pn} prompt`
    }
  },

  onStart: async function ({ message, api, args, event }) {
    const ass = args.join(' ');
    
    if (!ass) {
      return message.reply("😡Please provide a prompt ");
    }
    api.setMessageReaction("⏳", event.messageID, () => {}, true);
    
    message.reply("✅| Generating please wait.", async (err, info) => { 
    const lado = `https://shivadon.onrender.com/gen?prompt=${ass}`;
  const puti = await axios.get(lado);
const bubu = puti.data.url;
const sanobhai = await require('tinyurl').shorten(bubu);

  
      message.reply({ 
body: `${sanobhai}`,
        attachment: await global.utils.getStreamFromURL(bubu)
      });
      let ui = info.messageID;
      message.unsend(ui);
      api.setMessageReaction("✅", event.messageID, () => {}, true);
    });
  }
};
