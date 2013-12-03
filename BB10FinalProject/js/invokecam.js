var filepath;
var photoID;
var profileID;


function invokeCameraCard() {
      photoID = null;
      var mode = blackberry.invoke.card.CAMERA_MODE_PHOTO;
      blackberry.invoke.card.invokeCamera(mode, function (path) {
         filepath = 'file://' + path;
         db.transaction( savePhoto , dbErr );

         document.getElementById("placeHolder").src = filepath;
         document.getElementById("btnCamera").hide();
         document.getElementById("btnMyImages").hide();
         document.getElementById("chooseImage").show();
     },
     function (reason) {
         alert("cancelled " + reason);
     },
     function (error) {
         if (error) {
             alert("invoke error "+ error);
          } 
    });
}


function savePhoto(trans) 
{
    trans.executeSql("INSERT INTO contact_images (image_path) VALUES ( ? )", [filepath],
      function(trans, result) {
        photoID = result.insertId;
        saveToProfile();
      }, 
      function(trans, error){
       alert('Photo save error');
     });
}

function saveToProfile()
{
  if(photoID)
  {
    selectedFilePath=photoID;
      var sqlStr = "UPDATE contact_description SET imageID = ? WHERE ID = ?";
      db.transaction( function(trans){
                   trans.executeSql(sqlStr, [photoID, selectedContactID])
      });
  }
}




