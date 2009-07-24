package 
{
	import away3d.containers.Scene3D;
	import away3d.core.math.Number3D;
	import away3d.core.utils.Cast;
	import away3d.materials.BitmapMaterial;
	import away3d.materials.TransformBitmapMaterial;
	import away3d.primitives.Plane;
	
	import flash.display.Bitmap;

	
	public class ddShots
	{
		public var mPlanes = new Array();
		public var iShotsLife = new Array();
		public var fShotsUsed = 0;
		private var fShotsSpeed = new Array();		
		private var fShotsSpeedCONST = 6.0;
		public var iMax = 5;
		public var shotIntervalN = 0;
		private var shotInterval = 10;
		
		[Embed(source="/../images/enemyshot.png")] private var ShotImage:Class;
		private var shotBitmap:Bitmap = new ShotImage();
		
		
		public function ddShots(gameScene:Scene3D)
		{
			// Create Objects
			var shotBitmap:BitmapMaterial = new BitmapMaterial(Cast.bitmap(shotBitmap)); //,{smooth:true, precision:1}
			for ( var n = 0; n < iMax; n++)
			{
				mPlanes[n] = new Plane({ material:shotBitmap, segmentsW:1, segmentsH:1,width:15, height:15, ownCanvas:true});			//material:shockwaveBitmap,
				mPlanes[n].y = -5;
				//plane.blendMode = BlendMode.MULTIPLY;
				mPlanes[n].visible = false;
				gameScene.addChild(mPlanes[n]);
			}
		}
		
		public function newShot(startPos:Number3D, startRot:Number3D, fSpeed:Number):void
		{
			var i = -1;
			
			// Check shot interval
			if( shotIntervalN > shotInterval )
			{
				
				shotIntervalN = 0;
				
				
				// Find avilable shot
				for( var n = 0; n < iMax && i == -1; n++)
				{
					if( !mPlanes[n].visible)
						i = n;
				}
				
				if( i != -1 )
				{
					iShotsLife[i] = 50;
					mPlanes[i].position = startPos;
					mPlanes[i].eulers = startRot;
					mPlanes[i].scaleX = 1;
					mPlanes[i].scaleZ = 1;
					mPlanes[i].visible = true;
					fShotsSpeed[i] = fShotsSpeedCONST + fSpeed;
					
					fShotsUsed++;
				}
			}
		}
		
		public function update():void
		{
			for( var n = 0; n < iMax; n++)
			{
				if( mPlanes[n].visible )
				{
					iShotsLife[n]--;
					
					if( iShotsLife[n] > 1 )
						mPlanes[n].moveForward(fShotsSpeed[n]);
					else if ( iShotsLife[n] == 1 )
					{
						mPlanes[n].scaleX = 4;
						mPlanes[n].scaleZ = 2;
					}else
					{
						mPlanes[n].visible = false;
						fShotsUsed--;
					}
				}
			}
		}
	}
}