/* 
	
*/

var Laboratory = function() {

	var l = {

		//----------------------------------------
		// Variables
		//----------------------------------------

		wndw: {
			width: window.innerWidth,
			height: window.innerHeight,
			centerX: window.innerWidth * 0.5,
			centerY: window.innerHeight * 0.5,
		},

		floor: -250,
		container: null,
		stats: null,
		camera: null,
		scene: null,
		renderer: null,
		mesh: null,
		textures: {},
		mouse: {x: 0, y: 0},
		clock: new THREE.Clock(),

		//----------------------------------------
		// Public Methods
		//----------------------------------------

		init: function() {
			
			_.bindAll(this, 'destroy', 'addListeners', 'removeListeners', 'onUpdate', 'onMouseMove', 'onMouseDown', 'onMouseUp', 'onResize', 'render', 'onModelLoadComplete', 'onImageLoadComplete');
			
			this.container = $('.laboratory')[0];

			// Camera
			this.camera = new THREE.PerspectiveCamera( 45, this.wndw.width / this.wndw.height, 1, 10000 );
			this.camera.position.z = 20;

			// Scene
			this.scene = new THREE.Scene();
			this.scene.fog = new THREE.Fog( 0xffffff, 2000, 10000 );
			this.scene.add( this.camera );

			//Lights
			var ambient = new THREE.AmbientLight( 0x101030 );
			this.scene.add( ambient );

			var light = new THREE.DirectionalLight( 0xffeedd );
			light.position.set( 0, 0, 1 ).normalize();
			this.scene.add( light );

			// Renderer
			this.renderer = new THREE.WebGLRenderer( { antialias: true } );
			this.renderer.setSize( this.wndw.width, this.wndw.height );

			this.container.appendChild( this.renderer.domElement );

			// Stats
			this.stats = new Stats();
			this.container.appendChild( this.stats.domElement );

			// Texture
			this.textures.will = new THREE.Texture();
			// Image Loader
			var iloader = new THREE.ImageLoader();
			iloader.name = 'will';
			iloader.addEventListener( 'load', this.onImageLoadComplete);
			iloader.load('assets/img/image.png');

			// Object Loader
			var loader = new THREE.OBJLoader();
			loader.addEventListener('load', this.onModelLoadComplete);
			loader.load("assets/models/will.obj");

			$(document).bind('mousemove', this.onMouseMove);
			$(document).bind('mousedown', this.onMouseDown);
			$(document).bind('mouseup', this.onMouseUp);
			window.addEventListener('resize', this.onResize, false);
			window.animationframe.addListener(this.onUpdate);
		},

		destroy: function() {


		},

		addListeners: function() {

			
		},

		removeListeners: function() {

			
		},

		//----------------------------------------
		// Private Methods
		//----------------------------------------

		render: function() {

			this.camera.position.x += ( this.mouse.x - this.camera.position.x ) * 0.05;
			this.camera.position.y += ( - this.mouse.y - this.camera.position.y ) * 0.05;

			this.camera.lookAt( this.scene.position );

			this.renderer.render( this.scene, this.camera );

		},

		clamp: function(min, max, value)
		{
			return Math.max(Math.min(value, max), min);
		},
		
		loop: function(min, max, value)
		{
			var dif = max-min;
			var val;
			
			if(value < min)
			{
				val = (min - value) % dif;
				return max - val;
			}
			 else if(value > max)
			{
				val = (value - max) % dif;
				return min + val;
			}
			
			return value;
		},

		//----------------------------------------
		// Event Handlers
		//----------------------------------------

		onImageLoadComplete: function(event)
		{	
			var name = event.target.name;
			this.textures[name].image = event.content;
			this.textures[name].needsUpdate = true;
		},

		onModelLoadComplete: function(event)
		{
			var object = event.content;
			var that = this;
			object.traverse( function ( child ) {
				if(child instanceof THREE.Mesh && that.textures[child.name])
				{
					child.material.map = that.textures[child.name];
				}
			});

			//object.position.y = - 80;
			this.scene.add( object );
		},

		onUpdate: function() {

			this.render();
			this.stats.update();
			
		},

		onMouseMove: function(event) {
			this.mouse.x = this.clamp(-25, 25, ( event.clientX - this.wndw.centerX ));
			this.mouse.y = this.clamp(-25, 25, ( event.clientY - this.wndw.centerY ));
		},

		onMouseDown: function(event) {
			
		},

		onMouseUp: function(event) {
			
		},

		onResize: function(event) {
			this.wndw.width = window.innerWidth;
			this.wndw.height = window.innerHeight;
			this.wndw.centerX = window.innerWidth * 0.5;
			this.wndw.centerY = window.innerHeight * 0.5;
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize( window.innerWidth, window.innerHeight );
		}
	}

	l.init();

	return l;
}
