
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

  $.grabCalendar = function(type, iso_format, meta_array) {

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

        var metadata = {};

        // checking to see if we need to change the format of dates first
        if ((typeof iso_format != "undefined" && iso_format) || type == true) {
          for (var i = 0; i < response.items.length; i++) {
            response.items[i].end.dateTime = adjustDate(response.items[i].end.dateTime);
            response.items[i].start.dateTime = adjustDate(response.items[i].start.dateTime);
          }
        }

        // checking for the array
        if (meta_array.constructor === Array || 
        	  (typeof type === 'boolean' && iso_format.constructor === Array && meta_array == "undefined") ||
        	  (type.constructor === Array && typeof iso_format == "undefined" && typeof meta_array == "undefined")) {

        	// ************** putting it into a json object ****************
        	// even though it will be O(n) (but almost constant) to create a
        	// json object from the array, we're doing it so that the syntax to make 
        	// this call is cleaner and it'll be easier to stop early if we've found
        	// all of the specified fields.
        	for (var i = 0; i < meta_array.length; i++) {
        		metadata[meta_array[i]] = true;
        	}

        	// creating the specified fields in the json object
        	for (var i = 0; i < response.items.length; i++) {

        		var description = response.items[i].description.split("\n");
        		// iterating through all of the metadata fields
        		for (var j = 0; j < description.length; j++) {
        			var field = description[j].split(": ");

        			if (field[0] in metadata) {
        				response.items[i][field[0]] = field[1];
        			}
        		}
          }

          // ************** stopping early ******************
          // we're not going to implement a counter to see if we can
          // stop early, just because there's probably not going to be a lot of
          // extra fields anyways in the google calendar event description,
          // so doing the check at each iteration will likely slow things
          // down more than speed it up (on the average case).

        }

        // if theres no parameters, return the full response
        if (typeof type == "undefined" || type.constructor === Array || type) {
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

            // return metadata if requested 
            if (typeof metadata === 'object') {
            	for (var key in metadata) {
            		basicInfo[key] = response.items[j][key];
            	}
            }

            googleCalendarResponse.push(basicInfo);
          }
        }

        // 'detailedEvents' returns detailed event info
        else if (type === "detailedEvents") {
          googleCalendarResponse = response.items;                    
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
