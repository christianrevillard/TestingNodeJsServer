var getTransform = function() {
	var fs = require("fs");
	var transform = require('stream').Transform;
	var builder = new transform({ });

	// TODO, config
	// should be cached in some way...
	var stream = fs.createReadStream("./ClientFiles/common/html/commonHeader.html");
	stream.setEncoding('utf8');
	var commonHeader = ''
	stream.on('data',function(buffer){
		commonHeader += buffer;
	});

	var doneHeader = false;
	var commonHeaderOK = false;

	stream.on('end',function(){
		commonHeaderOK = true;
	});

	var doTransform  =function(obj, chunk, encoding, callback){
		if (!commonHeaderOK)
		{			
			setTimeout(function(){doTransform(obj, chunk, encoding, callback);}, 10);
			return;
		}
		if (!doneHeader) // suppose only one <head> in html
		{
			var chunkString = chunk.toString();
			var headStart = chunkString.indexOf("<head>");
			if (headStart>-1){
				var beforeInsert = chunkString.slice(0, headStart + 6);
				var afterInsert = chunkString.slice(headStart + 7);
				chunk = beforeInsert + commonHeader + afterInsert;
				doneHeader = true;
			}
		}
		obj.push(chunk); // no transform. 
		callback();
	};
	
	builder._transform = function(chunk, encoding, callback){
		doTransform(this, chunk, encoding, callback);
	};
	
	return builder;
}
				
exports.getTransform = getTransform;