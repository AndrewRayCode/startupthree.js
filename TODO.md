# How to handle load ?
- could be nice to have automatic loading of the js files
- document.write ? or ajax and then eval ?
  - the less black magic the better
- how to handle that in a multi module-imports ecosystem ?


# TODO
- handle the loading in this function
  - document write for now
- add webvr options

- add rayinput option
- add ammoWorld options
- have an options parameter
  - like with webvr: true, rayinput: true
  - ammoWorld: true
  - cameraControls : 'type', or even your own controls
    - cameraControls: function contructor(){}
    - cameraControls: false to disable it
- how to load it in codepen and other ?
  - cdn on github code - e.g. https://rawgit.com/

# Goals
- seems to be the starting of a boilerplate
- remove the lines which are in all three.js demo
- make it tunable, like with ammo.js or not
- make it easily integrable
