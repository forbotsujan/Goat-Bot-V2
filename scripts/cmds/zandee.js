module.exports = {
    config: {
        name: "zandee",
     
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
    if (event.body && event.body.toLowerCase() == 'zandee') return message.reply("*uwu*\n why zandee is fuckin' bissh oa🥵");
}
};
