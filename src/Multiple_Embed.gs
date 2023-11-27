function runPostmanMultiple() {

  

  var discordUrl = "https://discord.com/api/webhooks/871975368440033340/LumCkm22U9JVgaTMJnfmv9p1TcKYgfCuD8YeJuwxZJqGG7xAr94z0ennO_rQFMlzrTWn";

  var activeSheet = SpreadsheetApp.getActiveSheet();
  console.log(activeSheet.getSheetName());
  var vals = activeSheet.getRange(3,1,9,7).getValues();
  var day = vals[0][0].replace("DAY", "").replaceAll(":", "").trim(" ", "");
  var date = vals[0][6].replace("DATE", "").replaceAll(":", "").trim(" ", "");



  var payload = [];
  
  ///// DATE
  var options = {
    method: "POST",
    payload: JSON.stringify({
      "embeds": [{
        "title": date + " - " + day,
        "color": 15105570,
      }] 
    }),
    muteHttpExceptions : true,
    contentType: "application/json",
  };

  var response = UrlFetchApp.fetch(discordUrl, options);
  /////

  for (var i = 1; i <= 6; i = i + 1) {
    var period = {};

    period.Time = vals[2][i].toString().replaceAll("\n"," ");
    period.Teacher = vals[3][i].toString().trim();
    period.Subject = vals[4][i].toString().trim();
    period.Topic = vals[5][i].toString().trim();
    period.MeetingID = vals[6][i].toString().trim();
    period.Zoom = "<" + vals[7][i].toString().trim() + ">";
    period.Password = vals[8][i].toString().trim();

    var payload = JSON.stringify({
      "embeds": [{
        "title": period.Subject,
        "color": 15105570,
        "fields": [
          {
            "name": 'Time',
            "value": period.Time,
            "inline": true,
          },
          {
            "name": 'Meeting ID',
            "value":period.MeetingID,
            "inline":true,
          },
          {
            "name":'Zoom Link',
            "value":period.Zoom,
            "inline":true,
          },
          {
            "name": 'Topic',
            "value": period.Topic,
            "inline": true,
          },
          {
            "name": 'Faculty',
            "value":period.Teacher,
            "inline":true,
          },
          {
            "name":'Password',
            "value":isNaN(period.Password)? "None" : period.Password,
            "inline":true,
          },
        ],
      }] 
    });

    var params = {
      method: "POST",
      payload: payload,
      muteHttpExceptions: true,
      contentType: "application/json",
    };

    var response = UrlFetchApp.fetch(discordUrl, params);
  }

  response.getHeaders();
  Logger.log(response.getResponseCode());
  Logger.log(response.getContentText());
}
