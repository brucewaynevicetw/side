//�H�U���|�Crequire�̪����e�A�нT�{�O�_�w�g��npm�˶inode.js
var linebot = require('linebot');
var express = require('express');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var bot = linebot({
    channelId: '1611184250',
    channelSecret: 'fc0dde92ef9e9b182bc526a240c18346',
    channelAccessToken: 'fo/507dPjAsjw/gAjXcas2aKo94L9l5QOLrDqTkQ6fcsy5lDv4uRGAGHd0ck8DAumYuGVRYO9pNMJXWrcohw/2KnyeD0XJ1y2fW7fdgfpzmd5ChC5KuAV9REP9kFNlFubCii5jKuSVY81oDn3KTvRwdB04t89/1O/w1cDnyilFU='
	});
 
//���U��Jclient_secret.json�ɮת����e
var myClientSecret="installed":{"client_id":"583651028506-fvmng0ph5iesllm8jifa3s7j0lorvvof.apps.googleusercontent.com","project_id":"coral-smoke-218120","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://www.googleapis.com/oauth2/v3/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"gBtSIM6stlySHqzQIbVXuMFI","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}

var auth = new googleAuth();
var oauth2Client = new auth.OAuth2(myClientSecret.installed.client_id,myClientSecret.installed.client_secret, myClientSecret.installed.redirect_uris[0]);

//���U��Jsheetsapi.json�ɮת����e
oauth2Client.credentials ="access_token":"ya29.GlsqBjYS4KILSI9k5ViN_y-IDRGV8rzsT_9SHU3EU9eM4ciQPKooVJPMo6RmmB_iGg3tZiduKNmwYho5uwQGIfHVRzl52sgeKlLJkHvKHag8ytLIZhKoEwzS70xa","refresh_token":"1/ebYF3Vpbjgv-1mcDwl8YqI7azXLZPcqK3cajm7tKWKiEQWHPENrYj6-A2K3vr1YU","scope":"https://www.googleapis.com/auth/spreadsheets","token_type":"Bearer","expiry_date":'1538510289455'

//�պ��ID�A�޸�����R��
var mySheetId='�п�J�պ��ID�s��';

var myQuestions=[];
var users=[];
var totalSteps=0;
var myReplies=[];

//�{���Ұʫ�|�hŪ���պ�������D
getQuestions();


//�o�OŪ�����D���禡
function getQuestions() {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
     auth: oauth2Client,
     spreadsheetId: mySheetId,
     range:encodeURI('���D'),
  }, function(err, response) {
     if (err) {
        console.log('Ū�����D�ɪ�API���Ͱ��D�G' + err);
        return;
     }
     var rows = response.values;
     if (rows.length == 0) {
        console.log('No data found.');
     } else {
       myQuestions=rows;
       totalSteps=myQuestions[0].length;
       console.log('�n�ݪ����D�w�U�������I');
     }
  });
}

//�o�O�N���o������x�s�i�պ���禡
function appendMyRow(userId) {
   var request = {
      auth: oauth2Client,
      spreadsheetId: mySheetId,
      range:encodeURI('���^�� 1'),
      insertDataOption: 'INSERT_ROWS',
      valueInputOption: 'RAW',
      resource: {
        "values": [
          users[userId].replies
        ]
      }
   };
   var sheets = google.sheets('v4');
   sheets.spreadsheets.values.append(request, function(err, response) {
      if (err) {
         console.log('The API returned an error: ' + err);
         return;
      }
   });
}

//LineBot����user����r�T���ɪ��B�z�禡
bot.on('message', function(event) {
   if (event.message.type === 'text') {
      var myId=event.source.userId;
      if (users[myId]==undefined){
         users[myId]=[];
         users[myId].userId=myId;
         users[myId].step=-1;
         users[myId].replies=[];
      }
      var myStep=users[myId].step;
      if (myStep===-1)
         sendMessage(event,myQuestions[0][0]);
      else{
         if (myStep==(totalSteps-1))
            sendMessage(event,myQuestions[1][myStep]);
         else
            sendMessage(event,myQuestions[1][myStep]+'\n'+myQuestions[0][myStep+1]);
         users[myId].replies[myStep+1]=event.message.text;
      }
      myStep++;
      users[myId].step=myStep;
      if (myStep>=totalSteps){
         myStep=-1;
         users[myId].step=myStep;
         users[myId].replies[0]=new Date();
         appendMyRow(myId);
      }
   }
});


//�o�O�o�e�T����user���禡
function sendMessage(eve,msg){
   eve.reply(msg).then(function(data) {
      // success 
      return true;
   }).catch(function(error) {
      // error 
      return false;
   });
}


const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//�]�� express �w�]�� port 3000�A�� heroku �W�w�]�o���O�A�n�z�L�U�C�{���ഫ
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});