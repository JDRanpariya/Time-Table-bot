function runPostmanS() {


  //////////////////////////////////////////////////  Extracting the timetable  //////////////////////////////////////////////////


  /// Gets the total number of sheets and sets the last sheet as active sheet
  var logbook = SpreadsheetApp.openById('Your Sheet ID');
  var totalSheets = logbook.getNumSheets();
  var lastSheet = logbook.getSheets()[totalSheets-1];
  var currentSheet = SpreadsheetApp.setActiveSheet(lastSheet);
  var activeSheet = SpreadsheetApp.getActiveSheet();

  //Gets the timetable values in variable called vals
  var vals = activeSheet.getRange(3,1,9,7).getValues();
  var day = vals[0][0].replace("DAY", "").replaceAll(":", "").trim(" ", "");
  var date = vals[0][6].replace("DATE", "").replaceAll(":", "").trim(" ", "");
  
  var data = "";
  data += "**------------------------------------------------------------------------**\n\n";

  for (var i = 1; i <= 6; i = i + 1) {    
    
    data += "**Time: **"+ "  " + vals[2][i].toString().replaceAll("\n"," ") + "\n"
    data += "**Teacher: **"+ "  " +  vals[3][i].toString().trim() + "\n"
    data += "**Subject: **"+ "  " +  vals[4][i].toString().trim() + "\n"
    data += "**Topic: **"+ "  " +  vals[5][i].toString().trim() + "\n"
    data += "**Meeting ID: **"+ "  " +  vals[6][i].toString().trim() + "\n"
    data += "**Zoom Link: **"+ "  " +  "<" + vals[7][i].toString().trim() + ">" + "\n"
    data += "**Password: **"+ "  " +  (isNaN(vals[8][i].toString().trim()) ? "None" : vals[8][i].toString().trim()) + "\n";
    data += "\n**------------------------------------------------------------------------**\n\n";
  }


  //////////////////////////////////////////////////  POSTing to the Discord Webhook  //////////////////////////////////////////////////


  var discordWebhook = "Your Token";

  /// Setting up the POST request payload
  var payload = JSON.stringify({
    "embeds": [{
      "title": date + " - " + day,
      "color": 15105570,
      "description": data,
    }] 
  });

  /// Setting up the POST request headers
  var params = {
    method: "POST",
    payload: payload,
    muteHttpExceptions : true,
    contentType: "application/json",
  };

  /// Setting POST request
  var response = UrlFetchApp.fetch(discordWebhook, params);

  /// Logging output to the console
  response.getHeaders();
  Logger.log(response.getResponseCode());
  Logger.log(response.getContentText());
}
