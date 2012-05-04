package
{
	//import flash.geom.;
	import flash.geom.Point;
	import flash.geom.Vector3D;
	
	public class ddUtils
	{
		/*
		public function angleBetween(x1, y1, x2, y2):Number
		{
			Math.atan2(x1 - x2, y1 - y2) * 180 / 3.14159
		}
		*/
		
		public function distance3D( firstObject:Vector3D, secondObject:Vector3D ):Number
		{
			return Math.sqrt( ( firstObject.x - secondObject.x ) * ( firstObject.x - secondObject.x ) + ( firstObject.y - secondObject.y ) * ( firstObject.y - secondObject.y ) + ( firstObject.z - secondObject.z ) * ( firstObject.z - secondObject.z ) );
		}
		
		
		public function MoveInDirection(dir, speed):Point
		{
			var sOut:Point = new Point;
			
			//trace(Math.sin(dir));
			sOut.x = Math.sin(dir / 57.295) * speed;
			sOut.y = Math.cos(dir / 57.295) * speed;
			
			return(sOut);
		}
		
		public function normLinear(val:Number, maxValue:Number, scale:Number)
		{
			//if( val == 0)
			//	return 0;
			//else
				return (scale / maxValue) * Math.abs(val);
		}
	}
}