// see devsrv.config.json for threejs version dynamically replaced by devsrv
import * as THREE from 'https://cdn.skypack.dev/three@THREEJSVERSION';
import { BoxLineGeometry } from 'https://cdn.skypack.dev/three@THREEJSVERSION/examples/jsm/geometries/BoxLineGeometry.js';
import { XRControllerModelFactory } from 'https://cdn.skypack.dev/three@THREEJSVERSION/examples/jsm/webxr/XRControllerModelFactory.js';

import { CanvasUI } from '../../jsm/CanvasUI.js'
import { VRButton } from '../../jsm/VRButton.js';

class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
                
		this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
		this.camera.position.set( 0, 1.6, 0 );
        
		this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x505050 );
        this.scene.add( this.camera );

		this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );
        
        this.initScene();
        this.setupXR();
        
        window.addEventListener('resize', this.resize.bind(this) );
	}	
    
    initScene(){
        this.room = new THREE.LineSegments(
					new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ),
					new THREE.LineBasicMaterial( { color: 0x808080 } )
				);
        this.room.geometry.translate( 0, 3, 0 );
        this.scene.add( this.room );
        
        this.createUI();
    }
    
    createUI() {
        function onChanged( txt ){
            console.log( `message changed: ${txt}`);
        }
        
        function onEnter( txt ){
            console.log(`message enter: ${txt}`);
        }
        
        const config = {
            renderer: this.renderer,
            panelSize: { width: 1.6, height: 0.4 },
            height: 128,
            message: { type: "input-text", position: { left: 10, top: 8 }, height: 56, width: 492, backgroundColor: "#ccc", fontColor: "#000", onChanged, onEnter },
            label: { type: "text", position: { top: 64 }}
        }
        const content = {
            message: "",
            label: "Select the panel above."
        }
        this.ui = new CanvasUI( content, config );
        this.ui.mesh.position.set( 0, 1.5, -2 );
        this.scene.add( this.ui.mesh );
    }
    
    setupXR(){
        this.renderer.xr.enabled = true; 
        
        new VRButton( this.renderer );
        
        const controllerModelFactory = new XRControllerModelFactory();

        // controller
        this.controller = this.renderer.xr.getController( 0 );
        this.scene.add( this.controller );
                
        this.controllerGrip = this.renderer.xr.getControllerGrip( 0 );
        this.controllerGrip.add( controllerModelFactory.createControllerModel( this.controllerGrip ) );
        this.scene.add( this.controllerGrip );
        
        // controller
        this.controller1 = this.renderer.xr.getController( 1 );
        this.scene.add( this.controller1 );

        this.controllerGrip1 = this.renderer.xr.getControllerGrip( 1 );
        this.controllerGrip1.add( controllerModelFactory.createControllerModel( this.controllerGrip1 ) );
        this.scene.add( this.controllerGrip1 );
        
        //
        const geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );

        const line = new THREE.Line( geometry );
        line.name = 'line';
		line.scale.z = 10;

        this.controller.add( line.clone() );
        this.controller1.add( line.clone() );
        
        this.renderer.setAnimationLoop( this.render.bind(this) );
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {   
        this.ui.update();
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };