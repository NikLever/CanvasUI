// see devsrv.config.json for threejs version dynamically replaced by devsrv
import * as THREE from 'https://cdn.skypack.dev/three@0.119';
import { BoxLineGeometry } from 'https://cdn.skypack.dev/three@0.119/examples/jsm/geometries/BoxLineGeometry.js';

import { CanvasUI } from '../../jsm/CanvasUI.js';
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
        //clipPath created using https://yqnn.github.io/svg-path-editor/
        const config = {
            body: {
                clipPath: 'M 258.3888 5.4432 C 126.9744 5.4432 20.4432 81.8424 20.4432 164.4624 C 20.4432 229.1976 86.3448 284.2128 178.1016 304.8192 C 183.5448 357.696 173.2416 444.204 146.8032 476.6688 C 186.6552 431.9568 229.2288 356.5296 244.7808 313.3728 C 249.252 313.3728 253.9176 313.7616 258.3888 313.7616 C 389.8032 313.7616 496.14 246.888 496.14 164.4624 S 389.8032 5.4432 258.3888 5.4432 Z',
                backgroundColor: '#ddd',
                fontColor: '#000',
                fontFamily: 'Gochi Hand'
            },
            speech: { type: 'text', position: { left: 50, top: 80 }, fontSize: 45, fontColor: '#000', width: 400, height: 250 }
        };

        const content = {
            speech: 'A custom shaped panel. How about that?'
        };

        this.ui = new CanvasUI( content, config );
        this.ui.mesh.position.set( 0, 1.5, -1.6 );
        this.camera.attach( this.ui.mesh );
    }
    
    setupXR(){
        this.renderer.xr.enabled = true; 
        new VRButton( this.renderer );
        this.renderer.setAnimationLoop( this.render.bind(this) );
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
    render( ) {   
        if ( this.renderer.xr.isPresenting ) this.ui.update();
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };