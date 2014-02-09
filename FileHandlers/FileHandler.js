var resourceFileHandler = require("./resourceFileHandler");

var FileHandler = 
	function(
		fileLocations,
		contentType) 
	{
		this.handle = 
			function(
				response, 
				request)
			{
				console.log("Handling a '" + contentType + "' file");
				
				resourceFileHandler
					.handle(
						response, 
						request,
						fileLocations,
						contentType);
			};
	};

exports.FileHandler= FileHandler;