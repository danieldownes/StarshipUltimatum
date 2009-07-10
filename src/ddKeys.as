package
{
	import flash.events.KeyboardEvent;
	
	public class ddKeys
	{
		public const LEFT_ARROW:int = 37;
		public const RIGHT_ARROW:int = 39;
		public const UP_ARROW:int = 38;
		public const DOWN_ARROW:int = 40;
		public const SPACE_BAR:int = 32;
		public var keysTracked:Array;

		public function ddKeys(movieclip)
		{
			keysTracked = new Array();
			movieclip.stage.addEventListener(KeyboardEvent.KEY_DOWN, keyDownHandler);
			movieclip.stage.addEventListener(KeyboardEvent.KEY_UP, keyUpHandler);
		}
		
		public function trackKey(keyCode:int):void
		{
			keysTracked[keyCode] = false;
		}
		
		public function unTrackKey(keyCode:int):void
		{
			keysTracked[keyCode] = undefined;
		}
		
		public function isKeyDown(keyCode:int)
		{
			return keysTracked[keyCode];
		}
		
		function keyDownHandler(event:KeyboardEvent)
		{
			if(keysTracked[event.keyCode] != undefined)
				keysTracked[event.keyCode] = true;
		}
		
		function keyUpHandler(event:KeyboardEvent)
		{
			if(keysTracked[event.keyCode] != undefined)
				keysTracked[event.keyCode] = false;
		}
	}
}