package
{
	import away3d.containers.ObjectContainer3D;
	import away3d.core.utils.Cast;
	import away3d.materials.BitmapMaterial;
	import away3d.materials.TransformBitmapMaterial;
	import away3d.primitives.Cube;
	
	import flash.display.Bitmap;
	import flash.display.Sprite;
	
	public class ddPlayer
	{
		
			
			
		public function ddPlayer(number)
		{
			// Load 3D data
			mShot = new Cylinder({material:earthMaterial, radius:10, height:100, segmentsW:3});
			mShot.visible = false;
			parent.scene.addChild(mShot)
		}
		
	}
}