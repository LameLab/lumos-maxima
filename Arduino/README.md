Each cup runs as a node and defaults to being a "Slave". This means that they can receive commands or pass them on but cannot give commands. The cup that runs as the "Master" node can give the commands and is connected directly to the controller via the `RX` and `TX` pins on the boards (see below). The wiring to the LED and node is identical for all cups.

The cups communicate via a private wireless mesh network that the nodes make. This allows for near instant communication allowing us to create some cool light syncing effects.

The controller connects to the local wifi (setup via the app) which allows it to then connect directly to Firebase. The controller then waits for commands and also sends updates of the cups current status. The commands can be sent via Alexa or the App.

# Node (Master) + Controller
![Node + Controller](../images/controller_and_node.png?raw=true )

# Node (Slave)
![Node](../images/node.png?raw=true )