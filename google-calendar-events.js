
function adjustDate(iso_date) {
  MM = {Jan:"January", Feb:"February", Mar:"March", Apr:"April", May:"May", Jun:"June", Jul:"July", Aug:"August", Sep:"September", Oct:"October", Nov:"November", Dec:"December"};
  DD = {Sun:"Sunday", Mon:"Monday", Tue:"Tuesday", Wed:"Wednesday", Thu:"Thursday", Fri:"Friday", Sat:"Saturday"};

  proper_date = String(new Date(iso_date)).split(" ");

  correct_formatting = DD[proper_date[0]] + " " + MM[proper_date[1]] + " " + proper_date[2] + ", " + proper_date[3] + " - ";

  clock_time = proper_date[4].substring(0, proper_date[4].length - 3);

  // the logic for printing the date in a nice fashion is a little verbose...
  // definitely get in a pull request if you can trim this down. regex would be great <3

  // if its 00, then let them know its midnight-ish
  if (clock_time.substring(0, 2) == "00") {
    clock_time = "12" + clock_time.substring(2, clock_time.length) + " AM";
  }
  // taking away the leading 0 - for the AM
  else if (clock_time.substring(0, 1) == "0") {
    clock_time = clock_time.substring(1, clock_time.length) + " AM";
  }
  // for when its 10 or 11
  else if (Number(clock_time.substring(0, 2)) < 12) {
    clock_time += " AM";
  }
  // for when its 12 (noon)
  else if (Number(clock_time.substring(0, 2)) == 12) {
    clock_time += " PM";
  }
  else if (Number(clock_time.substring(0, 2)) > 12) {
    new_number = String(Number(clock_time.substring(0, 2)) - 12);
    clock_time = new_number + clock_time.substring(2, clock_time.length) + " PM";
  }

  correct_formatting += clock_time;
  return correct_formatting;
}

(function( $ ) {

  $.grabCalendar = function(type, iso_format) {

    console.log("Making a Google API request to return data of type: " + type);
    var googleCalendarResponse;
    var apiUrl = encodeURI('https://www.googleapis.com/calendar/v3/calendars/' + calendarid + '/events?singleEvents=true&orderBy=startTime&key=' + mykey);

    // seeing if they specified the max events they want back
    if (typeof maxEvents != "undefined" && maxEvents === parseInt(maxEvents, 10) && maxEvents < 2501) {
      apiUrl = apiUrl + "&maxResults=" + maxEvents;
    }

    $.ajax({
      type: 'GET',
      url: apiUrl,
      dataType: 'json',
      async: false,
      success: function (response) {

        console.log("iso_format is: " + iso_format);

        // checking to see if we need to change the format of dates first
        if ((typeof iso_format != "undefined" && iso_format) || type == true) {
          for (var i = 0; i < response.items.length; i++) {
            response.items[i].end.dateTime = adjustDate(response.items[i].end.dateTime);
            response.items[i].start.dateTime = adjustDate(response.items[i].start.dateTime);
          }
        }

        // if theres no parameters, return the full response
        if (typeof type == "undefined") {
          googleCalendarResponse = response;
        }

        // 'events' just return basic information
        else if (type === "events") {

          googleCalendarResponse = [];

          for (var i = 0; i < response.items.length; i++) {
            var basicInfo = {};

            basicInfo.start = response.items[i].start.dateTime;
            basicInfo.end = response.items[i].end.dateTime;

            basicInfo.summary = response.items[i].summary;

            if (typeof response.items[i].description != "undefined") {
              basicInfo.description = response.items[i].description;
            }
            if (typeof response.items[i].location != "undefined") {
              basicInfo.location = response.items[i].location;
            }
            googleCalendarResponse.push(basicInfo);
          }
        }

        // 'detailedEvents' returns detailed event info
        else if (type === "detailedEvents") {
          googleCalendarResponse = response.items;                    
        }

        // if they want the full response with pretty dates
        else if (type) {
          googleCalendarResponse = response;
        }

        // let them know their request wasn't valid.
        else {
          console.log("The request of type: " + type + " wasn't valid. Please check for possible syntax errors.");
        }

      },
      error: function (response) {
        //tell that an error has occurred
        console.log("The Google Calender API failed to connect.");
      }
    });
    return googleCalendarResponse;
  };
}( jQuery ));
