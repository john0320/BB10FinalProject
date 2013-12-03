var allPhotos=[];
var imgID;


function loadPhotos() {
	db.transaction( getPhotos , dbErr );	
}

function populatePhotos() {
	//un-sandbox file system to access shared folder
	blackberry.io.sandbox = false;

	if (allPhotos.rows){	
		var content = document.createElement('div');
		content.setAttribute('data-bb-type','grid-layout');
		content.setAttribute('data-bb-style','background-color: #FFF')
		content.setAttribute('data-bb-header-style','solid');

		var group = document.createElement('div');
		group.setAttribute('data-bb-type','group');
		content.appendChild(group);
	
		for (i=0; i<allPhotos.rows.length; i++) {
			if (i%3==0) {
				var row = document.createElement('div');
				row.setAttribute('data-bb-type','row');
				group.appendChild(row);
			}
			var item;
			item=document.createElement('div');
			item.setAttribute('data-bb-type', 'item');
			item.setAttribute('data-bb-img',  allPhotos.rows.item(i).image_path);
			item.id=allPhotos.rows.item(i).ID;
			item.setAttribute('onclick', 'saveNewPath(' + item.id + ');');
			
			row.appendChild(item);
		}
		bb.grid.apply([content]);
		document.getElementById("myGrid").appendChild(content);
	}
}


function getPhotos(trans) {
	trans.executeSql( "SELECT ID , image_path FROM contact_images ",[], gotPhoto );
}

function gotPhoto(tx, result) {
	allPhotos = result;
	populatePhotos();
}

function dbErr(tx, error) {
	alert( 'db error ' + error );

}

function saveNewPath(imageID) {
	alert('in save new path');
	imgID = imageID;
	selectedFilePath = document.getElementById(imgID).getAttribute('data-bb-img');
	alert('call setnewimagepath db trans');
	db.transaction(setNewImagePath , dbErr);
}

function setNewImagePath(trans) {
	alert('imgID = ' + imgID + ' selectedcontactId = ' + selectedContactID);
	trans.executeSql("UPDATE contact_description SET imageID = ? WHERE ID = ?" , [imgID,selectedContactID], returnToDetail, dbfailed);

}

function returnToDetail(tx, result) {
	bb.popScreen();
}


function setPhoto(){
	if (selectedFilePath){
		document.getElementById('placeHolder').src=selectedFilePath;
	}
}

function dbfailed() {
	alert('db failed');
}







