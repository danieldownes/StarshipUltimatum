package 
{
	import away3d.containers.ObjectContainer3D;
	import away3d.containers.Scene3D;
	import away3d.core.math.Number3D;
	import away3d.core.utils.Cast;
	
	
	import ddPartical;
	
	public class ddParticalSys
	{
		public var oEmitter:ObjectContainer3D;
		public var mParts = new Array();
		public var iUsed = 0;
		public var vVelocityMax:Number3D;
		public var iMax = 10;
		public var intervalN = 0;
		private var interval = 10;
		
		public var iAlive = false;
		
		public var particalsPerInterval = 10;
		
		
		public function ddParticalSys(type, gameScene:Scene3D)
		{
			var tType;
			oEmitter = new ObjectContainer3D()
			
			// Create Objects
			for ( var n = 0; n < iMax; n++)
			{
				
				// Select type
				if( type == "enemy_explosion")
				{
					if( Math.random() > 0.5)
						tType = "billboard_glowing";
					else
						tType = "triangle_red";
				}
				else if ( type == "enemy_minor")
				{
					tType = "triangle_red";
				}

				mParts[n] = new ddPartical(tType, gameScene);
				gameScene.addChild(oEmitter);
			}
		}
		
		public function start(startPos:Number3D, startRot:Number3D):void
		{
			var i = 0;
			
			
			// Find avilable partical
			for( var n = 0; n < iMax && i < particalsPerInterval; n++) 
			{
				if( !mParts[n].inUse)
				{
					if( mParts[n].sType == "triangle_red")
						mParts[n].spawn(startPos, startRot, new Number3D( Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5 ), new Number3D( Math.random() * 50 - 25, 0, Math.random() * 10 - 5 ) );
					else if( mParts[n].sType == "billboard_glowing")
						mParts[n].spawn(startPos, new Number3D( 0,0,0), new Number3D( Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5  ), new Number3D( 0, Math.random() * 50 - 25 , 0 ) );
					iUsed++;
					i++;
				}
			}
				
			iAlive = true;
				
			intervalN = interval;
		}
		
		public function update():void
		{
			intervalN++;
			for( var n = 0; n < iMax; n++)
			{
				if( mParts[n].inUse )
				{
					if( !mParts[n].update() )
						iUsed--;
				}
			}
			
			// Check interval
			if( intervalN > interval )
			{				
				intervalN = 0;
				
				// spawn code should go here
			}
			
			// Still alive?
			if( iUsed <= 0 )
				iAlive = false;
		}
	}
}