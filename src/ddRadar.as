package
{
	import away3d.cameras.Camera3D;
	import away3d.containers.Scene3D;
	import away3d.containers.View3D;
	import away3d.core.clip.RectangleClipping;
	import away3d.core.base.Vertex;
	import away3d.materials.WireColorMaterial;
	import away3d.materials.WireframeMaterial;
	import away3d.primitives.LineSegment;
	import flash.geom.Vector3D;
	
	import flash.display.Sprite;

	public class ddRadar extends Sprite
	{
		public var cam:Camera3D;
		public var View:View3D;
		
		public var ratio;
		
		private var dots = new Array();
		
		public function ddRadar(w:Number,h:Number,x:Number,y:Number,viewScene:Scene3D)
		{
			var vTemp:Vertex;
			
			ratio = 0.02;
			
			// create a camera
			cam = new Camera3D( { zoom:10, focus:100 } );
			
			cam.position = new Vector3D(0,0 , 400);
			cam.lookAt( new Vector3D(0, 0, 0) );
			
			// create the viewport and attach it to the Sprite so we can mask and move it
			View = new View3D({scene:viewScene,camera:cam,x:w/2,y:h/2});
			var myClip:RectangleClipping = new RectangleClipping({minX:-w/2,minY:-h/2,maxX:w/2,maxY:h/2});
			View.clipping = myClip;
			
			
			
			// add a border
			var border:Sprite = makeBorder(w,h);
			addChild(border);
			
			
			// Add View and position Sprite
			addChild(View);
			this.x = x;
			this.y = y;
			
			
			
			for ( var n = 0; n < 20; n++)
			{
				dots[n] = new LineSegment({material:new WireframeMaterial(0xFF0000, {width:2})});
				dots[n].visible = false;
				viewScene.addChild(dots[n]);
			}
			
		}
		
		public function activeDotsSet(tot:Number)
		{
			for ( var n = 0; n < 20; n++)
			{
				if( n < tot)
					dots[n].visible = true;
				else
					dots[n].visible = false;
			}
		}
		
		public function setActive( n:Number, state)
		{
			dots[n].visible = state;
		}
		
		public function updateDot(n:Number, x:Number, y:Number)
		{
			dots[n].start = new Vertex(-x*ratio, y*ratio, 0);
			dots[n].end = new Vertex(-x*ratio, y*ratio + 0.15, 0);
		}
		
		private function makeBorder(w:Number, h:Number ):Sprite
		{
			var border:Sprite = new Sprite();
			
			//border.graphics.lineStyle(0,0xcccccc);
			//border.graphics.drawRect(0, 0, w, h);
			
			// Viewing border
			border.graphics.lineStyle(0,0x999999);
			border.graphics.drawRect(w/2, h/2, 1, 1);
			
			return border;
		}
	}
}