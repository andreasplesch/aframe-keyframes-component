## aframe-keyframes-component

[![Version](http://img.shields.io/npm/v/aframe-keyframes-component.svg?style=flat-square)](https://npmjs.org/package/aframe-keyframes-component)
[![License](http://img.shields.io/npm/l/aframe-keyframes-component.svg?style=flat-square)](https://npmjs.org/package/aframe-keyframes-component)

key frame animation

For [A-Frame](https://aframe.io).

### Design

Use built-in a-animation node.

Generate children with delays or use begin events.

Could listen to 'animationend' and then emit next begin event.

reuse a single a-animation ?

parent.addlistener('animationend', 
a-animationnode.setup nextframe toValue duration
emit('nextFrame')
)

it looks like it is necessary to clone the animation node, set it up for the next frame, and then replace the current one with the clone.
Replacing with trigger the next frame, so a begin event is not necessary.

https://glitch.com/edit/#!/holy-word?path=index.html:48:29
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
