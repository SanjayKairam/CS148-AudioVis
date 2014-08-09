CS 148: Audio Visualization Project

testing testing
testing complete
Overview

--------
Our current V1 is currently in examples/soundcity. Here's the basic outline for what's been done and a speculative list of what needs to be done.
1. Starter project - read in audio and map to grid of blocks arranged in XZ plane [COMPLETED]
2. Reorganize how frequencies are mapped to blocks (center-->out?) [HALEY-- COMPLETED]
3. Generate textures to style blocks like buildings [COMPLETED]
4. Clean up camera controls [UNASSIGNED]
5. Add "ground" and "sky" so the city isn't floating in space. [COMPLETED]
6. Possibly add roads (even animated textures for mini cars)? [UNASSIGNED]
7. Experiment with fine-tuning the building motion (add decay, stretching vs. growing, etc.) [UNASSIGNED]
8. Create additional textures and user controls [UNASSIGNED]
9. Add music controls (pause, upload song, etc.) [UNASSIGNED]

Examples
--------
I'm going through tutorials, and I'm adding examples which I think may be helpful in getting us up and running with respect to various aspects of the project. I'll try and keep an updated list here. 

For simple examples, you can just open the html file in your browser (Chrome may be best) and it should work. For more complicated examples (like those which read in an audio file, for instance), you will need to start a local server. The simplest way is to navigate to the main directory for this project and type "python -m SimpleHTTPServer", which should serve the page at "http://0.0.0.0/8000".

1. SimpleSphere: Demonstrates a single object with lighting and a camera.
2. Shader1: Demonstrates a simple custom shader (which should just color everything purple).
3. Shader2: Demonstrates a dynamic shader (and how to pass attributes, uniforms to the shaders - so easy compared to OpenGL!).
4. AudioBlocks: Hey! A simple visualization that responds to the audio (Caution: there's no way to pause, so it gets kind of annoying).
