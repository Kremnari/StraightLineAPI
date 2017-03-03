# StraightLine
An API Builder &amp; Code Generator

The purpose of StraightLine is to assist developers, and latter novices, to develop a simple and secure API (server-side and db code) for their web applications, with the option to generate code for the client backend and front end forms.  An API describes how a client communicates with a server, and how the server communicates with a database.  As such, all three need to speak the same language, so to speak, which means that a change in one needs to affect the other two.

### Security
One tidbit I picked up about php development, is that if a security measure has to be implemented in multiple places, it's best to put it in a wrapper and call the wrapper, minimize the chance of forgetting to implement it.  StraightLine makes a single endpoint script file that handles security calls.  It also uses a database template that forces a user/account id to be included with each database operation.   This significantly reduces the possibility of developer error.

### Why the name StraightLine

As I developed my first API, I soon realized that any change in the scheme affected several places.  This is repeatitive, and for a programmer, unacceptable.  I set out to map what I had for my API and ended up storing it in JSON.  At this point I started thinking about wrapping the JSON with a tool that would make code changes when I changed the API.  That tool has become StraightLine.  It's called that because it creates a 'straight line' between the client side code, server side code and the db code, which all have to be aware of the same API schema.

### Near Future Features

* Client Side Templates for Angular
* Database Options
* Change Framework to Aurelia

### Desired Features

* Improved Gui
* Allow Multiple Build Code Repositories
* PHP API.json interpreter
