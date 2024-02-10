const axios = require('axios');

module.exports.config = {
  name: "tempmail",
  aliases: ['tm', 'tempmails'],
  version: "1.0",
  role: 0,
  countdown: 5,
  author: "CLYDE JVSK",
  usePrefix: true,
  description: "create tempmail",
  category: "media",
};

const TEMP_MAIL_URL = 'https://kazumaoff-peachwings.replit.app/api/gen';

module.exports.onStart = async ({ api, event, args }) => {
  try {
    if (args[0] === 'inbox') {
      if (!args[1]) {
        return api.sendMessage("❌ Please provide an email address for the inbox.", event.threadID);
      }

      const emailAddress = args[1];

      try {
        const inboxResponse = await axios.get(`https://scp-09.onrender.com/api/getmessage/${emailAddress}`);
        const messages = inboxResponse.data.messages;

        if (!messages || messages.length === 0) {
          return api.sendMessage(`No messages found for ${emailAddress}.`, event.threadID);
        }

        let messageText = '📬 Inbox Messages: 📬\n\n';
        for (const message of messages) {
          messageText += `📩 Sender: ${message.sender}\n`;
          messageText += `👀 Subject: ${message.subject || '👉 NO SUBJECT'}\n`;
          messageText += `📩 Message: ${message.message}\n\n`;
        }

        api.sendMessage(messageText, event.threadID);
      } catch (error) {
        console.error('Error fetching inbox messages:', error);
        api.sendMessage(`Error fetching inbox messages: ${error.message}`, event.threadID);
      }
    } else {
      const tempMailResponse = await axios.get(TEMP_MAIL_URL);
      const tempMailData = tempMailResponse.data;

      if (!tempMailData.email) {
        return api.sendMessage("❌ Failed to generate temporary email.", event.threadID);
      }

      api.sendMessage(`📩 Here's your generated temporary email: ${tempMailData.email}`, event.threadID);
    }
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage("An error occurred.", event.threadID);
  }
};
