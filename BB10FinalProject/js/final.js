//js file - call first to open database then create the tables needed for the app

dbNamespace = {};
dbNamespace.db = window.openDatabase('school_contact', '1.0', 'Final', 50*1024);

