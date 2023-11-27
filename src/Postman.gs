function runPostman() {


  //////////////////////////////////////////////////  Extracting Timetable  //////////////////////////////////////////////////


  eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js').getContentText());


  /// Gets the total number of sheets and sets the last sheet as active sheet
  var logbook = SpreadsheetApp.openById('Your Sheet ID');
  var totalSheets = logbook.getNumSheets();
  var lastSheet = logbook.getSheets()[totalSheets-1];
  SpreadsheetApp.setActiveSheet(lastSheet);
  var activeSheet = SpreadsheetApp.getActiveSheet();


  /// Extracts the timetable values
  var vals = activeSheet.getRange(3,1,9,9).getValues();

  var day = vals[0][0].replace("DAY", "").replaceAll(":", "").trim(" ", "");
  var dateTimetableFormatted = vals[0][6].replace("DATE", "").replaceAll(":", "").trim(" ", "");
  var dateTimetable = vals[0][6].replace("DATE", "").replaceAll(":", "").trim(" ", "") + " 21";
  dateTimetable = moment(dateTimetable).format("YYYY-MM-DD");

  const currentDate = moment(Date.now()).format("YYYY-MM-DD");


  /// Check for class on present day
  isClassToday = (String(currentDate) == dateTimetable)
  if (isClassToday){
    var data = "";
    var period = {};
    var apiData = [];


    /// Recording data from upto 8 subjects into data and apiData objects
    data += "**------------------------------------------------------------------------**\n\n";

    for (var i = 1; i <= 8; i = i + 1){   
      if (String(vals[2][i]) != ''){
        period = {};
        period.Time = vals[2][i].toString().replaceAll("\n", " ");
        period.ReminderTime = String(moment(period.Time.split("to")[0].trim(),"h:mm A")).split(" ")[4].substring(0,5);

        if (vals[3][i] != "" && vals[4][i] != "" && vals[5][i] != ""){
          period.Teacher = vals[3][i].toString().trim();
          period.Subject = vals[4][i].toString().trim();
          period.Topic = vals[5][i].toString().trim();
          period.MeetingID = vals[6][i].toString().trim();
          period.ZoomLink = vals[7][i].toString().trim();
          period.Password = (isNaN(vals[8][i].toString().trim()) ? "None" : vals[8][i].toString().trim());
        }

        else{
          period.Teacher = vals[3][i-1].toString().trim();
          period.Subject = vals[4][i-1].toString().trim();
          period.Topic = vals[5][i-1].toString().trim();
          period.MeetingID = vals[6][i-1].toString().trim();
          period.ZoomLink = vals[7][i-1].toString().trim();
          period.Password = (isNaN(vals[8][i-1].toString().trim()) ? "None" : vals[8][i].toString().trim());
        }

        data += "**Time: **"+ "  " + period.Time + "\n"
        data += "**Teacher: **"+ "  " +  period.Teacher + "\n"
        data += "**Subject: **"+ "  " +  period.Subject + "\n"
        data += "**Topic: **"+ "  " +  period.Topic + "\n"
        data += "**Meeting ID: **"+ "  " +  period.MeetingID + "\n"
        data += "**Zoom Link: **"+ "  " +  "<" + period.ZoomLink + ">" + "\n"
        data += "**Password: **"+ "  " +  period.Password + "\n";
        data += "\n**------------------------------------------------------------------------**\n\n";
        
        apiData.push(period);
      }     
    }


    //////////////////////////////////////////////////  Invoking Reminder Postman  //////////////////////////////////////////////////


    /// Setting up PUT request headers 
    var myHeaders = {
      'Authorization': "Bearer <Token>"
    };


    /// Sending requests to the Reminders API for timekeeping
    for (iter = 0; iter < apiData.length; iter += 1){  
      var embedData = JSON.stringify({
        "username": "Reminder Postman",
        "avatar_url": "https://static.wikia.nocookie.net/logopedia/images/4/4b/Reminders_%28iOS_13%29.svg/revision/latest/scale-to-width-down/250?cb=20191220152053",
        "embeds": 
          [{
          "title": ":books:  " + apiData[iter].Subject,
          "color": 51283,
          "fields": [
            {
              "name": ':clock7:  Time',
              "value": apiData[iter].Time,
              "inline": true,
            },
            {
              "name": ':desktop:  Meeting ID',
              "value":apiData[iter].MeetingID,
              "inline":true,
            },
            {
              "name":':link:  Zoom Link',
              "value":apiData[iter].ZoomLink,
              "inline":true,
            },
            {
              "name": ':book:  Topic',
              "value": apiData[iter].Topic,
              "inline": true,
            },
            {
              "name": ':teacher:  Faculty',
              "value":apiData[iter].Teacher,
              "inline":true,
            },
            {
              "name":':keyboard:  Password',
              "value":isNaN(apiData[iter].Password)? "None" : apiData[iter].Password,
              "inline":true,
            },
          ],
        }]
      });


      /// Setting up the PUT request payload
      var raw = JSON.stringify({
        'title': String(apiData[iter].Subject),
        'date_tz': dateTimetable,
        'time_tz': apiData[iter].ReminderTime,
        'notes': embedData
      });


      /// Setting up the PUT request parameters
      var params = {
        method: 'PUT',
        headers: myHeaders,
        followRedirects: true,
        muteHttpExceptions: true,
        contentType: "application/json",
        payload: raw
      };


      /// Recursively updates upto 8 reminders on Reminders API
      remindersAPIURL = "https://reminders-api.com/api/reminders/" + String(934 + iter)
      var response = UrlFetchApp.fetch(remindersAPIURL, params);


      /// Logging output to the console
      response.getHeaders();
      Logger.log(response.getResponseCode());
      Logger.log(response.getContentText());
    } 
  }


  //////////////////////////////////////////////////  Invoking Timetable Postman  //////////////////////////////////////////////////


  /// Setting up the POST request payload
  var payload = JSON.stringify({
    "embeds": [{
      "title": ":calendar_spiral:  " + dateTimetableFormatted + " - " + day,
      "color": 15105570,
      "description": data,
    }] 
  });
  

  /// Setting up the POST request's payload for holidays
  var holidayPayload = JSON.stringify({
    "embeds": [{
      "title": ":calendar_spiral:  " + moment(currentDate).format("DD MMMM") + " - " + day,
      "color": 0x33D2FF,
      "description": "**-----------------------------  - It's a Holiday! -  ------------------------------**",
      "image": {
        "url": "https://lh3.googleusercontent.com/proxy/qV8cB2sKU26TFgxn51yjysk5QdA-LKf8ItPb0gND6NcmPaGzsojGh8zJmVPn6FsF2evIMZS2oGdhV8T1pTvjgzZuWshKYFR2yg-BIWZQeNYaeNYniA"
      },
    }] 
  });


  /// Setting up the POST request parameters
  var params = {
    method: "POST",
    payload: isClassToday ? payload : holidayPayload,
    muteHttpExceptions : true,
    contentType: "application/json",
  };


  /// Sending a request to display the timetable/holiday banner
  var discordWebhookURL = "Web hook Url";
  var response = UrlFetchApp.fetch(discordWebhookURL, params);


  /// Logging output to the console
  response.getHeaders();
  Logger.log(response.getResponseCode());
  Logger.log(response.getContentText());


}
