var linebot = require('linebot');
var express = require('express');
var path = require('path');
 
var bot = linebot({
    channelId: '1611184250',
    channelSecret: 'fc0dde92ef9e9b182bc526a240c18346',
    channelAccessToken: 'fo/507dPjAsjw/gAjXcas2aKo94L9l5QOLrDqTkQ6fcsy5lDv4uRGAGHd0ck8DAumYuGVRYO9pNMJXWrcohw/2KnyeD0XJ1y2fW7fdgfpzmd5ChC5KuAV9REP9kFNlFubCii5jKuSVY81oDn3KTvRwdB04t89/1O/w1cDnyilFU='
	});
 
var message = {
    "�A�n":"�ڤ��n",
    "�A�O��":"�ڬO�����H"
};
 
bot.on('message', function(event) {
  if (event.message.type = 'text') {
    var msg = event.message.text;
  //�����r�T���ɡA�����⦬�쪺�T���Ǧ^�h
    event.reply(msg).then(function(data) {
      // �ǰe�T�����\�ɡA�i�b���g�{���X 
      console.log(msg);
    }).catch(function(error) {
      // �ǰe�T�����ѮɡA�i�b���g�{���X 
      console.log('���~���͡A���~�X�G'+error);
    });
  }
});
setTimeout(function(){
    var userId = 'Ĭ�f��';
    var sendMsg = '�A�n��';
    bot.push(userId,sendMsg);
    console.log('send: '+sendMsg);
},1000);

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);
 
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});