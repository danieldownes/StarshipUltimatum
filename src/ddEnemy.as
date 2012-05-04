package
{
	import away3d.containers.Scene3D;
	import away3d.primitives.Plane;
	import flash.geom.Point;
	import flash.geom.Vector3D;
	//import gs.utils.tween.ArrayTweenInfo;
	
	import away3d.core.clip.RectangleClipping;
	
	
	import away3d.containers.ObjectContainer3D;
	
	import away3d.core.base.Vertex;
	
	//import away3d.materials.WireColorMaterial;
	//import away3d.materials.WireframeMaterial;
	import away3d.primitives.Cube;
	
	
	import away3d.materials.ShadingColorMaterial;
	import away3d.loaders.*;
	
	import flash.display.Sprite;
	
	import flash.filters.GlowFilter;
	
	import ddShots;
	import ddUtils;
	
	import ddParticalSys;

	public class ddEnemy extends Sprite
	{
		
		private var utils:ddUtils = new ddUtils();
		
		public var mesh:ObjectContainer3D;
		public var meshData:Cube; // Loader3D???;
		
		
		public var fSpeed = 0;
		private var fSpeedMax = 11;
		private var fAcceleration = 0.33;
		
		
		private var fYaw = 0;
		private var fYawMax = 2.5;
		private var fYawAcceleration = 3;
		
		public var mShots:ddShots;
		private var bTakeShots = false;
		
		private var knownPlayerSpeed;
		
		private var iYawJitter1;
		private var iYawJitter2;
		
		
		// shotProbablility
		// shotRechargeTime
		// shotMaxRate
		
		private var energy = 1.0;		// Affects speed / fire-rate / state
		
		private var bravery = 0.5;		// Set per enemy and affects decisions when changing state
		
		
		/* prog  :  type of programme to be carried out
		 *
		 *  'shyguy'  .. intercept > when in range take a shot or two > evade
		 *  'pursu'   .. intercept > take some shots > seek > shots >
		 * 				  evade when energy < 30 +- bravery factor
		 * 				  if energy < 20 and bravery > 80  suicide!
		 *  'suicidal' .. intercept, when in ranage, seekUnlimited (no avoidence + additional speed)
		 *
		*/
		public var prog:String;
		
		
		public var state:String = "";
		
		
		public var DistancePlayer = 0;		// Distance to player
		public var DistancePlayerF = 0;		// Distance to 150 in front of player
											// (useful when checking if enemy is too close to the front)
		
		public var particalsExplosion;
		
		
		public function ddEnemy(gameScene:Scene3D)
		{
			var vTemp:Vertex;
			
			mesh = new ObjectContainer3D();
			
			var eMaterial:ShadingColorMaterial = new ShadingColorMaterial(0xff0000);
			//eMaterial.shininess = 100;
			eMaterial.ambient = 1.5;
			meshData = new Cube( { material:eMaterial, width:20, height:10, depth:20 } );
			//meshData =  Max3DS.load(ddGame.ROOT_DIR + "enemy.3ds", { material:eMaterial, lighting:true, scaling:0.2, y:0, x:0, z:0, rotationX:90, loadersize:300 } );
			meshData.scale(0.15);
			
			var myFilter:Array = new Array();
			myFilter.push(new GlowFilter(0xFF1111, 0.6, 17, 17, 2, 1, false, false));
			meshData.ownCanvas=true;
			meshData.filters=myFilter;
			
			//new Sphere( { lighting:true, radius:15, segmentsW:10, segmentsH:10 } );
			mesh.addChild(meshData);
			
			gameScene.addChild(mesh);
			
			mesh.visible = false;
			
			
			
			//mesh.rotationX
			
			// Shots
			mShots = new ddShots(gameScene);
			
			
			particalsExplosion = new ddParticalSys("enemy_explosion", gameScene);
			
		}
		
		public function spawn(x:Number, y:Number, programme:String)
		{
			mesh.x = x;
			mesh.z = y;
			mesh.visible = true;
			energy = 1;
			prog = programme;
		}
		
		
		public function checkProgramme()
		{
			if( prog == "pursu" )
			{
				if( state == "" )
					state = "intercept";
				
				else if( state == "intercept")
				{
					if ( DistancePlayerF < 100)
					{
						state = "evade";
						bTakeShots = false;
					}
					else if (DistancePlayerF < 250 || DistancePlayer < 275)
						bTakeShots = true;
						
					if ( energy <= 0.3 )
					{
						state = "evade";
						bTakeShots = false;
					}
				}
				
				else if ( state == "evade300")
				{
					if( DistancePlayerF > 300)
						state = "intercept";
				}
				
				else if ( state == "evade")
				{
					if( DistancePlayerF > 550)
						state = "intercept";
				}
			}
			
			if( prog == "shyguy" )
			{
				if( state == "" )
					state = "intercept";
				
				else if( state == "intercept")
				{
					if ( DistancePlayerF < 100)
					{
						state = "evade300";
						bTakeShots = false;
					}
					else if (DistancePlayerF < 250 || DistancePlayer < 275)
						bTakeShots = true;
					
					if ( energy <= 0.4 )
					{
						state = "evade";
						bTakeShots = false;
					}
				}
				
				else if ( state == "evade300")
				{
					if( DistancePlayerF > 300)
						state = "intercept";
				}
			}
			
			if( prog == "suicidal" )
			{
				if( state == "" )
					state = "seek";
			}
		}
		
		
		public function evaluate(x:Number, y:Number, xF:Number, yF:Number, playerSpeed, enemies:Array )
		{
			
			var u:Point;
			var Sr:Vector3D = new Vector3D;
			var St:Point = new Point;
			
			var targetX;
			var targetY;
			
			DistancePlayer = utils.distance3D( mesh.position, new Vector3D(x, 0, y) );
			DistancePlayerF = utils.distance3D( mesh.position, new Vector3D(xF, 0, yF) );
			
			checkProgramme();
			
			
			
			if ( state == "seek" )
			{
				u = VRotate2D(mesh.rotationY,(new Point(x - mesh.position.x ,y - mesh.position.z) ));
				u.normalize(1);
				
				
				if( u.x > -0.001 )
					YawRight(false);
				else if( u.x < 0.001 )
					YawLeft(false);
					
				ThrustForward(100);
			}
			
			if ( state == "evade" || state == "evade300" )
			{
				
				u = VRotate2D(mesh.rotationY,(new Point(x - mesh.position.x ,y - mesh.position.z) ));
				u.normalize(1);
				
				
				if( u.x < 0.05 )
					YawRight(false);
				else if( u.x > -0.05 )
					YawLeft(false);
				
				if ( fSpeed > 5 && DistancePlayer < 100)
					ThrustForward(1);
				else
					ThrustForward(100);
			}
			
			if ( state == "intercept" )
			{
				var Vr = fSpeed;
				
				Sr.x = x - mesh.x;
				Sr.y = y - mesh.z;
				Sr.z = 0;
				var tc = Magnitude2D(Sr) / Vr;
				St.x = x;
				St.y = y; // + (speed * tc);

				// changed this line to use St.x/St.y instead of x/y:
				u = VRotate2D(mesh.rotationY, (new Point(St.x - mesh.x , St.y - mesh.z) ));


				u.normalize(1);
				
				// Only update the enemy's 'known player speed' "somtimes"
				//  .. This will give a unquie lag time / reaction rate to that enemy.
				if ( DistancePlayer < 170)
				{
					if( Math.random() > 0.95 )
						knownPlayerSpeed = playerSpeed;
				}else
				{
					knownPlayerSpeed = playerSpeed;
				}
				
				if( u.x > -0.05 )
					YawRight(false);
				else if( u.x < 0.05 )
					YawLeft(false);
				
				
				if (DistancePlayer < 250 )
					ThrustForward(knownPlayerSpeed);
				else
					ThrustForward(100);
				
				if ( bTakeShots )
				{
					if( u.x > -0.2 && u.x < 0.2)
						mShots.newShot(mesh.position, mesh.eulers, fSpeed);
				}
			}
			
			
			// Collision avoidence of static world objects
			if ( utils.distance3D( mesh.position, new Vector3D(150, 0, 0) ) < 250 )
			{
				Sr.x = 150 - mesh.x;		// Temp Sphere/world
				Sr.y = 0 - mesh.z;
				Sr.z = 0;
				tc = Magnitude2D(Sr) / Vr;
				u = VRotate2D(mesh.rotationY, (new Point(mesh.x , mesh.z) ));
				
				// Override previous yaws
				if( u.x < 1.5 )
					YawLeft(true);
				else if( u.x > -1.5 )
					YawRight(true);
					
			}
			
			
			// Collision avoidence of player
			else if ( DistancePlayer < 130 && prog != "suicidal" )
			{
				Sr.x = x - mesh.x;		// Temp Sphere/world
				Sr.y = y - mesh.z;
				tc = Magnitude2D(Sr) / Vr;
				u = VRotate2D(mesh.rotationY, (new Point(mesh.x , mesh.z) ));
				
				// Override previous yaws
				if( u.x < 1.5 )
					YawLeft(true);
				else if( u.x > -1.5 )
					YawRight(true);
			}
			
			// Avoidence of other enemies
			var i = -1;
			var s = -1;
			var t;
			for( var n = 0; n <  enemies.length; n++)
			{
				if( enemies[n].mesh.visible )
				{
					if ( enemies[n].mesh.position != this.mesh.position)
					{
						// Find closest
						t = mesh.distanceTo(enemies[n].mesh);
						if ( t < 30)
						{
							if ( t > s)
							{
								i = n;
								s = t;
							}
						}
					}
					//trace("Checking:" +n);
				}
			}
			// We found a close enemy, lets avoid it...
			if( i != -1)
			{
				Sr.x = enemies[i].x - mesh.x;		// Temp Sphere/world
				Sr.y = enemies[i].y - mesh.z;
				Sr.z = 0;
				tc = Magnitude2D(Sr) / Vr;
				u = VRotate2D(mesh.rotationY, (new Point(mesh.x , mesh.z) ));
				
				// Override previous yaws
				if( u.x < 1.5 )
					YawLeft(utils.normLinear(u.x,1.5,1) );
				else if( u.x > -1.5 )
					YawRight(utils.normLinear(u.x,1.5,1));
				
				ThrustForward(Math.random() * 25);
				
				trace( n + " avoiding " + i);
			}
		}
		
		public function update()
		{
			
			// Advance
			mesh.yaw(fYaw);
			mesh.moveForward(fSpeed);
			
			
			// Regenerate energy
			if( energy < 1)
				energy += 0.003;
			else
				energy = 1;
			
			//fSpeed -= 0.2;
			if( fYaw > 0.3)
				fYaw -= 0.2;
			else if( fYaw < 0.3 )
				fYaw += 0.2;
			else
				fYaw += 0;
				
			
		}
		
		private function ThrustForward(targetSpeed)
		{
			if ( targetSpeed > fSpeed)
			{
				if( fSpeed < (fSpeedMax * energy) )
					fSpeed += fAcceleration;
				else
					fSpeed -= fAcceleration;
			}else
			{
				if( fSpeed > 0 )
					fSpeed -= fAcceleration;
				else
					fSpeed = 0;
			}
		}
		
		private function YawLeft(avoid)
		{
			// Attempt to remove jitter...
			if( iYawJitter1 == "r" && iYawJitter2 == "l" )
			{
				fYaw = -fYawMax*0.5;
			}else
			{
				//if( fYaw > -fYawMax)
				//	fYaw -= fYawAcceleration;
				
				fYaw = -fYawMax;
			}
			
			if ( !avoid)
			{
				iYawJitter2 = iYawJitter1;
				iYawJitter1 = "l";
			}
		}
		
		private function YawRight(avoid)
		{
			// Attempt to remove jitter...
			if( iYawJitter1 == "l" && iYawJitter2 == "r" )
			{
				fYaw = fYawMax*0.5;
			}else
			{
				
				fYaw = fYawMax;
			}
			
			if ( !avoid)
			{
				iYawJitter2 = iYawJitter1;
				iYawJitter1 = "r";
			}
		}
		
		public function hit(strenth:Number)
		{
			// Returns true if killed with this hit
			
			energy -= strenth;
			if ( energy < 0.1)
			{
				die();
				return true;
			}else
				return false;
		}
		
		private function die()
		{
			mesh.visible = false;
			particalsExplosion.start(mesh.position, new Vector3D( Math.random() * 360, Math.random() * 360, Math.random() * 360) );
		}
		
		
		
		
		
		public function VRotate2D( angle, u:Point ):Point
		{
			//float	x,y;

			var x = u.x * Math.cos(DegreesToRadians(-angle)) + u.y * Math.sin(DegreesToRadians(-angle));
			var y = -u.x * Math.sin(DegreesToRadians(-angle)) + u.y * Math.cos(DegreesToRadians(-angle));

			return new Point( x, y);
		}
		
		public function Magnitude2D( vec:Vector3D )
		{
			return  Math.sqrt(vec.x * vec.x + vec.y * vec.y);
		}
		
		public function DegreesToRadians(deg):Number
		{
			return deg * 3.14159 / 180.0;
		}
		
		
		public function angleBetween(x1, y1, r1, x2, y2, r2):Number
		{
			return Math.atan2(x1 - x2, y1 - y2) * 180 / 3.14159 - r2;
		}
		
	}
}