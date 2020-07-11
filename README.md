# CanvasUI
A Three.JS WebXR UI. Enabling easy UI creation for immersive-vr sessions.

## Get Started
To show a text panel use 

Make sure to import CanvasUI
```
import { CanvasUI } from '../../jsm/CanvasUI.js'
```

Your file structure needs both three.module.js and CanvasKeyboard.js to be accessible. The repo has the file structure like the Three.js library with the Three.JS build in the build folder and extra content in the examples folder. The CanvasUI examples are in the examples/CanvasUI. The class files are in examples/jsm. 

To create a simple text panel use
```
const ui = new CanvasUI(  );
ui.mesh.position.set(0, -0.5, -1);
ui.updateElement("body", "Hello World" );

scene.add(ui.mesh);
```

A CanvasUI mesh is simply a Plane that is 1 x 1 units. In a VR world this means it is 1 metre square. It has a CanvasTexture applied, by default this is 512 pixels square. An Arial font is applied and the size of the font is 30 pixels. There is 20 pixels of padding. The font color is white and the background color is black and the canvas will have 6 pixel radius rounded corners. 

A online version is available [here](https://niksgames.com/webxr/dev/CanvasUI/simple/)

##Header|Main|Footer example
In general CanvasUI is designed to have a content object and a config object. Let's try an example with multiple elements. 
```
createUI() {
    const config = {
        header:{
			type: "text",
			position:{ top:0 },
			paddingTop: 30,
			height: 70
		},
		main:{
			type: "text",
			position:{ top:70 },
			height: 372, // default height is 512 so this is 512 - header height:70 - footer height:70
			backgroundColor: "#bbb",
			fontColor: "#000"
		},
		footer:{
			type: "text",
			position:{ bottom:0 },
			paddingTop: 30,
			height: 70
		}
	}
	const content = {
		header: "Header",
		main: "This is the main text",
		footer: "Footer"
	}
	this.ui = new CanvasUI( content, config );
}
```
Each element has a section in the config and the content objects. Notice that these are all of type text. We can set the position using x, y, left, top, right and bottom. The values are in relation to a default texture that is 512 pixels square. Colors are defined like css values. If an attribute is missing it will be inherited from the body which has the defaults.

```
defaultconfig = {
	panelSize: { width: 1, height: 1},
	width: 512,
	height: 512,
	opacity: 0.7,
	body:{
		fontFamily:'Arial', 
		fontSize:30, 
		padding:20, 
		backgroundColor: '#000', 
		fontColor:'#fff', 
		borderRadius: 6
	}
}
```

