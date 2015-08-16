# google-calendar-events
> jQuery plugin that fetches up-to-date Google calendar information on the client-side.

This was made primarily for website constractors who develop sites for their clients. It makes it so that if the client needs to update a calendar / add events to their website, they can simply update it on their Google Calendar and the change will be automatically reflected on the website. 

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
5. You can also specify a ```maxEvents``` variable to how many events are returned from the Google Calendar. This is an **optional** parameter, and defining it would look something like this:

	```
	var mykey = '<your-google-api-key>'; 
    var calendarid = '<public-google-calendar-id>'; 
    var maxEvents = 10; 
	```

	If this variable isn't specified, the default value is 250. Also, you cannot enter a value greater than 2500 for this variable.
	
6. Now you can use any of the methods defined in the next section to integrate with your website! :D

## jQuery Calls

Keep in mind that all of the returned events are ordered by their start time - so the one starting closest to the current time is returned first (at index 0), etc. Also, this doesn't return events that happen on the day the request is made.

> Here is how you use the plugin:

### General Structure

```$.grabCalendar(type, date_formatted)```

### Parameters

```type``` - **(optional)** This a string that can be either "events" or "detailedEvents". "events" will return a concise response that will be what most developers will be looking for (start, end, location, summary, description). "detailedEvents" will return a raw (& verbose) response containing a greater number of more fields. If this parameter is excluded completely, the response will give extended information for the Google Calendar including the events and general information about the calendar (timezone, name of calendar, description, etc.)

```date_formatted``` - **(optional)** This is a boolean value that gives the date in a more friendly format if set to ```true```. For example, ```2015-08-17T06:30:00-04:00``` would become ```Monday August 17, 2015 - 6:30 AM```. If this is set to ```false``` or is excluded, the date will come in the standard ISO-8601 format (```YYYY-MM-DDThh:mmTZD```). This parameter can also be used even if no ```type``` is included in the call.

## Example Calls

> These are all of the supported & valid calls:

```
$.grabcalendar();
$.grabcalendar("events");
$.grabcalendar("detailedEvents");
$.grabcalendar(true);
$.grabcalendar("events", true);
$.grabcalendar("detailedEvents", true);
```

Personally, I believe the ```$.grabcalendar("events", true)``` will be the most practical & useful for web developers. The ```index.html``` file has an example web page that includes everything you need (except your unique information) to run the jquery plugin.

## Known Issues

- This doesn't return events that happen on the day the request is made.
- The Ajax call thats being made to the Google Calendar API uses the parameter ```async: false``` which gives the following warning in the developer console:

	```
	Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects to the end user's experience. For more help, check http://xhr.spec.whatwg.org/.
	```
