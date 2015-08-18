
// this function is used to get a javscript date in ISO
// format for google. used to grab upcoming events.
function ISODateString(d) {

 function pad(n) {return n<10 ? '0'+n : n}

 return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'
}

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

  $.grabCalendar = function(args) {

  	// type, iso_format, meta_array

    var googleCalendarResponse;
    var apiUrl = encodeURI('https://www.googleapis.com/calendar/v3/calendars/' + calendarid + '/events?singleEvents=true&orderBy=startTime&key=' + mykey);

    // seeing if they specified the max events they want back
    if (typeof args != "undefined") {

    	if (args.hasOwnProperty('maxEvents') && args.maxEvents < 2501) {
	      apiUrl = apiUrl + "&maxResults=" + args.maxEvents;
	    }

	    if (args.hasOwnProperty('upcoming') && args.upcoming) {
	    	var d = new Date();
	    	apiUrl = apiUrl + "&timeMin=" + ISODateString(d);
	    }
    } 

    $.ajax({
      type: 'GET',
      url: apiUrl,
      dataType: 'json',
      async: false,
      success: function (response) {

        var metadata = {};

        if (typeof args == "undefined") {
        	googleCalendarResponse = response;
        	return;
        }

        // checking to see if we need to change the format of dates first
        if ((args.hasOwnProperty('clean_date') && args.clean_date)) {
          for (var i = 0; i < response.items.length; i++) {
            response.items[i].end.dateTime = adjustDate(response.items[i].end.dateTime);
            response.items[i].start.dateTime = adjustDate(response.items[i].start.dateTime);
          }
        }

        // checking for the array
        if (args.hasOwnProperty('metadata')) {

        	// ************** putting it into a json object ****************
        	// even though it will be O(n) (but almost constant) to create a
        	// json object from the array, we're doing it so that the syntax to make 
        	// this call is cleaner and it'll be easier to stop early if we've found
        	// all of the specified fields.
        	for (var i = 0; i < args.metadata.length; i++) {
        		metadata[args.metadata[i]] = true;
        	}

        	// creating the specified fields in the json object
        	for (var i = 0; i < response.items.length; i++) {

        		// check to see if the description field is present
        		if (typeof response.items[i].description != "undefined") {
        			var description = response.items[i].description.split("\n");
	        		// iterating through all of the metadata fields
	        		for (var j = 0; j < description.length; j++) {
	        			var field = description[j].split(": ");

	        			if (field[0] in metadata) {
	        				response.items[i][field[0]] = field[1];
	        			}
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
        if (typeof args != "undefined" && !args.hasOwnProperty('type') || args.type == "full") {
          googleCalendarResponse = response;
        }

        // 'events' just return basic information
        else if (args.type === "events") {

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
            if (args.hasOwnProperty('metadata')) {
            	for (var key in metadata) {
            		basicInfo[key] = response.items[i][key];
            	}
            }

            googleCalendarResponse.push(basicInfo);
          }
        }

        // 'detailedEvents' returns detailed event info
        else if (args.type === "detailedEvents") {
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
