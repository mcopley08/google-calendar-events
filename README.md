# google-calendar-events
> jQuery plugin that fetches up-to-date Google calendar information on the client-side.

This was made primarily for website constractors who develop sites for their clients. It makes it so that if the client needs to update a calendar / add events to their website, they can simply update it on their Google Calendar and the change will be automatically reflected on the website.

You can download the package through ```npm```, and its page can be found through this [link](https://www.npmjs.com/package/google-calendar-events). 

## Getting Set-Up

> The Google Calendar you draw the data from MUST be public. This makes sense because (in most cases) it will be publicly available on the website as well.

1. Pull the Repository
2. Place the ```google-calendar-events.js``` or ```google-calendar-events.min.js``` into your web root.
3. Include the file in your website by placing this in the webpage (**AFTER you've included jQuery**):

	```
	<script src="/path/to/google-calendar-events.js"></script>
	```
	or
	```
	<script src="/path/to/google-calendar-events.min.js"></script>
	```
4. Copy this code and place it underneath Step 3, but fill in the variables with your [Google API Developer Key](https://console.developers.google.com) and [Public Google Calendar ID](http://wpdocs.philderksen.com/google-calendar-events/getting-started/find-calendar-id/):

	```
	var mykey = '<your-google-api-key>'; 
    var calendarid = '<public-google-calendar-id>'; 
	```
	
5. Now you can use any of the calls defined in the next section to integrate with your website! :D

## jQuery Calls

Keep in mind that all of the returned events are ordered by their start time - so the one starting earliest is returned first (at index 0), etc.

> Here is how you use the plugin:

### General Structure

```
$.grabCalendar({
	type: ___,
	maxEvents: ___,
	clean_date: ___,
	upcoming: ___,
	metadata: ___
});
```

or, to get the complete raw JSON response for your calendar, you can simply call: ```$.grabCalendar();```

### Parameters

**All of the parameters in the request are optional.** Here is a description of what each of them do with the response:

#### ```type``` (string)

> Possible values: "full", "events", "detailedEvents"

This determines how verbose / concise of a response you will get in return. "events" will return a concise response that will be what most developers will be looking for (start, end, location, summary, description, metadata if specified). "detailedEvents" will return a more verbose response of the events in your calendar. If this parameter is excluded completely or is set to "full", the response will give a raw response for the entire Google Calendar. This includes the events and general information about the calendar (timezone, name of calendar, description, etc.)

#### ```clean_date``` (boolean) 

> Possible values: true, false

This is a boolean value that when set to ```true```, gives the date in a cleaner format. For example, ```2015-08-17T06:30:00-04:00``` would become ```Monday August 17, 2015 - 6:30 AM```. If this field is set to ```false``` or is excluded completely, the date will come in the standard ISO-8601 format (```YYYY-MM-DDThh:mmTZD```). 

#### ```maxEvents``` (int)

> Possible values: any integer between 1 and 2500

This parameter specifies the maximum number of events the call should return. If not specified, the default value is 250.

#### ```upcoming``` (boolean)

> Possible values: true, false

This is a boolean value that when set to ```true```, it only returns events whose end time is after the time the function was executed. If this field is set to ```false``` or is excluded completely, it will return events from the calendar starting from the beginning.

#### ```metadata``` (array of strings)

> Possible values: any array of strings

If included, this parameter will parse metadata included in each of the events from the events' **description** field. It will then create fields in the JSON response with the metadata strings you've specified. Note that not all of the events have to have the metadata you specify, but if it does have the metadata in its **description** field, it will parse it and return their values in the JSON response. If any of the fields you include in the ```metadata``` array aren't in the **description** field of the event (or are misspelled), the plugin won't respond with an error, it will simply just not include that field in the JSON repsonse.

For example, if you wanted to include a "link" in the JSON response, you would go to your event in the google calendar, and put the folling line in the **Description** field:

link: example.com

**Important Note** - you have to have it in the format of ```<field>: <value>```. If there isn't a colon and a space after the field you want to include, it will not work.

If you specify multiple fields you want in the response as metadata, you need to specify each of them on separate lines. For example:

```
venue: Best Buy Theater
tickets: ticketmaster.com
```

You can take a look at this [example calendar](https://www.google.com/calendar/embed?src=umich.edu_c3024btm09999e1f4utqjlafr0%40group.calendar.google.com&ctz=America/New_York) to get a better idea of what this means.

**Note**: Be mindful of what parameters are already returned in the JSON response. If you include the strings "location", "start", "end", etc as metadata, they will override values already sent back in the response.


## Example Calls

> These are examples of supported & valid calls:

```
$.grabCalendar();

$.grabCalendar({
	type: "full",
	clean_date: false,
	maxEvents: 1,
	metadata: ["venue"]
});

$.grabCalendar({
	type: "events",
	clean_date: true,
	maxEvents: 2500,
	metadata: ["venue", "tickets"]
});

$.grabCalendar({
    type: "events",
    clean_date: true,
    maxEvents: 15,
    upcoming: true,
    metadata: ["venue", "tickets"]
});

$.grabCalendar({
	type: "detailedEvents",
	maxEvents: 2500
});

$.grabCalendar({
	maxEvents: 15
});
```

Personally, I believe the call:

```
$.grabCalendar({
	type: "events",
	clean_date: true
});
``` 

will be one of the most commonly used calls for web developers. The ```index.html``` file has an example web page that includes everything you need (except your unique information) to run the jquery plugin.

Here is the [link](https://www.google.com/calendar/embed?src=umich.edu_c3024btm09999e1f4utqjlafr0%40group.calendar.google.com&ctz=America/New_York) to the example calendar that is used in ```index.html``` as a reference. The public calendar id for this is: umich.edu_c3024btm09999e1f4utqjlafr0@group.calendar.google.com

## JSON Response

Here is an example JSON response from the following call:

```
$.grabCalendar({
    type: "events",
    clean_date: true,
    maxEvents: 15,
    upcoming: true,
    metadata: ["venue", "tickets"]
});
```

**JSON Response**:
```
[
    {
        "start": "Tuesday August 18, 2015 - 5:00 PM",
        "end": "Tuesday August 18, 2015 - 7:00 PM",
        "summary": "example-$weg",
        "description": "venue: my moms garage\ntickets: everywhere.com",
        "venue": "my moms garage",
        "tickets": "everywhere.com"
    },
    {
        "start": "Wednesday August 19, 2015 - 2:30 AM",
        "end": "Wednesday August 19, 2015 - 5:00 AM",
        "summary": "Say Anything ft. Modern Baseball",
        "description": "venue: Lollapalooza\ntickets: ticketmaster.com",
        "location": "Austin, TX",
        "venue": "Lollapalooza",
        "tickets": "ticketmaster.com"
    }
]
```

## Integration with npm / node.js

Included in this repo is an example node.js app that runs the ```index.html``` file included in the root of the repository. To get this example up & running, follow these steps:

1. ```cd``` into the ```node-example``` folder and run ```npm install```. This will install the dependencies for the node application including the ```google-calendar-events``` plugin.

2. Open the ```node-example/views/index.html``` file and place your Google API developer key in the following line: ```var mykey = '<your-google-api-key>';```

3. Make sure you are in the ```node-example``` folder and run ```node index.js```. The web page should now be running at ```localhost:5000```.

## Example Website Integration

Here is an example of how you can use the plugin with a custom calendar view on your website: [https://google-calendar-events.herokuapp.com/](https://google-calendar-events.herokuapp.com/).

This is the code that was used to populate the calendar widget (roughly 30 lines of actual code):

```
var googleCalendar = $.grabCalendar({
                            type: "events",
                            clean_date: true,
                            maxEvents: 15,
                            upcoming: true,
                            metadata: ["venue", "tickets"]
                        });

console.log(googleCalendar);

var tourDates = '< li>';
for (var i = 0; i < googleCalendar.length; i++) {

    startDate = googleCalendar[i].start.split(" ");
    endDate = googleCalendar[i].end.split(" ");

    startTime = startDate[5] + " " + startDate[6];
    endTime = endDate[5] + " " + endDate[6];

    tourDates += '<div class="date-box"><div class="info date"><div class="day">' + startDate[2].substring(0,2);
    tourDates += '</div><div class="month">' + startDate[1].substring(0, 3) + '</div>';
    tourDates += '<div class="year">' + startDate[3] + '</div></div>';

    tourDates += '<div class="info"><div class="city">' + googleCalendar[i].location + '</div>';

    tourDates += '<div class="place"><div class="ico"></div>' + googleCalendar[i].venue + '</div></div>';
    tourDates += '<div class="info"><div class="time"><div class="ico"></div>' + startTime + " - " + endTime + '</div>';
    tourDates += '<div class="buy"><div class="ico"></div><a href="' + googleCalendar[i].tickets + '" target="_blank">Buy Tickets</a></div></div><div class="clear"></div></div>';

    if (i == googleCalendar.length - 1) {
        tourDates += '</li>';
        // appending it to the webpage
        $("#google-calendar-events").append(tourDates);
    }
    else if ((i+1) % 5 == 0 && i != 0) {
        tourDates += '</li><li>';
    }
}
```

## Known Issues

- This doesn't return events that happen on the day the request is made.
- The Ajax call thats being made to the Google Calendar API uses the parameter ```async: false``` which gives the following warning in the developer console:

	```
	Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects to the end user's experience. For more help, check http://xhr.spec.whatwg.org/.
	```
	
## Feedback

Definitely let me know if this was / wasn't useful, and what can be done to improve upon it. Any and all feedback is much appreciated.
