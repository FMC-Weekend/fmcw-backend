const { WebClient } = require('@slack/web-api');
exports.slackInteraction=async(channel,messsage)=>{
    const token = process.env.SLACK_TOKEN;
    const web=new WebClient(token);
    const slack=web.chat;
    const response = await slack.postMessage({
        channel: channel,
        text: messsage,
        username: 'FMC WEEKEND',
        icon_emoji: ':robot_face:',
    });
    console.log('Message sent: ', response.ts);
};