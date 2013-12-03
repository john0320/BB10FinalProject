//JavaScript Document

var firstName;
var lastName;
var email1;
var email2;
var hphone;
var mphone;
var description;
var contactID;
var contactDesc=[];
var allContacts=[];
var detailID;
var deleteContact;
var items=[];

db= dbNamespace.db;
db.transaction( doTrans, dbErrOnCreate );

function doTrans(tx){
		tx.executeSql("CREATE TABLE IF NOT EXISTS contact_description (ID INTEGER PRIMARY KEY ASC, description text , imageID INTEGER )");
		tx.executeSql("CREATE TABLE IF NOT EXISTS contact_images (ID INTEGER PRIMARY KEY ASC, image_path text)");
}

function dbErrOnCreate(err){
	alert('an error occured while creating contact tables');
}

function addContact(){
	firstName=$("#firstName").val();
	lastName=$("#lastName").val();
	email1=$("#email1").val();
	email2=$("#email2").val();
	mphone=$("#mPhone").val();
	hphone=$("#hPhone").val();
	description=$("#description").val();

	if( firstName.length>0 && lastName.length>0 && (email1.length>0 || email2.length>0) && (mphone.length>0 || hphone.length>0) && description.length>0)
	{
		var contacts = blackberry.pim.contacts, ContactField = contacts.ContactField,
	  	name={},
	  	mobilePhone = { type: ContactField.MOBILE, value: mphone },
	    workEmail = { type: ContactField.WORK, value: email1 },
	    homePhone = { type: ContactField.HOME, value: hphone },
	    homeEmail = { type: ContactField.HOME, value: email2 };
	    name.givenName = firstName;
	    name.familyName = lastName;
	    contact = contacts.create( {
	    	"name": name,
	    	"phoneNumbers": [mobilePhone, homePhone],
	    	"emails": [workEmail, homeEmail]
	    	
	    });
	    contact.save(onSaveSuccess, onSaveError);

	    //after add contact, push it to allcontacts array
	    var contactItem={};
	 		contactItem={    contactID: contactID,
	     	givenName: firstName,
	     	familyName: lastName,
	     	filepath: null,
	    	description:  description};
	    	if (email1.length > 0 ) {
	    		contactItem.workEmail = email1;
	    	}
	    	if (email2.length > 0 ) {
	    		contactItem.homeEmail = email2;
	    	}
	    	if (mphone.length > 0) {
	    		contactItem.mobilePhone = mphone;
	    	}
	    	if (hphone.length > 0 ) {
	    		contactItem.homePhone = hphone;
	    	}
	    
	    	allContacts.push(contactItem);

	} else alert( 'required information missing');
}

function selectContact() {
	document.getElementById('list').style.display = 'block';
	document.getElementById('addContact').style.display = 'none';  
}

function selectAdd() {
	
	document.getElementById('addContact').style.display = 'block';  
	document.getElementById('list').style.display = 'none';
}


function onSaveSuccess(contact) {
	//after save, set values to blank
	$("#firstName").val('');
	$("#lastName").val('');
	$("#email1").val('');
	$("#email2").val('');
	$("#mPhone").val('');
	$("#hPhone").val('');
	$("#description").val('');
	contactID = contact.id;
    db.transaction( addEntryDB, dbErr );
}

function onSaveError(error) {
    alert("Error saving contact: " + error.code);
}


function addEntryDB(tx){
	tx.executeSql("INSERT INTO contact_description (ID, description) VALUES (?,?)",
		[contactID, description],
		function(trans, result) {
		populateList()
		selectContact();
		}, 
		function(trans, error){
			alert('contact entry failed');
		});
}


function loadAllContacts(){
	db.transaction(getDBDesc, dbErr);
}


function contactDetails(){
	bb.pushScreen('contactDetails.html', 'contactDetails');
}


function populateList() {
	if (allContacts.length>0){
		allContacts.sort(function(a, b){
			var textA = a.familyName;
			var textB = b.familyName;
			return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
		});
		items=[]
		var item;
		for(i=0;i<allContacts.length;i++){
			item=document.createElement('div');
			if(allContacts[i].filepath)
			{
				item.setAttribute('data-bb-img', allContacts[i].filepath);
			}  
			item.setAttribute('data-bb-type', 'item');
			item.setAttribute('data-bb-title', allContacts[i].givenName + ' ' + allContacts[i].familyName);
			item.setAttribute('onclick', 'showDetail(' + allContacts[i].contactID + ')');
			item.setAttribute('style', 'color: #fff;');
			items.push(item);
		}
		document.getElementById("contactList").refresh(items);
	}
}


function showDetail(id){
	selectedContactID = id;
	bb.pushScreen('contactDetails.html', 'contactDetails');
}


function populateDetail() {
	if (allContacts.length>0){
		var items=[];
		for(i=0;i<allContacts.length;i++){
			if (allContacts[i].contactID ==selectedContactID){
				document.getElementById("pageTitle").setCaption(allContacts[i].givenName + ' ' + allContacts[i].familyName);
				if(allContacts[i].filepath)
				{
					document.getElementById("profileImage").src=allContacts[i].filepath;
					selectedFilePath = allContacts[i].filepath;
				} else { selectedFilePath='images/smileyFace.png'; }
				if( allContacts[i].mobilePhone ) {
					var item;
					item=document.createElement('div');
					item.setAttribute('data-bb-type', 'header');
					item.innerHTML='Mobile';
					item.setAttribute('style', 'color: #fff;');
					items.push(item);
					
					item=document.createElement('div');
					item.setAttribute('data-bb-type', 'item');
					item.setAttribute('data-bb-title', allContacts[i].mobilePhone);
					item.setAttribute('data-bb-img', 'images/mobile.png');
					item.setAttribute('style', 'color: #fff;');
					items.push(item);
				}


				if(allContacts[i].workEmail )
				{
					var item;
					item=document.createElement('div');
					item.setAttribute('data-bb-type', 'header');
					item.innerHTML='School';
					item.setAttribute('style', 'color: #fff;');
					items.push(item);

					item=document.createElement('div');
					item.setAttribute('data-bb-type', 'item');
					item.setAttribute('data-bb-title', allContacts[i].workEmail);
					item.setAttribute('data-bb-img', 'images/email.png');
					item.setAttribute('style', 'color: #fff;');
					items.push(item);
				}

				if( allContacts[i].homePhone || allContacts[i].homeEmail )
				{
					item=document.createElement('div');
					item.setAttribute('data-bb-type', 'header');
					item.innerHTML='Home';
					item.setAttribute('style', 'color: #fff;');
					items.push(item);

					if (allContacts[i].homeEmail)
					{
						item=document.createElement('div');
						item.setAttribute('data-bb-type', 'item');
						item.setAttribute('data-bb-title', allContacts[i].homeEmail);
						item.setAttribute('data-bb-img', 'images/email.png');
						item.setAttribute('style', 'color: #fff;');
						items.push(item);
					}
					if (allContacts[i].homePhone) 
					{
						item=document.createElement('div');
						item.setAttribute('data-bb-type', 'item');
						item.setAttribute('data-bb-title', allContacts[i].homePhone);
						item.setAttribute('data-bb-img', 'images/mobile.png');
						item.setAttribute('style', 'color: #fff;');
						items.push(item);
					}
				}
				document.getElementById("description").innerHTML=allContacts[i].description;
			}
		}
		document.getElementById("contactDetail").refresh(items);
	}
}

function dbErr(err) {
	alert('a db error');
}


function getDBDesc(tx){
	tx.executeSql("SELECT cd.ID, cd.description, ci.image_path FROM contact_description cd LEFT OUTER JOIN contact_images ci ON cd.imageID = ci.ID", [], gotDBDesc);
}

function gotDBDesc(tx, results){

	
	allContacts=[];
	if(results.rows){
		contactDesc=results;
		for(i=0;i<contactDesc.rows.length;i++){
			var descID = contactDesc.rows.item(i).ID;
			var desc = contactDesc.rows.item(i).description;
			var imagePath = contactDesc.rows.item(i).image_path;
			var contacts = blackberry.pim.contacts;
			var contact = contacts.getContact(String(descID));
    		if (contact) 
    		{
       			var contactItem={};
		 		contactItem={    contactID: descID,
		     	givenName: contact.name.givenName,
		     	familyName: contact.name.familyName,
		     	filepath: imagePath,
		    	description:  desc};
		    	
		    	if(contact.emails)
		     	{
		     		for(j=0;j<contact.emails.length;j++)
		     		{
			     		switch (contact.emails[j].type)
		     			{
			     		case 'work':
			     		contactItem.workEmail=contact.emails[j].value;
			     		break;
			     		case 'home':
			     		contactItem.homeEmail=contact.emails[j].value;
			     		break;
		     			}
		     		}
		     	}

			     if(contact.phoneNumbers)
			     {
			     	for(j=0;j<contact.phoneNumbers.length;j++)
			     	{
			     		switch (contact.phoneNumbers[j].type)
			     		{
				     		case 'mobile':
				     		contactItem.mobilePhone=contact.phoneNumbers[j].value;
				     		break;
				     		case 'home':
				     		contactItem.homePhone=contact.phoneNumbers[j].value;
				     		break;
			     		}
			     	}
			     }
		     	allContacts.push(contactItem);


   			} else {
   				tx.executeSql("DELETE FROM contact_description WHERE ID = ?",
				[descID],
				function(trans, result) {
				}, 
				function(trans, error){
					alert('contact delete failed');
				});
   			}
		}
	} 
}


function onFindSuccess(data){
	allContacts=data;
}


function onFindError(error) {
    alert("Error: " + error.code);
}

function setDetailPhoto(){
if (selectedFilePath){
	document.getElementById('profileImage').src=selectedFilePath;
}
}



