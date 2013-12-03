
campusServices=[];
var serviceID;

function getJsonServices() {
	$.getJSON("data/campusServices.json", function(data) {
		campusServices = data.Services;
		listItems=[]
		var item;
		for(i=0;i<campusServices.length;i++){
			item=document.createElement('div');
			item.setAttribute('data-bb-type', 'item');
			item.setAttribute('data-bb-title', campusServices[i].service );
			item.innerHTML = campusServices[i].desc;
			item.setAttribute('onclick', 'showServicePage(' + i + ')');
			item.setAttribute('style', 'color: #fff; margin-left:-100px;');
			listItems.push(item);
		}
		document.getElementById("servicesList").refresh(listItems);
	});
}


function showServicePage(id) {
	serviceID = id;
	bb.pushScreen("campusServicesItems.html", "campusServicesItems");
}

function showServiceDetail() {
listItems=[]
	var item;
	for(i=0;i<campusServices[serviceID].items.length;i++){
		item=document.createElement('div');
		item.setAttribute('data-bb-type', 'item');
		item.setAttribute('data-bb-title', campusServices[serviceID].items[i].name );
		item.innerHTML = campusServices[serviceID].items[i].location;
		item.setAttribute('style', 'color: #fff; margin-left:-100px;');
		listItems.push(item);
	}
	document.getElementById("servicesItems").refresh(listItems);
}