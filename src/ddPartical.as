package 
{
	import away3d.containers.Scene3D;
	import away3d.core.math.Number3D;
	
	import away3d.core.utils.Cast;
	
	import away3d.materials.BitmapMaterial;
	import away3d.materials.TransformBitmapMaterial;
	import away3d.materials.ShadingColorMaterial;

	
	import away3d.primitives.Plane;
	import away3d.primitives.Triangle;
	
	import away3d.core.base.Vertex;
	
	import flash.display.Bitmap;
	
	import ddPartical;
	
	public class ddPartical
	{
		public var mesh;
		public var sType;
		
		public var iLife;
		private var iLifeStart;
		
		public var vVelocity;
		public var vRotation;
		public var inUse;
		
		[Embed(source="/../images/dibry.png")] private var dibryImage:Class;
		private var dibryBitmap:Bitmap = new dibryImage();
		
		
		public function ddPartical(type, gameScene:Scene3D)
		{
			// Create Mesh
			
			
			if (  type == "triangle_red" )			// Enemy shatterd hull
			{
				var eMaterial:ShadingColorMaterial = new ShadingColorMaterial(0xff0000);	
				eMaterial.ambient_brightness = 100;
				
				mesh = new Triangle( { material:eMaterial, lighting:true, bothsides:true, ownCanvas:true } );
				
				mesh.a = new Vertex(0,Math.random() * 20 +2,0);
				mesh.b = new Vertex(Math.random() * 10 +2,0,0);
				mesh.c = new Vertex(Math.random() * 10 +2,0,0);
			}
			else //if ( type == "billboard_glowing")
			{
				var dibryBitmap:BitmapMaterial = new BitmapMaterial(Cast.bitmap(dibryBitmap),{smooth:true, precision:1});	
				mesh = new Plane( { material:dibryBitmap,  segmentsW:1, segmentsH:1, ownCanvas:true } );
				mesh.width = Math.random() * 15 + 7;
				mesh.height = Math.random() * 15 + 7;
			}
			
			
			mesh.visible = false;
			gameScene.addChild(mesh);
			
			inUse = false;
			sType = type;	
		}
		
		public function spawn(startPos:Number3D, startRot:Number3D, vVel:Number3D, vRot:Number3D):void
		{
			iLife = iLifeStart = 50;
			mesh.position = startPos;
			mesh.eulers = startRot;
			mesh.visible = true;
			vVelocity = vVel;
			vRotation = vRot;
			inUse = true;
		}
		
		public function update()
		{
			if ( iLife > 1 )
			{
				mesh.x += vVelocity.x;
				mesh.y += vVelocity.y;
				mesh.z += vVelocity.z;
				
				mesh.pitch(vRotation.x);
				mesh.yaw(vRotation.y);
				mesh.roll(vRotation.z);
				
				mesh.alpha = ((100 / iLifeStart) * iLife) * 0.01;
				
				iLife--;
				return true;
			}else
			{
				mesh.visible = false;
				inUse = false;
				return false;
			}
		}
	}
}