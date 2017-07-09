## aframe-keyframes-component

[![Version](http://img.shields.io/npm/v/aframe-keyframes-component.svg?style=flat-square)](https://npmjs.org/package/aframe-keyframes-component)
[![License](http://img.shields.io/npm/l/aframe-keyframes-component.svg?style=flat-square)](https://npmjs.org/package/aframe-keyframes-component)

[A-Frame](https://aframe.io) animaton with timing keys and frames.

### Design

Requirements:

- use built-in a-animation node to avoid additional dependancies.

old design:
https://glitch.com/edit/#!/holy-word?path=index.html:48:29

new design:

- use tween target arrays
- use custom interpolation/easing for tween
- listen to animationstart emitted by starting a-animation 
- stop tween immediately, modify tween with to array and custom interpolation function with keys
- start tween

all of the a-animation attributes as string properties to transfer plus
- keys: array, monotonically increasing 0 to 1 keys
- alternatively durations: array
- to: array of tos

### Summary

The keyframes component animates a target property of another component of the entity, in much the same way as the ```a-animation``` element. In fact, its implementation is based on the ```a-animation``` element. Apart from providing a component interface to animation, the main motivation for the keyframes component is the ability is to define multiple frames for animation sequence where each frame is tied to a timing key. The timing keys define the relative speed of the animation as it progresses from frame to frame. 

Here are a few examples:
```
<!-- using a-animation -->
<a-box position="0 2 -5" rotation="0 45 45" scale="2 2 2">
  <a-animation attribute="position" dur="2000"
          to="0 2.2 -5">
  </a-animation>
</a-box>
<!-- using keyframes-->
<a-box position="0 2 -5" rotation="0 45 45" scale="2 2 2"
  keyframes="attribute: position; dur: 2000; 
             to: 0 2.2 -5">
</a-box>
<!-- using a-animation -->
<a-box position="0 2 -5" rotation="0 45 45" scale="2 2 2">
  <a-animation attribute="position" direction="alternate" dur="2000" repeat="indefinite"
          to="0 2.2 -5">
  </a-animation>
</a-box>
<!-- using keyframes-->
<a-box position="0 2 -5" rotation="0 45 45" scale="2 2 2"
  keyframes="attribute: position; dur: 2000; repeat: indefinite; 
             to: 0 2.2 -5, 0 2 -5">
</a-box>
<!-- using keyframes, first leg faster -->
<a-box position="0 2 -5" rotation="0 45 45" scale="2 2 2"
  keyframes="attribute: position; dur: 2000; repeat: indefinite; 
             to: 0 2.2 -5, 0 2 -5
             keys: 0, 0.1, 1">
</a-box>
<!-- using keyframes, first leg faster, animate two properties -->
<a-box position="0 2 -5" rotation="0 45 45" scale="2 2 2"
  keyframes__pos="attribute: position; dur: 2000; repeat: indefinite; 
             to: 0 2.2 -5, 0 2 -5;
             keys: 0, 0.1, 1"
  keyframes__scale="attribute: scale; dur: 2000; repeat: indefinite; 
             to: 4 3 2, 2 2 2;
             keys: 0, 0.1, 1">             
</a-box>
```
### API



| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.5.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-keyframes-component/dist/aframe-keyframes-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity keyframes="foo: bar"></a-entity>
  </a-scene>
</body>
```

<!-- If component is accepted to the Registry, uncomment this. -->
<!--
Or with [angle](https://npmjs.com/package/angle/), you can install the proper
version of the component straight into your HTML file, respective to your
version of A-Frame:

```sh
angle install aframe-keyframes-component
```
-->

#### npm

Install via npm:

```bash
npm install aframe-keyframes-component
```

Then require and use.

```js
require('aframe');
require('aframe-keyframes-component');
```
