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

- use tween target arrays: https://github.com/tweenjs/tween.js/blob/master/docs/user_guide.md#tweening-to-arrays-of-values
- use custom interpolation/easing for tween: https://github.com/tweenjs/tween.js/issues/352
- listen to animationstart emitted by starting a-animation 
- stop tween immediately, modify tween with to array and custom interpolation function with keys
- start tween

all of the a-animation attributes as string properties to transfer plus
- keys: array, monotonically increasing 0 to 1 keys
- alternatively durations: array
- to: array of tos

### Summary

The keyframes component animates a target property of another component of the entity, in much the same way as the ```a-animation``` element. In fact, its implementation reuses the ```a-animation``` element. Apart from providing a component interface to animation, the main motivation for the keyframes component is the ability to define multiple frames for an animation sequence where each frame is tied to a timing key. The timing keys define the relative speed of the animation as it progresses from frame to frame.

As background it is helpful to understand that the keyframes component is strongly inspired the [X3D Interpolation component](http://www.web3d.org/documents/specifications/19775-1/V3.3/Part01/components/interp.html) which uses keys and keyValues as a (waitforit) key ( ;) ) component.

Here are a few (untested) examples:
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

Also see: https://aframe.io/docs/0.6.0/core/animations.html#attributes

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| attribute | Attribute to animate. To specify a component attribute, use componentName.property syntax (e.g., light.intensity).           |     rotation          |
| begin | Event name to wait on before beginning animation. | None |
| delay |	Delay (in milliseconds) or event name to wait on before beginning animation. |	0 |
| direction | Direction of the animation (between from and to). One of alternate, alternateReverse, normal, reverse. Ignored for multiple value to arrays. | normal |
| dur | Total duration in (milliseconds) of the animation. |	1000 |
| easing | Easing function of the animation. See Aframe animation documentation. The default here is changed from 'ease' to 'linear'. |	linear |
| end |	Event name to wait on before stopping animation. | None |
| fill |	Determines effect of animation when not actively in play. One of backwards, both, forwards, none. |	forwards |
| from |	Starting value. CUrrently required for color animation. |	Current value. |
| repeat | Repeats _after_ initial iteration or indefinite. |	0 |
| to | Sequence of comma separated values. Must be specified. |	Current value. |
| keys | Sequence of comma separated, increasing timing keys between 0 and 1. The number of keys should equal the number of to values plus one. | 0, 1 |
| interpolation | Interpolation function to compute intermediate values. One of linear, catmullrom or bezier | linear |

Most of the properties and their default values correspond one to one to ```a-animation``` properties. 

delay: An animation starts after an optional delay. The relative time considered for ```keys``` starts after the delay.

direction: The direction property is ignored when there is more than one `to` values given. To achieve the same effect in this case in a more controlled fashion, it is recommended to explicitly define frames for a full animation cycle (see example above).

dur: The ```dur``` property gives the duration of the total animation from start to finish. The durations of each frame as defined by the keys sequence is relative to this total duration.

easing: The ```easing``` property default is changed from the ```a-animation``` default value of 'ease' to 'linear' to avoid initial confusion with key defined animation speeds.

to: The ```to``` value can be a single value or a sequence of comma separated values. The value can be a scalar, a vector, a boolean, or a color (see AFRAME animation documentation) and needs to be of the appropriate type for the animated property. In the single value case, the component replicates the ```a-animation``` element's functionality. In the multiple value case, the component interpolates piecewise from value to value (frames), linearly by default. The timing of when each value is reached can be controlled by the keys property.

keys: Each key in the keys is a relative time when a corresponding ```to``` value is reached. A key of 0 corresponds to the start of an animation cycle, and a key of 1 corresponds to the end. The first key (usually 0) is the relative time when the ```from``` value is used in the animation. Subsequent keys then correspond to ```to``` values in sequence. For a well defined animation sequence there should be a key for each ```to ``` value plus one for the initial ```from``` value. If there are more keys than ```to``` values, the excess keys are ignored. If there are too few keys, the missing keys are assumed to be 1. Keys need to be given in monotonically increasing sequence. If not, they are sorted according to their numerical value, changing their ordering.

interpolation: By default interpolation between frames is linear, eg. a straight line in the case of coordinate interpolation. However, it can be convenient to and TWEEN does allow other types of interpolation ([TWEEN](https://github.com/tweenjs/tween.js/blob/master/docs/user_guide.md#tweening-to-arrays-of-values)). For example, a CatmullRom interpolation will provide smoothed corners in the case of coordinate interpolation. Another potential use is slerp for rotations which is a TODO.

Multiple properties can be animated by giving the entity multiple keyframes components. AFRAME supports this case but requires a `__suffix` to be added to each keyframes component instance attribute name, for example `keyframes__color`. 

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-keyframes-component/dist/aframe-keyframes-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-box position="0 2 -5" rotation="0 45 45" scale="2 2 2"
      keyframes__pos="attribute: position; dur: 2000; repeat: indefinite; 
             to: 0 2.2 -5, 0 2 -5;
             keys: 0, 0.1, 1"
      keyframes__scale="attribute: scale; dur: 2000; repeat: indefinite; 
             to: 4 3 2, 2 2 2;
             keys: 0, 0.1, 1">             
    </a-box>
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

NYI


Install via npm:

```bash
npm install aframe-keyframes-component
```

Then require and use.

```js
require('aframe');
require('aframe-keyframes-component');
```
