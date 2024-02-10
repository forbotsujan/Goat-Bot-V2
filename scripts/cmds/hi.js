module.exports = {
    config: {
        name: "hi",
       aliases: ["hello"],
        version: "1.0",
        author: "clyde jvsk",
        countDown: 5,
        role: 0,
        shortDescription: "sarcasm",
        longDescription: "sarcasm",
        category: "reply",
    },
onStart: async function(){}, 
onChat: async function({
    event,
    message,
    getLang
}) {
    if (event.body && event.body.toLowerCase() == "hi") return message.reply("*hey,!!MY Love*\n how may iserve yuh today..");
}
};
