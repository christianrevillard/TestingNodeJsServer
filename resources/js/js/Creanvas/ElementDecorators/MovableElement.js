// movableData:
// isBlocked: function that allow to block the duplication

var CreJs = CreJs || {};

(function(){

	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators.push(
	{
		type: 'movable',
		applyTo: function(element, movableData)
		{
			var isMoving = false;
			var touchIdentifier = null;	
			var movingFrom = null;
			var isBlocked = movableData.isBlocked;
			
			element.startMoving = function(e)
			{				
				element.controller.log('Starting moving - identifier: ' + e.identifier);
				isMoving = true;
				movingFrom = element.controller.getCanvasXYFromClientXY(e);	
				touchIdentifier = e.identifier;
				if (element.isDroppable)
				{
					element.controller.log('Trigger drag - identifier: ' + e.identifier);
					element.controller.events.dispatch('drag', {moveEvent:e, element:element});
				}
			};
	
			element.moveCompleted = function(e)
			{
				element.controller.log('Completed move - identifier: ' + e.identifier);
				isMoving = false;
				movingFrom = null;
				if (element.isDroppable)
				{
					element.controller.log('Trigger drop - identifier: ' + e.identifier);
					element.controller.events.dispatch('drop', {moveEvent:e, element:element});
				}
			};
			
			var getTarget = function(e, touches)
			{
				if (touches)
				{
					for (var touch = 0; touch<touches.length; touch++)			
					{
						if (element.isPointInPath(touches[touch]))
						{
							return touches[touch];
						};			
					};		
				} else
				{
					if (element.isPointInPath(e))
					{
						return e;
					};
				}
				
				return null;
			};
			
			var getTargetMoving = function(e, touches)
			{
				if (touches)
				{
					for (var touch = 0; touch<touches.length; touch++)			
					{
						if (touches[touch].identifier == touchIdentifier)
						{
							return target = touches[touch];
						};			
					};		
				} else
				{
					return e;
				}
				
				return null;
			};

	
			var beginMove = function(e) {
	
				if (isBlocked && isBlocked()) 
					return;

				var target = getTarget(e, e.targetTouches);

				if (!target)
					return;
								
				element.startMoving(target);
			};
	
			element.controller.events.addEventListener({
				eventGroupType:'movable',
				eventId:'pointerDown', 
				handleEvent:beginMove,
				listenerId:element.id});
				
			var isMovingLogged = false;
			
			var move = function(e) {
				if(!isMoving)
					return;

				if (isBlocked && isBlocked()) 
					return;

				var target = getTargetMoving(e, e.targetTouches);

				if (!target)
					return;
				
				if (!isMovingLogged)
				{
					isMovingLogged = true;
					element.controller.log('pointereMove event on movable ' + element.id);
				}

				var canvasXY = element.controller.getCanvasXYFromClientXY(target);	
				element.x += canvasXY.x-movingFrom.x;
				element.y += canvasXY.y-movingFrom.y;
				movingFrom = canvasXY;	
				element.triggerRedraw();
			};	
	
			element.controller.events.addEventListener({
				eventGroupType:'movable',
				eventId:'pointerMove', 
				handleEvent:move,
				listenerId:element.id});
	
			var moveend = function(e) {
				if(!isMoving)
					return;

				if (isBlocked && isBlocked()) 
					return;

				element.controller.log('Checking End event');
				var target = getTargetMoving(e, e.changedTouches);

				if (!target)
					return;

				element.controller.log('End detected for touch ' + touchIdentifier);
				var canvasXY = element.controller.getCanvasXYFromClientXY(e);	
				element.x += canvasXY.x-movingFrom.x;
				element.y += canvasXY.y-movingFrom.y;
				element.moveCompleted(target);	
				touchIdentifier = null;
				isMovingLogged = false;
				element.triggerRedraw();
			};
	
			element.controller.events.addEventListener({
				eventGroupType:'movable',
				eventId:'pointerUp', 
				handleEvent:moveend,
				listenerId:element.id});

			element.controller.events.addEventListener({
				eventGroupType:'movable',
				eventId:'pointerCancel', 
				handleEvent:moveend,
				listenerId:element.id});
}
	});
}());