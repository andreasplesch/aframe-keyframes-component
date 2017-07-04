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

/**
 * Keyframes component for A-Frame.
 */
AFRAME.registerComponent('keyframes', {
  schema: {
    attribute: {default: 'rotation'}, //Attribute to animate. To specify a component attribute, use componentName.property syntax (e.g., light.intensity). 	rotation
    begin: {default: ''}, // 	Event name to wait on before beginning animation. 	‘’
    delay: {default: 0}, // 	Delay (in milliseconds) or event name to wait on before beginning animation. 	0
    direction: {default: 'normal'}, // 	Direction of the animation (between from and to). One of alternate, alternateReverse, normal, reverse. 	normal
    dur: {default: 1000}, // 	Duration in (milliseconds) of the animation. 	1000
    easing: {default: 'ease'}, // 	Easing function of the animation. There are very many to choose from. 	ease
    end: {default: ''}, // 	Event name to wait on before stopping animation. 	‘’
    fill: {default: 'forwards'}, // 	Determines effect of animation when not actively in play. One of backwards, both, forwards, none. 	forwards
    from: {default: ''}, // 	Starting value. 	Current value.
    repeat: {default: 0}, // 	Repeat count or indefinite. 	0
    to: {default: []}, // must be specified, comma separated array
    keys: {default: []} // must be specified, comma separated array of same length as to
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
    this.hasAnimationNode = false;
    
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {
  
    var ani = document.createElement('a-animation');
    ani.addEventListener('animationstart', bind(this.setupAnimation, this));
    var data = this.data;
    ['attribute', 'begin', 'delay', 'direction', 'dur', 'easing', 'end', 'fill', 'from', 'repeat'].forEach(
      function setAttribute(attr){
        ani.setAttribute(attr, data[attr]);
      });
    //ani.setAttribute('attribute', data.attribute);
    var type = getComponentProperty(this.el, data.attribute);
    if (type instanceof Object) {
      var s = [];
      for (var prop in type) {
        s.push(type[prop]);      
      }
      //color is r,g,b object, no it is a string
      var attrString = s.join(" ").trim();
      if (data.attribute.toLowerCase().endsWith('color')) {
        attrString = "rgb( "+s.join(",")+" )";
      }
      ani.setAttribute('to', attrString);
    }
    else {
      ani.setAttribute('to', type); // will be replaced, hopefully satifisfies a-animation init and start
    }
    if (this.hasAnimationNode) { this.el.replaceChild(ani, this.animation);}
    else {this.el.appendChild(ani); this.hasAnimationNode = true;}
    this.animation = ani;
  },
  
  setupAnimation: function (evt) {
    var ani = evt.target;
    var tween = ani.tween;
    tween.stop(); // stop so we can modify
    //figure out how convert to array to tween array
    var data = this.data;
    var type = getComponentProperty(ani.parentNode, data.attribute);
    var stride = 1; //boolean or string
    var isColor = data.attribute.toLowerCase().endsWith('color');
    if (isColor) {type = new AFRAME.THREE.Color(0,0,0);} // make color similar to vec, argument needed
    if (type instanceof Object) { //vec2-4, color
      stride = Object.keys(type).length;
      if (Object.keys(type)[0] == "r") { //r is first color property, never the case
          isColor = true;
        }
    }
    var prop;
    var propArrays = [];
    var i;
    //data.to is array ["0 0 2", "3 0 1"]
    var splitTo = data.to.map(function(to){return to.split(' ')});
    if (isColor) { // make similar to vec
      var c;
      splitTo = splitTo.map(function(to){
        c = new AFRAME.THREE.Color(to[0]);
        return [c.r, c.g, c.b]
      })
    }
    splitTo[0].forEach( function init (v) {propArrays.push([]);});
    splitTo.forEach( function reorder (to) {
      to.forEach ( function assign (v, i) {
        propArrays[i].push( toNumber(v, type) );
      });
    });
    /* // for flat to arrays
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
      })
    }
    else {
      to[this.data.attribute] = propArrays[0] ;
    }
    tween.to(to, parseFloat(data.dur));
    //interpolation keys, custom function
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
