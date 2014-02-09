var 
	route,
	fileNotFound;

var route = 
	function (
		fileLocations,
		handlers, 
		pathname, 
		response, 
		request) 
	{	
		var 
			fileExtension,
			pathLocation,
			fileNotFound;	

		var fileNotFound =  require('./fileNotFound');		

		if (typeof handlers[pathname] === 'function') {
			console.log("Found router-filehandler for pathname " + pathname);
			handlers[pathname](response, request);
			return;
		} 
		
		fileExtension = pathname.slice(pathname.lastIndexOf('.'));
	
		if (typeof handlers[fileExtension] !== 'function')
		{	
			console.log("No request handler found for " + pathname);
			fileNotFound.showNotFound(response);
			return ;
		}
	
		firstPathLocation = pathname.slice(0, pathname.indexOf('/',1));
	
		if (fileLocations[firstPathLocation] === undefined)
		{
			console.log(pathname + "has known extension '" + fileExtension + "', but location '" + firstPathLocation + ' is  unknown.');
			fileNotFound.showNotFound(response);
			return ;
		}
		
		console.log("Found extension-filehandler for pathname " + pathname + "('" + fileExtension + "','" + firstPathLocation + "')");
		handlers[fileExtension](response, request);
	}

exports.route = route;