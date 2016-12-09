/**
 * main function
 */
function startUpTHREEjs(exports, options, callback){
	startUpTHREEjs.loadStartThreejsScripts(function(){
		startUpTHREEjs.init(exports, options, callback)
	})
}


/**
 * load all the scripts needed by startupthree.js
 */
startUpTHREEjs.loadStartThreejsScripts = function(onLoaded){
	var firstBatchUrls = []
	var secondBatchUrls = []

	firstBatchUrls.push('vendor/three.js/build/three.min.js')
	firstBatchUrls.push('vendor/three.js/examples/js/libs/stats.min.js')

	secondBatchUrls.push('vendor/three.js/examples/js/controls/OrbitControls.js')

	startUpTHREEjs.loadScripts(firstBatchUrls, function(){
		startUpTHREEjs.loadScripts(secondBatchUrls, function(){
			onLoaded()
		})
	})
}

/**
 * load all the scripts
 */
startUpTHREEjs.loadScripts = function(urls, onLoaded){
	var loadedCount = 0
	for(var i = 0; i < urls.length; i++){
		loadScript(urls[i], function(content){
			eval(content)
			loadedCount++;
			if( loadedCount === urls.length ){
				onLoaded()
			}
		})
	}
	return
	function loadScript(url, onLoaded){
		var request = new XMLHttpRequest();
		request.open("GET", url);
		request.onreadystatechange = function(){
			if (request.status === 200 && request.readyState === 4 ){
				onLoaded(request.responseText);
			}
		}
		request.send()
	}
}

	
startUpTHREEjs.init = function(exports, options, callback){
	
	// handle options default values
	options.stats = options.stats !== undefined ? options.stats : false
	options.cameraControls = options.cameraControls !== undefined ? options.cameraControls : 'OrbitControls'

	//////////////////////////////////////////////////////////////////////////////////
	//		Init
	//////////////////////////////////////////////////////////////////////////////////

	// init renderer
	var renderer	= new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// array of functions for the rendering loop
	var onRenderFcts= [];

	// init scene and camera
	var scene	= new THREE.Scene();
	var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
	camera.position.z = 10;
	if( options.cameraControls === 'OrbitControls' ){
		var controls	= new THREE.OrbitControls(camera)
	}else if( options.cameraControls === false ){
		var controls = null
	}else{
		console.assert(false, 'unknown options.cameraControls: ' + options.cameraControls)
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		render the whole thing on the page
	//////////////////////////////////////////////////////////////////////////////////

	// handle window resize
	window.addEventListener('resize', function(){
		renderer.setSize( window.innerWidth, window.innerHeight )
		camera.aspect	= window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()		
	}, false)

	// render the scene
	onRenderFcts.push(function(){
		renderer.render( scene, camera );		
	})
	
	if( options.stats === true ){
	        var statsFrame = new Stats();
	        statsFrame.domElement.style.position = 'absolute';
	        statsFrame.domElement.style.top = '0px';
	        document.body.appendChild( statsFrame.domElement );
		onRenderFcts.push(function(){
			statsFrame.update()
		})		
	}
	
	// run the rendering loop
	var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000)
		})
	})
	
	//////////////////////////////////////////////////////////////////////////////
	//		Code Separator
	//////////////////////////////////////////////////////////////////////////////
	
	exports.renderer = renderer
	exports.scene = scene
	exports.camera = camera
	exports.controls = controls
	exports.onRenderFcts = onRenderFcts
	
	callback(exports)
}
