# CS 148: Audio Visualization Project

## Overview

##Task List
### Completed
+	Starter project - read in audio and map to grid of blocks arranged in XZ plane [COMPLETED]
+	Reorganize how frequencies are mapped to blocks (center-->out?) [HALEY-- COMPLETED]
+	Generate textures to style blocks like buildings [COMPLETED]
+	Add "ground" and "sky" so the city isn't floating in space. [COMPLETED]

### Must Do
+	Clean up camera controls [ASSIGNED - HALEY]
+	Add music controls (pause, upload song, etc.) [ASSIGNED - HALEY]
+ 	Spacing buildings into groups to form "city blocks" [ASSIGNED - HALEY]
+	Adding additional models and content [ASSIGNED - BRANDON]
+	Combining day and night scenes [ASSIGNED - SANJAY]
+	Adding textures for roads, etc. [ASSIGNED - SANJAY]
+	Remove unused faces from buildings (i.e. floors) [UNASSIGNED]
+	Fix roof texture on night buildigns (currently being rendered as floor) [UNASSIGNED]

### Nice-to-Haves
+	Experiment with fine-tuning the building motion (add decay, stretching vs. growing, etc.) [UNASSIGNED]
+	Create advanced textures, models, user controls, etc. [UNASSIGNED]

## Samples / Tutorials
The examples folder contains a number of sample projects and tutorials which may be helpful in getting various aspects of the proejct working. Let's update the list as we add to this folder (this will also help with attribution later on).

For simple examples, you can just open the html file in your browser (Chrome may be best) and it should work. For more complicated examples (like those which read in an audio file, for instance), you will need to start a local server. The simplest way is to navigate to the main directory for this project and type "python -m SimpleHTTPServer", which should serve the page at "http://0.0.0.0/8000".

1. SimpleSphere: Demonstrates a single object with lighting and a camera.
2. Shader1: Demonstrates a simple custom shader (which should just color everything purple).
3. Shader2: Demonstrates a dynamic shader (and how to pass attributes, uniforms to the shaders - so easy compared to OpenGL!).
4. AudioBlocks: Hey! A simple visualization that responds to the audio (Caution: there's no way to pause, so it gets kind of annoying).
5. SpectralAnalysis: Example of image filtering based on spectral analysis.
