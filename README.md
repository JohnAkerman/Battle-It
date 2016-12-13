# Battle It

A work-in-progress 2d tabletop tank game that uses Canvas utilising P5.js as a wrapper.


## Usage

You will need a web server to correctly run this project due to the nature that P5.js loads in image assets. A quick way to get a server up an running would be use to use the node http-server package.

Just 3 simple steps:

1.  [Download and Install node.js](http://nodejs.org/download)
2.  Open a terminal or command prompt
3.  On Windows type (you might need to open the command prompt as admin)

        npm install -g http-server

    On OSX/Linux type
        sudo npm install -g http-server

Done!

From then on just `cd` to the folder that has the files you want to serve and type

    http-server

Then point your browser at `http://localhost:8080/`

## Controls
Keys |  Action
--- | ---
Up Arrow | Steer up
Down Arrow | Steer down
Left Arrow | Steer Left
Right Arrow | Steer Right
Spacebar | Toggle debug mode  
Mouse movement | Change angle of tank turret
Mouse Left Click | Shoot tank turret
