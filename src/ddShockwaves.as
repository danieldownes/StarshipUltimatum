package 
{
	import away3d.containers.Scene3D;
	
	import away3d.core.math.Number3D;
	import away3d.core.math.Number2D;
	
	import away3d.core.utils.Cast;
	
	import away3d.materials.BitmapMaterial;
	import away3d.materials.TransformBitmapMaterial;
	import away3d.primitives.Plane;

	import flash.display.Bitmap;
	
	public class ddShockwaves
	{
		private static const MaxCONST = 10;
		
		
		[Embed(source="/../images/shockwave.png")] private var ShockImage:Class;
		private var shockwaveBitmap:Bitmap = new ShockImage();
		
		private var mPlanes = new Array();
		private var fScales = new Array();
		private var fDecays = new Array();
		private var fSpeeds = new Array();
		private var vVel = new Array();			// Move wave in direction
		
		public function ddShockwaves(gameScene:Scene3D)
		{
			// Create Objects
			for ( var n = 0; n < MaxCONST; n++)
			{
				var shockwaveBitmap:BitmapMaterial = new BitmapMaterial(Cast.bitmap(shockwaveBitmap),{smooth:true, precision:1});
				mPlanes[n] = new Plane({material:shockwaveBitmap, segmentsW:1, segmentsH:1,width:25, height:25, ownCanvas:true});			
				mPlanes[n].y = -5;
				//plane.blendMode = BlendMode.MULTIPLY;
				mPlanes[n].visible = false;
				gameScene.addChild(mPlanes[n]);
				vVel[n] = new Number3D;
			}
		}
		
		public function newWave(x, y, decayRate, speed, vVelocity:Number3D):void
		{
			var i = -1;
			// Find avilable 
			for( var n = 0; n < MaxCONST && i == -1; n++)
			{
				if( !mPlanes[n].visible)
					i = n;
			}
			
			if( i != -1 )
			{
				mPlanes[i].x = x;
				mPlanes[i].z = y;
				mPlanes[i].visible = true;
				mPlanes[i].alpha = 1;
				fScales[i] = 1;
				fDecays[i] = decayRate;
				fSpeeds[i] = speed;
				vVel[i] = vVelocity;
			}
		}
		
		public function update():void
		{
			for ( var n = 0; n < MaxCONST; n++)
			{
				if ( mPlanes[n].alpha > -1)
				{
					mPlanes[n].alpha -= fDecays[n];
					fScales[n] += fSpeeds[n];
					mPlanes[n].scale(fScales[n]);
					mPlanes[n].x += vVel[n].x;
					mPlanes[n].y += vVel[n].y;
					mPlanes[n].z += vVel[n].z;
				}else
					mPlanes[n].visible = false;
			}
		}
	}
}