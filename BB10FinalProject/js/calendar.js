//javascript file for calendar events

//Need work on edit of existing event.
var allEvents = [];
var eventID;
var eventDate;
var deleteID;

dbNamespace.db = window.openDatabase('school_contact', '1.0', 'Final', 50*1024);
db= dbNamespace.db;

function doTransEvent(tx){
	tx.executeSql("CREATE TABLE IF NOT EXISTS timetable (ID INTEGER PRIMARY KEY ASC )");
}

function dbErrOnCreatetbl(err){
	alert('an error occured while creating event tables' + err);
}


function addClassItem(){
	//get values from form
	var course=$("#courseName").val();
	var classNumber=$("#roomNum").val();
	var classDay=$("#courseDay").val() ;
	var d=new Date();
	var classStartsOn= ( d.getDay() < classDay ) ? parseInt(d.getDate()) + ( parseInt(classDay)-d.getDay() ) : ( parseInt(d.getDate()) + ( ( parseInt(classDay) +7) -d.getDay() ) );
	var classStartDate = new Date();
	classStartDate.setDate(classStartsOn); 
	var classTimeStart=$("#courseTimes").val();
	var timePart = $("#timePart").val();
	var classTime = ( timePart == 1 ) ? parseInt(classTimeStart) : parseInt(classTimeStart) +12 ;
	classStartDate.setHours(classTime, 0, 0, 0);
	var classDuration=$("#selectDuration").val();
	var labToggle = document.getElementById("labToggle").checked ;
	var isLab = (labToggle==true )? "Class is a Lab" : "Class is a Lecture" ;
	var alertToggle = document.getElementById("alertToggle").checked;
	var alertTime=parseInt( $("#selectAlert").val() );
	var endDate = new Date( classStartDate);
	endDate.setMinutes(classDuration);

	if (course.length>0 && classNumber.length>0 && classDay>0 && classTimeStart>0 && classDuration>0 ){
		if(eventID==0){
		var calendar = blackberry.pim.calendar,
		CalendarRepeatRule = calendar.CalendarRepeatRule, recEvent;
		rule = {
	           "frequency": CalendarRepeatRule.FREQUENCY_WEEKLY,
	           "expires": new Date("Dec 15, 2013")
	    };
	   recEvent = calendar.createEvent({"summary": course, "description": isLab, "location": classNumber, "start": classStartDate, "end": endDate, "reminder": alertTime,  "recurrence": rule});
	   recEvent.save(onSaveEventSuccess, onSaveEventError);

	   //after add event, push it to allEvents array
		var eventItem={};
			eventItem={    
				eventID: eventID,
		 		courseName: course,
		 		classNumber: classNumber,
		     	classDay: classDay,
		     	classDuration: classDuration,
		     	classTime: classTime,
		     	classTimePart: timePart,
		     	classDate: classStartDate,
		     	classEnd: endDate,
		     	classLab: isLab,
		     	classLabToggle: labToggle,
		     	classAlert: alertTime,
		     	classAlertToggle: alertToggle
	     	};
		 allEvents.push(eventItem);

		 allEvents.sort(function(a,b){
				var dateA=new Date(a.classStartDate).getTime();
				var dateB=new Date(b.classStartDate).getTime();
				return dateA > dateB ? 1 : -1;
			});
		}
		if(eventID!=0){
			//this update is not working still!
		var events = blackberry.pim.calendar;
			var event = events.getEvent(String(eventID), events.getDefaultCalendarFolder() );
    		if (event) 
    		{
			    event.summary = course;
			    event.description = isLab;
			    event.location = classNumber;
			    event.start = classStartDate;
			    event.end = endDate;
			    event.reminder = alertTime;
			    event.recurrence = rule;
			    event.save( function(e) { alert('your event has been updated');
		    	populateEvents();
				selectListSchedule();
				});
			}
		}
	} else alert( 'Required information missing');
}


function onSaveEventSuccess(saved) {
    eventID = saved.id;
    db.transaction( saveEvent, dbErr);
}

function onSaveEventError(error) {
    alert("Event not saved, error code: " + error.code);
}


function selectListSchedule() {
	document.getElementById('timetableList').style.display = 'block';
	document.getElementById('timetableAdd').style.display = 'none';  
}

function selectAddSchedule() {
	document.getElementById('timetableAdd').style.display = 'block';
	document.getElementById('timetableList').style.display = 'none';
	document.getElementById('deleteBtn').style.display = 'none'; 
	eventID = 0;
		$("#courseName").val("");
		$("#roomNum").val("");
		document.getElementById("courseDay").setSelectedItem(0);
		document.getElementById("courseTimes").setSelectedItem("0");
		document.getElementById("timePart").setSelectedItem("2");
		document.getElementById("selectDuration").setSelectedItem("0");
		document.getElementById("labToggle").setChecked(false);
		document.getElementById("alertToggle").setChecked(false);
		document.getElementById("selectAlert").setSelectedItem(0);
}

function selectEditSchedule() {
	document.getElementById('timetableAdd').style.display = 'block';
	document.getElementById('deleteBtn').style.display = 'block';  
	document.getElementById('timetableAdd').setAttribute("data-bb-style", "default");  
	document.getElementById('timetableList').style.display = 'none';

	for(i=0;i<allEvents.length;i++){
		if(allEvents[i].eventID == eventID){
			eventDate = allEvents[i].classDate;
			$("#courseName").val(allEvents[i].courseName);
			$("#roomNum").val(allEvents[i].classNumber);
			//$("#courseDay").setSelectedItem(2); -- jquery doesn't work!
			document.getElementById("courseDay").setSelectedItem(allEvents[i].classDay);
			document.getElementById("courseTimes").setSelectedItem(allEvents[i].classTime);
			document.getElementById("timePart").setSelectedItem(allEvents[i].classTimePart);
			document.getElementById("selectDuration").setSelectedItem(allEvents[i].classDuration);
			document.getElementById("labToggle").setChecked(allEvents[i].classLabToggle);
			document.getElementById("alertToggle").setChecked(allEvents[i].classAlertToggle);
			document.getElementById("selectAlert").setSelectedItem(String( allEvents[i].classAlert));
		}
	}
}


function populateEvents() {
	var items=[], item;
	var j=0;
	var weekDay;
	for(i=1;i<6;i++) {
		switch(i) {
			case 1:
			weekDay="Monday"
			break;
			case 2:
			weekDay="Tuesday"
			break;
			case 3:
			weekDay="Wednesday"
			break;
			case 4:
			weekDay="Thursday"
			break;
			case 5:
			weekDay="Friday"
			break;
		}
		item=document.createElement('div');
		item.setAttribute('data-bb-type', 'header');
		item.innerHTML=weekDay;
		items.push(item);
		if (allEvents.length>0){
			for(j=0;j<allEvents.length;j++)
			{
				if( allEvents[j].classDay==i)
				{
					item=document.createElement('div');
					item.setAttribute('data-bb-type', 'item');
					item.setAttribute('class', 'textList');
					item.setAttribute('id', eventID);
					var date = new Date(allEvents[j].classDate);
					var hours = ( date.getHours() > 12 ) ? date.getHours() -12 : date.getHours();
					var hour = (date.getHours() > 11 ) ? 'PM' : 'AM';
					var isHours = (duration>1 ? ' Hours' : 'Hour');
					var minutes = ( date.getMinutes() < 10 ) ? '0' + String(date.getMinutes())  : String(Date.getMinutes());
					var duration = Math.round((((allEvents[j].classEnd - date) /1000)/60)/60);
					var lab = allEvents[j].classLab;
					item.setAttribute('data-bb-title', allEvents[j].courseName );
					item.innerHTML = 'Room # ' + allEvents[j].classNumber + ' - ' + lab + '<br />Start Time: '+ hours+':'+minutes + ' ' + hour + ' / Duration: ' + duration + ' ' + isHours;
					item.setAttribute('onclick', 'showEventDetail(' + allEvents[j].eventID + ')');
					item.setAttribute('style', 'margin-left: -100px; height:160px;');
					items.push(item);
				} 
			} 
		} 
	} //new bbui.js allows for refresh of all image list items now :)
	document.getElementById("timetableEntries").refresh(items);
}


function showEventDetail(id){
	eventID = id;
	selectEditSchedule();
}


function loadAllEvents(){
	db.transaction( doTransEvent, dbErrOnCreatetbl );
	db.transaction(getDBEvent, dbErr);
}


function saveEvent(tx) {
	tx.executeSql("INSERT INTO timetable (ID) VALUES (?)",
		[eventID], saveEventSuccess, saveEventError);
}

function saveEventSuccess(tx, results){
	populateEvents();
	selectListSchedule();
}

function saveEventError(err) {
	alert('event entry failed');
}


function getDBEvent(tx) {
	tx.executeSql("SELECT ID FROM timetable", [], gotDBEvent);
}

function gotDBEvent(tx, results) {
	allEvents=[];
	if(results.rows){
		myEvents=results;
		for(i=0;i<myEvents.rows.length;i++){
			var eventID = myEvents.rows.item(i).ID;
			var events = blackberry.pim.calendar;
			var event = events.getEvent(String(eventID), events.getDefaultCalendarFolder() );
    		if (event) 
    		{
				var date = new Date(event.start);
				var hours = ( date.getHours() > 12 ) ? date.getHours() -12 : date.getHours();
				var hour = (date.getHours() > 11 ) ? 2 : 1;
				var duration = Math.round((((event.end - date) /1000)/60)/60);
				var isHours = (duration>1 ? ' Hours' : 'Hour');
				var minutes = ( date.getMinutes() < 10 ) ? '0' + String(date.getMinutes())  : String(Date.getMinutes());
				var classTime = hours ;
				var lab = (event.description=='Class is a Lab') ? true : false;
				var alertToggle = (event.reminder>0 )? true : false;
       			var eventItem={};
		 		eventItem={    
		 			eventID: eventID,
		     		courseName: event.summary,
		     		classNumber: event.location,
			     	classDay: event.start.getDay(),
			     	classDuration: duration,
			     	classTime: parseInt(classTime),
			     	classTimePart: hour,
			     	classDate: event.start,
			     	classEnd: event.end,
			     	classLab: event.description,
			     	classLabToggle: lab,
			     	classAlert: event.reminder,
			     	classAlertToggle: alertToggle
			     };
		     	allEvents.push(eventItem);
   			} else deleteID = myEvents.rows.item(i).ID;
   			db.transaction(doDeleteEvent, dbErr);
		}
		allEvents.sort(function(a,b){
			var dateA=new Date(a.classStartDate).getTime();
			var dateB=new Date(b.classStartDate).getTime();
			return dateA > dateB ? 1 : -1;
		});
	} 
}


function deleteClassItem() {
	removeAllOccurrences();
	deleteID = eventID;
}

   function removeAllOccurrences() {
   // find all instances of the recurring event
   //delete the pim calendar events
   var calendar = blackberry.pim.calendar,
    evt;
   calendar.findEvents({
      "filter": {
          "id": deleteID,
          "expandRecurring": true
      }
   }, function (events) {
      events.forEach(function (evt) {
         if (evt.start.toISOString() === eventDate.toISOString()) {
            evt.remove(function () {
            }, function (error) {
               alert(eventID + " instance not removed, error code: " + error.code);
            },
            true);
         }
      });
       //delete the database id for the event
   	db.transaction(deleteEventDB , dbErr);
   }, function (error) {
      alert("Failed to find events, error code: " + error.code);
   });
  
}
	
function deleteEventDB(tx) {
	tx.executeSql("DELETE FROM timetable WHERE ID = ?", [deleteID],
		function(trans, result) {
			for(var i in allEvents){
    			if(allEvents[i].eventID==deleteID){
      			  		allEvents.splice(i,1);
      			  break;
       			 }
			}
			selectListSchedule();
			populateEvents();
		}, 
		function(trans, error){
			alert('event entry failed');
		});
}

function doDeleteEvent(tx) {
	tx.executeSql("DELETE FROM timetable WHERE ID = ?", [deleteID],
		function(trans, result) {}, 
		function(trans, error){
			alert('event entry failed');
		});
}
	