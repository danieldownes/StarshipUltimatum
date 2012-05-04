package
{
	import away3d.containers.ObjectContainer3D;
	import away3d.containers.Scene3D;
	import away3d.core.base.Vertex;
	import flash.geom.Vector3D;
	
	import away3d.primitives.LineSegment;
	import away3d.materials.WireframeMaterial;
	
	import ddUtils;
	
	public class ddStars
	{
		private static const starsMaxCONST = 30;
		private var stars  = new Array();
		
		private var utils:ddUtils = new ddUtils;
		
		public function ddStars(playersRig:ObjectContainer3D, gameScene:Scene3D)
		{
			var vTemp:Vertex;
			
			// Create Objects
			for( var n = 0; n < starsMaxCONST; n++)
			{
				//Math.floor(Math.random() * 64) + 64;
				var dec:Number = Math.floor(Math.random() * 64) + 64 * 10000;
				//trace( dec.toString(16) );
				vTemp =  new Vertex(Math.floor(Math.random() * 1600) - 800, Math.floor(Math.random() * 20) - 30, Math.floor(Math.random() * 1600) - 800);
				stars[n] = new LineSegment({material:new WireframeMaterial("0x" + dec.toString(16), {width:Math.floor(Math.random() * 2) + 1})});
				stars[n].start = vTemp;
				stars[n].end = vTemp;
				gameScene.addChild(stars[n]);
			}
		}
		
		public function update(playerRig:ObjectContainer3D, fShipSpeed):void
		{
			//trace( stars[1].start.z );
			
			
			for( var n = 0; n < starsMaxCONST; n++)
			{
				var tRadians = playerRig.rotationY * 0.01745;
				
				var tDist = utils.distance3D( new Vector3D( stars[n].start.x, playerRig.position.y, stars[n].start.z)
								, playerRig.position);
				
				// Is star still in player's view range?
				if ( tDist  > 805 )
				{
					
					
					// Reposision star to be in player's view     //  Math.floor(Math.random() * 200) - 100  // (Math.cos(tRadians) * 20
					var tRan = Math.random() * 4 - 2
					stars[n].start = new Vertex(playerRig.position.x + (Math.sin(tRadians + tRan) * 800),
												stars[n].start.y,
												playerRig.position.z + (Math.cos(tRadians + tRan) * 800) );
				}
				
				
				// elongate effect
				stars[n].end = new Vertex( stars[n].start.x + (Math.sin(tRadians) * (fShipSpeed *1.5) ),
										   stars[n].start.y + 0.3,
										   stars[n].start.	z + (Math.cos(tRadians) * (fShipSpeed *1.5)) );
			}
			
			
			
		}
	}
}