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

