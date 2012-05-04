package
{
	import away3d.core.base.*;
	import away3d.core.light.AmbientLight;
	import away3d.core.project.MovieClipSpriteProjector;
	import gs.utils.tween.ArrayTweenInfo;
	
	import away3d.cameras.Camera3D;
	import away3d.containers.ObjectContainer3D;
	import away3d.containers.Scene3D;
	import away3d.containers.View3D;
	
	import away3d.loaders.*;
	
	import away3d.core.math.Number2D;
	import away3d.core.math.Number3D;
	import away3d.core.math.MatrixAway3D;
	import away3d.core.utils.Cast;
	
	import away3d.core.light.AmbientLight;
	
	import away3d.materials.BitmapMaterial;
	import away3d.materials.TransformBitmapMaterial;
	import away3d.primitives.Plane;
	//import away3d.primitives.Cube;
	import away3d.primitives.Sphere;
	
	
	import away3d.materials.WireColorMaterial;
	//import away3d.materials.WireframeMaterial;
	
	
	import away3d.lights.AmbientLight3D;
	import away3d.lights.DirectionalLight3D;
	import away3d.materials.PhongColorMaterial;

	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	
	//import flash.display.BlendMode;
	import flash.events.Event;
	
	import flash.filters.GlowFilter;

	
	import ddKeys;
	import ddRadar;
	import ddEnemy;
	import ddUtils;
	//import ddPlayer;
	
	import ddShots;
	
	// Effects
	import ddShockwaves;
	import ddParticalSys;
	import ddStars;
	
	public class ddGame extends Sprite
	{
		public static const ROOT_DIR:String = "games/starshipultimatum/";
		
		[Embed(source="/../images/playerlazer.png")] private var PlayerLazerImage:Class;
		private var playerLazerBitmap:Bitmap = new PlayerLazerImage();
		
		[Embed(source="/../images/earth.jpg")] private var EarthImage:Class;
		private var earthBitmap:Bitmap = new EarthImage();
		
		
		private var sphere:Sphere;
		
		

		public var scene:Scene3D;
		private var camera:Camera3D;
		private var view:View3D;
		
		public var sceneRader:Scene3D;
		private var viewRadar:ddRadar;
		
		private var utils:ddUtils = new ddUtils;
		
		
		private var playerRig:ObjectContainer3D;
		private var playerDummyF:ObjectContainer3D;   // Front dummy
		
		private var playerShip:ObjectContainer3D;
		private var playerShipMesh:Object3DLoader;
		private var fShipSpeed = 0;
		private static const playerAccCONST = 0.2;
		private static const playerSpeedMaxCONST = 9;
		private var fYaw = 0;
		private var fYawMax = 2;
		private var fYawAcceleration = 0.2;
		
		
		private static const playerShotInterval:Number = 5;
		private var playerShotIntervalN = 0;
		
		private var score = 0;
		private var iEnergy = 100;
		
		private var energyIncreaseInverval = 40;
		private var energyIncreaseInvervalN = 0;
		

		private var mShots = new Array();
		private var fShotsSpeed = new Array();
		private var iShotsLife = new Array();
		private static const fShotsSpeedCONST = 7.0;
		
		private var cShockwaves:ddShockwaves;
		
		private var cStars:ddStars;

		
		private var mEmemies = new Array;
		private var iEmemies = 0;
		private var iEmemiesMAX = 8;
		private var partEnemyMinior:ddParticalSys;
		private var ememyUpdateN = 0;
		private var ememyUpdateC = 0;

		private var myInput:ddKeys;
		
		//private var mLoader;
		private var mUI;
		
		private var mSound;
		
		
		private var levelEnemies:Array = new Array();
		

		//private var player1:ddPlayer;

		public function ddGame()
		{
			// set up the stage
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.NO_BORDER;

			// Add resize event listener
			//stage.addEventListener(Event.RESIZE, onResize);

			
			//mLoader = new mPreLoader();
			//addChild(mLoader);
			
			this.addEventListener(Event.ENTER_FRAME, loop);
			
			// Initialise
			init3D();
			

			// Create the 3D objects
			createScene();
			
			var keySprite = new Sprite();
			addChild(keySprite);
			myInput = new ddKeys(keySprite);


			myInput.trackKey(myInput.SPACE_BAR);
			myInput.trackKey(myInput.UP_ARROW);
			myInput.trackKey(myInput.DOWN_ARROW);
			myInput.trackKey(myInput.LEFT_ARROW);
			myInput.trackKey(myInput.RIGHT_ARROW);

			// Initialise frame-enter loop
			
			
			
			//mLoader.loader_txt = "TEST";
			
    }

	//private function loading(e:Event):void
	//{
//
		//var total:Number = this.stage.loaderInfo.bytesTotal;
		//var loaded:Number = this.stage.loaderInfo.bytesLoaded;
//
		//mLoader.bar_mc.scaleX = loaded/total;
		//mLoader.loader_txt.text = Math.floor((loaded/total)*100)+ "%";
//
		//if (total == loaded) {
			//play();
			//this.addEventListener(Event.ENTER_FRAME, loop);
		//}
//
	//}
	
    private function init3D():void
	{
		// Create a new scene where all the 3D objects will be rendered
		scene = new Scene3D();
		sceneRader = new Scene3D();

		scene.autoUpdate = false;
		sceneRader.autoUpdate = false;

		// Create a new camera, passing some initialisation parameters
		camera = new Camera3D({zoom:25, focus:30, x:0, y:350, z:-370});
		camera.lookAt(new Number3D(0, 0, 0));

		// Create a new view that encapsulates the scene and the camera
		view = new View3D({scene:scene, camera:camera});
	
		// Centre the viewport
		view.x = stage.stageWidth / 2 - 75;
		view.y = stage.stageHeight / 2;
		
		// Add our Away3D instance
        addChild(view);
		
		
		// Overlay our UI Movie Clip
		mUI = new mInterface();
		addChild(mUI);
		
		// Sound
		mSound = new mSounds();
		addChild(mSound);
		
    }

    private function createScene():void {

		// Create an object container to group the player's camera and ship
		playerRig = new ObjectContainer3D();
		playerShip = new ObjectContainer3D();
		playerDummyF = new ObjectContainer3D();
		playerDummyF.z = 150;
		
		
		var shipMaterial:PhongColorMaterial = new PhongColorMaterial(0xFFFFFF);
		shipMaterial.shininess = 100;
		//shipMaterial.specular = 50;
		
		playerShipMesh = Max3DS.load(ROOT_DIR + "ship.3ds", {material:shipMaterial, lighting:true, scaling:2, y:0, x:0, z:0, loadersize:300});
		// add the loader object to the scene
		playerShipMesh.rotationX = 90;
		playerShipMesh.scale(3);
		playerShip.addChild(playerShipMesh);
		playerShip.addChild(playerDummyF);
		playerRig.addChild(playerShip);
		playerRig.addChild(camera);
		scene.addChild(playerRig);
		
		var n;
		
		
		// Set UI controls
		mUI.mScore.text = score;
		
		
		cStars = new ddStars(playerRig, scene);
		
	
	
		// Create Objects in game
		for ( n = 0; n < 20; n++)
		{
			
			var playerLazerBitmap:BitmapMaterial = new BitmapMaterial(Cast.bitmap(playerLazerBitmap));
			mShots[n] = new Plane({ material:playerLazerBitmap, segmentsW:1, segmentsH:1,width:25, height:25, ownCanvas:true});
			
			//mShots[n].rotationZ = 90;
			mShots[n].visible = false;
			iShotsLife[n] = 0;
			scene.addChild(mShots[n])
		}

		// Create a new sphere object using a bitmap material representing the earth
		var earthMaterial:BitmapMaterial = new BitmapMaterial(Cast.bitmap(earthBitmap),{smooth:true, precision:2});
		sphere = new Sphere({material:earthMaterial, lighting:true, radius:75, segmentsW:20, segmentsH:20});
		sphere.x = 150;
		var myFilter2:Array = new Array();
		myFilter2.push(new GlowFilter(0xFFFFFF, 0.4, 15, 15, 2, 1, false, false));
		sphere.ownCanvas=true;
		sphere.filters=myFilter2;
		
		scene.addChild(sphere);
		
		
	
		for ( n = 0; n < iEmemiesMAX; n++)  //EmemiesMaxCONST
		{
			mEmemies[n] = new ddEnemy(scene);
		}
		
		
		cShockwaves = new ddShockwaves(scene);
		
		partEnemyMinior = new ddParticalSys("enemy_minor", scene); // Enemy minor damage affect
		partEnemyMinior.particalsPerInterval = 4;
		
		
		// create a new directional white light source with specific ambient, diffuse and specular parameters
		var light:DirectionalLight3D = new DirectionalLight3D({color:0xFFFFFF, ambient:0.3, diffuse:0.6, specular:0.9});
		light.x = 300;
		light.z = 400;
		light.y = 500;
		scene.addChild(light);
		
		//var lightAmbient:AmbientLight3D = new AmbientLight3D( { color:0xFFFFFF, ambient:0.2 } );
		//scene.addChild(lightAmbient);
		
		
		// Rader
		viewRadar = new ddRadar(202, 202, 588, 80, sceneRader);
		addChild(viewRadar);
		
		
		
		
		startLevel();
    }

	
	private function startLevel():void
	{
		levelEnemies[0] = "suicidal";
		levelEnemies[1] = "shyguy";
		levelEnemies[2] = "shyguy";
		levelEnemies[3] = "shyguy";
		levelEnemies[4] = "pursu";
		levelEnemies[5] = "pursu";
		levelEnemies[6] = "pursu";
		
		
		iEnergy = 100;
		mUI.mEnergyWarning.visible = false;
		
		spawnEnemy();
		spawnEnemy();
		spawnEnemy();
		spawnEnemy();
		spawnEnemy();
		spawnEnemy();
		spawnEnemy();
		
		
		
	}
	
    private function loop(event:Event):void
	{
		// Prevent camera position delay
		camera.position = new Number3D(0, 400, -400);
		
		var i;
		
		// rotate the group of objects
		if( myInput.isKeyDown(myInput.LEFT_ARROW) )
		{
			if ( fYaw > -fYawMax )
			{
				fYaw -= fYawAcceleration;
				iEnergy = iEnergy - 0.09;
			}
			
		}else if ( myInput.isKeyDown(myInput.RIGHT_ARROW) )
		{
			if ( fYaw < fYawMax)
			{
				fYaw += fYawAcceleration;
				iEnergy = iEnergy - 0.09;
			}
			
		}else
		{
			if ( fYaw > 0 + fYawAcceleration)
			{
				fYaw -= fYawAcceleration;
				iEnergy = iEnergy - 0.09;
			}else if ( fYaw < 0 - fYawAcceleration)
			{
				fYaw += fYawAcceleration;
				iEnergy = iEnergy - 0.09;
			}else
				fYaw = 0;
		}
		
		playerShip.rotationX = Math.abs(fYaw * (fShipSpeed * 0.2));
		playerShip.rotationZ = -fYaw * (3 + fShipSpeed);
		
		playerRig.yaw(fYaw);
		
		// Increase Energy
		if ( energyIncreaseInvervalN > energyIncreaseInverval)
		{
			iEnergy++;
			energyIncreaseInvervalN = 0
		}
		energyIncreaseInvervalN++;
		
		viewRadar.cam.roll( -fYaw);
		
		
		if ( myInput.isKeyDown(myInput.UP_ARROW) )
		{
			if ( fShipSpeed < playerSpeedMaxCONST )
			{
				fShipSpeed += playerAccCONST;
				iEnergy = iEnergy - 0.05;
			}
				
			camera.zoom = 25 - (fShipSpeed * 0.3);
		}
		if ( myInput.isKeyDown(myInput.DOWN_ARROW) )
		{
			if ( fShipSpeed > 0 )
			{
				fShipSpeed -= playerAccCONST;
				iEnergy = iEnergy - 0.05;
			}else
				fShipSpeed = 0;
				
			camera.zoom = 25 - (fShipSpeed * 0.3);
		}
		
		playerRig.moveForward(fShipSpeed);
		viewRadar.cam.moveUp(fShipSpeed * viewRadar.ratio)

		if( myInput.isKeyDown(myInput.SPACE_BAR) )
		{
			if( playerShotIntervalN > playerShotInterval )
			{
				newShot(playerRig.position, playerRig.eulers);
				playerShotIntervalN = 0;
				
				iEnergy = iEnergy - 1;
			}
		}
		playerShotIntervalN++;
		
		
		// Update Enemies, their radar posions, if they've been shot
		for ( var n = 0; n < iEmemiesMAX; n++)
		{
			if ( mEmemies[n].mesh.visible )
			{
				
				//private var ememyUpdateN = 0;
				//private var ememyUpdateC = 0;
				
				
				viewRadar.updateDot(n, mEmemies[n].mesh.x, mEmemies[n].mesh.z);
				
				if( ememyUpdateN == n )
					mEmemies[n].evaluate(playerRig.x, playerRig.z, playerDummyF.scenePosition.x, playerDummyF.scenePosition.z, fShipSpeed, mEmemies);
				
				mEmemies[n].update();
			
				// Check if hit by a player's shot
				for ( i = 0; i < 20; i++)
				{
					// Check if this shot is active
					if ( mShots[i].visible)
					{
						// Check distance
						if ( utils.distance3D(mEmemies[n].mesh.position, mShots[i].position) < 25 )
						{
							hitEnemy(n, "lazer");
							iShotsLife[i] = 0;
						}
					}
				}
				
				// Check collision with player
				if ( playerRig.distanceTo( mEmemies[n].mesh) < 25 )
				{
					hitEnemy(n, "player");
					iEnergy -= 7;
				}
					
			}
			
			
			
			if (mEmemies[n].mShots.fShotsUsed > 0)
			{
				// Check if hit player's shield
				for ( i = 0; i < mEmemies[n].mShots.iMax; i++)
				{
					if ( mEmemies[n].mShots.iShotsLife[i] > 0 )
					{
						if ( playerRig.distanceTo(mEmemies[n].mShots.mPlanes[i]) < 30 )
						{
							iEnergy -= 2;
							mEmemies[n].mShots.iShotsLife[i] = 0;
						}
					}
				}
				mEmemies[n].mShots.update();
			}
			
			// Effects
			if( mEmemies[n].particalsExplosion.iAlive )
				mEmemies[n].particalsExplosion.update();
			
			mEmemies[n].mShots.shotIntervalN++;
		}
		ememyUpdateN++;
		if( ememyUpdateN >= iEmemiesMAX)
			ememyUpdateN = 0;
		
	
		updateShots();
		
		
		cStars.update(playerRig, fShipSpeed);
		
		sphere.yaw(0.3);
		
		
		cShockwaves.update();
		partEnemyMinior.update();
		
		updateUiEnergy();

		sceneRader.update();
		viewRadar.View.render();

		
		// Render the 3D scene
		scene.update();
		view.render();
		
    }
	
	private function spawnEnemy()
	{
		var x = 0;
		var y = 0;
		
		x = Math.floor((Math.random() * 3000) + 1000);
		y = Math.floor((Math.random() * 3000) + 1000);
		if( Math.random() > 0.5)
			x = -x;
		if( Math.random() > 0.5)
			y = -y;
		
		mEmemies[iEmemies].spawn( playerRig.x + x,
								playerRig.z + y,
								levelEnemies[iEmemies]);
								
		viewRadar.setActive(iEmemies, true);
							
		iEmemies++;
	}
	
	private function hitEnemy(n, type)
	{
		var damage;
		var temp2d:Number2D;
		
		if( type == "lazer")
			damage = 0.2;
		else if( type == "player")
			damage = 100;
			
		if( mEmemies[n].hit(damage) )	// True if died
		{
			// Effect
			temp2d = utils.MoveInDirection(mEmemies[n].mesh.rotationY, mEmemies[n].fSpeed * 0.5)
			cShockwaves.newWave(mEmemies[n].mesh.position.x, mEmemies[n].mesh.position.z, 0.04, 0.5, new Number3D(temp2d.x, 0, temp2d.y));
			
			viewRadar.setActive(n, false);
			
			// Update score
			if( type == "lazer")
				addScore(5);
			else if( type == "player")
				addScore(2);
				
			iEmemies--;
			
			
			mSound.gotoAndPlay("explode");
			
		}else
		{
			// Only damaged
			partEnemyMinior.start(mEmemies[n].mesh.position, new Number3D( Math.random() * 360, Math.random() * 360, Math.random() * 360));
		}
	}
	
	private function addScore(i)
	{
		score += i;
		mUI.mScore.text = score;
	}
	
	private function updateUiEnergy()
	{
		mUI.mEnergy.gotoAndStop( 100 - Math.floor( iEnergy) );
		if ( iEnergy < 20)
		{
			mUI.mEnergyWarning.visible = true;
		}else
			mUI.mEnergyWarning.visible = false;
		
	}
	
	private function newShot(startPos:Number3D, startRot:Number3D):void
	{
		var i = -1;
		// Find avilable shot
		for( var n = 0; n < 20 && i == -1; n++)
		{
			if( !mShots[n].visible)
				i = n;
		}
		
		if( i != -1 )
		{
			iShotsLife[i] = 40;
			mShots[i].position = startPos;
			mShots[i].eulers = startRot;
			mShots[i].visible = true;
			mShots[i].scaleX = 1;
			mShots[i].scaleZ = 1;
			fShotsSpeed[i] = fShotsSpeedCONST + fShipSpeed;
		}
	}
	
	private function updateShots():void
	{
		for( var n = 0; n < 20; n++)
		{
			if( mShots[n].visible == true)
			{
				iShotsLife[n]--;
				
				// Check if hit eneimy
				if ( utils.distance3D(mShots[n].position, sphere.position) < 50 )
				{
					iShotsLife[n] = 0;
				}
				
				if( iShotsLife[n] > 1 )
					mShots[n].moveForward(fShotsSpeed[n]);
				else if ( iShotsLife[n] == 1 )
				{
					mShots[n].scaleX = 2.5;
					mShots[n].scaleZ = 2;
				}else
					mShots[n].visible = false;
			}
		}
	}
	

    private function onResize(event:Event):void
	{
      view.x = stage.stageWidth / 2;
      view.y = stage.stageHeight / 2;
    }
	
	
  }
}
