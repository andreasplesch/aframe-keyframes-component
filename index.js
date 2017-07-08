/* global AFRAME */
//var utils = require('../utils/');
//var bind = utils.bind;
//var getAnimationValues = require('core/a-animation').getAnimationValues;
//var getComponentProperty = utils.entity.getComponentProperty;


if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

var bind = AFRAME.utils.bind;
var getComponentProperty = AFRAME.utils.entity.getComponentProperty;
var INTERPOLATION_FUNCTIONS = {
  'linear': AFRAME.TWEEN.Interpolation.Linear,
  'bezier': AFRAME.TWEEN.Interpolation.Bezier,
  'catmullrom': AFRAME.TWEEN.Interpolation.CatmullRom
};
var EASING_FUNCTIONS = {
  'linear': AFRAME.TWEEN.Easing.Linear.None,

  'ease': AFRAME.TWEEN.Easing.Cubic.InOut,
  'ease-in': AFRAME.TWEEN.Easing.Cubic.In,
  'ease-out': AFRAME.TWEEN.Easing.Cubic.Out,
  'ease-in-out': AFRAME.TWEEN.Easing.Cubic.InOut,

  'ease-cubic': AFRAME.TWEEN.Easing.Cubic.In,
  'ease-in-cubic': AFRAME.TWEEN.Easing.Cubic.In,
  'ease-out-cubic': AFRAME.TWEEN.Easing.Cubic.Out,
  'ease-in-out-cubic': AFRAME.TWEEN.Easing.Cubic.InOut,

  'ease-quad': AFRAME.TWEEN.Easing.Quadratic.InOut,
  'ease-in-quad': AFRAME.TWEEN.Easing.Quadratic.In,
  'ease-out-quad': AFRAME.TWEEN.Easing.Quadratic.Out,
  'ease-in-out-quad': AFRAME.TWEEN.Easing.Quadratic.InOut,

  'ease-quart': AFRAME.TWEEN.Easing.Quartic.InOut,
  'ease-in-quart': AFRAME.TWEEN.Easing.Quartic.In,
  'ease-out-quart': AFRAME.TWEEN.Easing.Quartic.Out,
  'ease-in-out-quart': AFRAME.TWEEN.Easing.Quartic.InOut,

  'ease-quint': AFRAME.TWEEN.Easing.Quintic.InOut,
  'ease-in-quint': AFRAME.TWEEN.Easing.Quintic.In,
  'ease-out-quint': AFRAME.TWEEN.Easing.Quintic.Out,
  'ease-in-out-quint': AFRAME.TWEEN.Easing.Quintic.InOut,

  'ease-sine': AFRAME.TWEEN.Easing.Sinusoidal.InOut,
  'ease-in-sine': AFRAME.TWEEN.Easing.Sinusoidal.In,
  'ease-out-sine': AFRAME.TWEEN.Easing.Sinusoidal.Out,
  'ease-in-out-sine': AFRAME.TWEEN.Easing.Sinusoidal.InOut,

  'ease-expo': AFRAME.TWEEN.Easing.Exponential.InOut,
  'ease-in-expo': AFRAME.TWEEN.Easing.Exponential.In,
  'ease-out-expo': AFRAME.TWEEN.Easing.Exponential.Out,
  'ease-in-out-expo': AFRAME.TWEEN.Easing.Exponential.InOut,

  'ease-circ': AFRAME.TWEEN.Easing.Circular.InOut,
  'ease-in-circ': AFRAME.TWEEN.Easing.Circular.In,
  'ease-out-circ': AFRAME.TWEEN.Easing.Circular.Out,
  'ease-in-out-circ': AFRAME.TWEEN.Easing.Circular.InOut,

  'ease-elastic': AFRAME.TWEEN.Easing.Elastic.InOut,
  'ease-in-elastic': AFRAME.TWEEN.Easing.Elastic.In,
  'ease-out-elastic': AFRAME.TWEEN.Easing.Elastic.Out,
  'ease-in-out-elastic': AFRAME.TWEEN.Easing.Elastic.InOut,

  'ease-back': AFRAME.TWEEN.Easing.Back.InOut,
  'ease-in-back': AFRAME.TWEEN.Easing.Back.In,
  'ease-out-back': AFRAME.TWEEN.Easing.Back.Out,
  'ease-in-out-back': AFRAME.TWEEN.Easing.Back.InOut,

  'ease-bounce': AFRAME.TWEEN.Easing.Bounce.InOut,
  'ease-in-bounce': AFRAME.TWEEN.Easing.Bounce.In,
  'ease-out-bounce': AFRAME.TWEEN.Easing.Bounce.Out,
  'ease-in-out-bounce': AFRAME.TWEEN.Easing.Bounce.InOut
};


/**
 * Keyframes component for A-Frame.
 */
AFRAME.registerComponent('keyframes', {
  schema: {
    attribute: {default: 'rotation'}, //Attribute to animate. To specify a component attribute, use componentName.property syntax (e.g., light.intensity).  rotation
    begin: {default: ''}, //  Event name to wait on before beginning animation.   ‘’
    delay: {default: 0}, //   Delay (in milliseconds) or event name to wait on before beginning animation.  0
    direction: {default: 'normal'}, //  Direction of the animation (between from and to). One of alternate, alternateReverse, normal, reverse.  normal
    //yoyo: {default: false}, // regular tween yoyo instead of direction
    dur: {default: 1000}, //  Duration in (milliseconds) of the animation.  1000
    easing: {default: 'linear'}, //   Easing function of the animation. There are very many to choose from.   ease
    end: {default: ''}, //  Event name to wait on before stopping animation.  ‘’
    fill: {default: 'forwards'}, //   Determines effect of animation when not actively in play. One of backwards, both, forwards, none.   forwards
    from: {default: ''}, //   Starting value.   Current value.
    repeat: {default: 0}, //  Repeat count or indefinite.   0
    to: {default: []}, // must be specified, comma separated
    interpolation: {default: 'linear'}, // kind of interpolation, linear, bezier, catmullrom
    keys: {default: ['0', '1']} // must be specified, comma separated array of length of to plus one for from value
  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: true,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {

    //generate a-animation node
    //append
    //add 'animationstart' listener
    var ani = document.createElement('a-animation');
    ani.addEventListener('animationstart', bind(this.setupAnimation, this));
    this.animation = ani;
    this.hasAnimationNode = false;

  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {

    var data = this.data;
    var ani = this.animation;

    ['attribute', 'begin', 'delay', 'dur', 'easing', 'end', 'fill', 'from', 'repeat'].forEach(
      function transferAttribute(attr){
        ani.setAttribute(attr, data[attr]);
      });
    //direction only when to has a single value
    var directionValue = data.direction;
    if (data.to.length > 1) { directionValue = 'normal';}
    ani.setAttribute('direction', directionValue);

    //use element value as initial to value
    var type = getComponentProperty(this.el, data.attribute);
    if (type instanceof Object) {
      var s = [];
      for (var prop in type) {
        s.push(type[prop]);
      }
      //color is r,g,b object, no it is a string
      var attrString = s.join(" ").trim();
      if (data.attribute.toLowerCase().endsWith('color')) { // never happens because color is not an object
        attrString = "rgb( "+s.join(",")+" )";
      }
      ani.setAttribute('to', attrString);
    }
    else {
      ani.setAttribute('to', type); // will be replaced, hopefully satifisfies a-animation init and start
    }

    // sanitize interpolation
    this.interpolation = INTERPOLATION_FUNCTIONS[data.interpolation] || INTERPOLATION_FUNCTIONS['linear'];

    // sanitize keys
    // check length and content
    this.keys = data.keys.map(parseFloat).map(function(v){return isNaN(v) ? 1:v ;});
    //sort, deduplicate
    if (this.keys.length > 1) {
      this.keys = this.keys.sort(function cmp(a,b) { return a-b ; }).
        filter(function(v, i, a){return v !== a[i-1];}) ;
    }
    if (this.keys.length === 0) {this.keys = [0, 1] ;}

    if (this.hasAnimationNode) { this.el.replaceChild(ani, this.animation);}
    else {
      this.el.appendChild(ani);
      this.hasAnimationNode = true;
    }
    //this.animation = ani;
  },

  setupAnimation: function (evt) {
    var ani = evt.target;
    var tween = ani.tween;
    tween.stop(); // stop so we can modify
    //figure out how convert to array to tween array
    var data = this.data;
    var splitTo = data.to.map(function(to){return to.split(' ');});
    var type = getComponentProperty(ani.parentNode, data.attribute);
    //var stride = 1; //boolean or string
    var isColor = data.attribute.toLowerCase().endsWith('color');
    if (isColor) { // make similar to vec
      type = new AFRAME.THREE.Color(0, 0, 0); // argument needed to get r,g,b keys
      var c;
      splitTo = splitTo.map( function(to) {
        c = new AFRAME.THREE.Color( to[0] );
        return [c.r, c.g, c.b] ;
      });
    }
    /* // stride for flat array
    if (type instanceof Object) { //vec2-4, color
      stride = Object.keys(type).length;
      if (Object.keys(type)[0] == "r") { //r is first color property, never the case
          isColor = true;
        }
    }
    */
    //var prop;
    var propArrays = [];
    //var i;
    //data.to is array ["0 0 2", "3 0 1"]
    splitTo[0].forEach( function init (v) {propArrays.push([]);});
    splitTo.forEach( function reorder (to) {
      to.forEach ( function assign (v, i) {
        propArrays[i].push( toNumber(v, type) );
      });
    });
    /* // for flat 'to' arrays
    for (prop = 0; prop < stride; prop++) {
      propArrays[prop] = [];
      for (i = prop; i < data.to.length; i = i + stride) {
        //fix for other types
        propArrays[prop].push(+data.to[i]); // needs to be a number, boolean would need to converted
      }
    }
    */
    var to = {};
    if (type instanceof Object) {
      Object.keys(type).forEach(function transfer (key, i) {
        to[key] = propArrays[i] ;
      });
    }
    else {
      to[this.data.attribute] = propArrays[0] ;
    }
    tween.to(to, parseFloat(data.dur));
    tween.interpolation(this.interpolation);
    //interpolation keys, custom function
    var parsedEasing = EASING_FUNCTIONS[data.easing];
    tween.easing(keyedEasing(this.keys), parsedEasing);

    tween.start();

    // helper
    function toNumber (v, type) {
      if (typeof v == 'number') {return v;} //already a number, color case
      var t = typeof type;
      if (t == 'string') { return parseFloat(v) ;} // vec2-4 case
      //if (t == 'number') {return v ;}
      if (t == 'boolean') { return v ? 1 : 0 ;}
      return parseFloat(v.toString()) ; // hopefully never happens
    }

    function keyedEasing(keys, easing) {
      //easing is applied on top
      easing = easing || AFRAME.TWEEN.Easing.Linear.None; //perhaps test if actually a number returning function

      return function piecewiseLinearEasingFunction (k) { // this is what tween expects as custom easing function

        var m = keys.length - 1;
        var fn = AFRAME.TWEEN.Interpolation.Utils.Linear;

        if (k <= keys[0]) {
          return easing(k); //fn(0, 1/m, k); // extrapolate
        }

        if (k >= keys[m]) {
          return easing(k); //fn( (m-1)/m, 1, k - keys[m]); // extrapolate
        }

        // find interval
        var right = keys.findIndex(function (key) {return key > k ;}); // could be smarter: start searching from previous
        var left = right - 1;
        var f = (k-keys[left])/(keys[right]-keys[left]);
        //the interpolation between left/m, right/m works because tween divides the duration evenly into 1/m wide pieces
        return easing(fn(left/m, right/m, f));
      };
    }

  },
  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { },

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { }
});
