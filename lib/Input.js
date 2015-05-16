import assign from 'lodash/object/assign';

/**
 * This is a quick drop in file which may have to be changed later to fit our needs.
 * it is basically just taken from http://gamedevelopment.tutsplus.com/tutorials/game-input-simplified--cms-19759
 * with a few modifications to fit the rest of the engine public api
 * Note: the state within this file is contained as a global singleton so would only really work with one engine
 *       which with blind foresight seems fine?
 * Usage: var jump = Input.create(null, [Input.KEYBOARD_UP, GAMEPAD_A]);
 *        update() { if (jump.value) {} }
 * 
 * TODO: Not sure this currently has great support for action/state differentiation
 *   SEE: http://www.gamedev.net/blog/355/entry-2250186-designing-a-robust-input-handling-system-for-games/
 */
var KEYBOARD = 1;
var POINTER  = 2;
var GAMEPAD  = 3;
var DEVICE   = 16;
var CODE     = 8;

var __pointer = {
  currentX   : 0,
  currentY   : 0,
  previousX  : 0,
  previousY  : 0,
  distanceX  : 0,
  distanceY  : 0,
  identifier : -1,
  moved      : false,
  pressed    : false
};

var __keyboard = {};
var __inputs   = [];
var __channels = [];

var __mouseDetected = false;
var __touchDetected = false;

// Updates a GameInput instance.
function updateInput( input, channels ) {
  var i         = channels.length;
  var channel   = 0;
  var device    = 0;
  var code      = 0;
  var threshold = 0;
  var gamepad   = null;

  input.value = 0;

  while( i -- > 0 ) {
    channel = channels[ i ];
    device  = channel >>> DEVICE & 255;
    code    = channel >>> CODE   & 255;

    if( device === KEYBOARD ) {
      if( __keyboard[ code ] === true ) {
        updateValue( input, 1 );
      }
      continue;
    }

    if( device === POINTER ) {
      if( code === 0 ) {
        if( __pointer.distanceY < 0 ) {
          updateValue( input, -__pointer.distanceY );
        }
        continue;
      }

      if( code === 1 ) {
        if( __pointer.distanceY > 0 ) {
          updateValue( input, __pointer.distanceY );
        }
        continue;
      }

      if( code === 2 ) {
        if( __pointer.distanceX < 0 ) {
          updateValue( input, -__pointer.distanceX );
        }
        continue;
      }

      if( code === 3 ) {
        if( __pointer.distanceX > 0 ) {
          updateValue( input, __pointer.distanceX );
        }
        continue;
      }

      if( code === 4 ) {
        if( __pointer.pressed ) {
          updateValue( input, 1 );
        }
        continue;
      }

      continue;
    }

    if( device === GAMEPAD ) {
      if( gamepad === null ) {
        // W3C
        if( navigator.getGamepads !== undefined ) {
          gamepad = navigator.getGamepads()[ 0 ];
        }
        // Webkit (non-standard)
        else if( navigator.webkitGetGamepads !== undefined ) {
          gamepad = navigator.webkitGetGamepads()[ 0 ];
        }
        else {
          gamepad = undefined;
        }
      }

      if( gamepad === undefined || gamepad.connected === false ) {
        continue;
      }

      // Set the threshold for analog buttons.
      threshold = 0.05;

      if( code < 16 ) {
        if( gamepad.buttons[ code ] !== undefined ) {
          // W3C
          if( gamepad.buttons[ code ].value !== undefined ) {
            updateValue( input, gamepad.buttons[ code ].value, threshold );
          }
          // Webkit (non-standard)
          else {
            updateValue( input, gamepad.buttons[ code ], threshold );
          }
        }
        continue;
      }

      // Set the threshold for analog sticks.
      threshold = 0.18;

      if( code === 16 ) {
        if( gamepad.axes[ 1 ] < 0 ) {
          updateValue( input, -gamepad.axes[ 1 ], threshold );
        }
        continue;
      }

      if( code === 17 ) {
        if( gamepad.axes[ 1 ] > 0 ) {
          updateValue( input, gamepad.axes[ 1 ], threshold );
        }
        continue;
      }

      if( code === 18 ) {
        if( gamepad.axes[ 0 ] < 0 ) {
          updateValue( input, -gamepad.axes[ 0 ], threshold );
        }
        continue;
      }

      if( code === 19 ) {
        if( gamepad.axes[ 0 ] > 0 ) {
          updateValue( input, gamepad.axes[ 0 ], threshold );
        }
        continue;
      }

      if( code === 20 ) {
        if( gamepad.axes[ 3 ] < 0 ) {
          updateValue( input, -gamepad.axes[ 3 ], threshold );
        }
        continue;
      }

      if( code === 21 ) {
        if( gamepad.axes[ 3 ] > 0 ) {
          updateValue( input, gamepad.axes[ 3 ], threshold );
        }
        continue;
      }

      if( code === 22 ) {
        if( gamepad.axes[ 2 ] < 0 ) {
          updateValue( input, -gamepad.axes[ 2 ], threshold );
        }
        continue;
      }

      if( code === 23 ) {
        if( gamepad.axes[ 2 ] > 0 ) {
          updateValue( input, gamepad.axes[ 2 ], threshold );
        }
        continue;
      }

      continue;
    }

    // If we are here the device is unknown.
  }
}

// Updates the value of a GameInput instance.
function updateValue( input, value, threshold ) {
  if( threshold !== undefined ) {
    if( value < threshold ) {
      value = 0;
    }
  }

  // The highest value has priority.
  if( input.value < value ) {
    input.value = value;
  }
}

// Updates the pointer values.
function updatePointer() {
  // Clamp the pointer's horizontal position.
  if( __pointer.currentX < 0 ) {
    __pointer.currentX = 0;
  }
  else if( __pointer.currentX >= window.innerWidth ) {
    __pointer.currentX = window.innerWidth - 1;
  }

  // Clamp the pointer's vertical position.
  if( __pointer.currentY < 0 ) {
    __pointer.currentY = 0;
  }
  else if( __pointer.currentY >= window.innerHeight ) {
    __pointer.currentY = window.innerHeight - 1;
  }

  // Make sure the pointer speed is in range.
  if( GameInput.pointerSpeed < 1 ) {
    GameInput.pointerSpeed = 1;
  }

  __pointer.distanceX = ( __pointer.currentX - __pointer.previousX ) / GameInput.pointerSpeed;
  __pointer.distanceY = ( __pointer.currentY - __pointer.previousY ) / GameInput.pointerSpeed;

  __pointer.previousX = __pointer.currentX;
  __pointer.previousY = __pointer.currentY;

  // Clamp the pointer's horizontal distance.
  if( __pointer.distanceX > 1 ) {
    __pointer.distanceX = 1;
  }
  else if( __pointer.distanceX < -1 ) {
    __pointer.distanceX = -1;
  }

  // Clamp the pointer's vertical distance.
  if( __pointer.distanceY > 1 ) {
    __pointer.distanceY = 1;
  }
  else if( __pointer.distanceY < -1 ) {
    __pointer.distanceY = -1;
  }

  GameInput.pointerX = __pointer.currentX;
  GameInput.pointerY = __pointer.currentY;
}

// Called when a mouse input device is detected.
function mouseDetected() {
  if( __mouseDetected === false ) {
    __mouseDetected = true;

    // Ignore touch events if a mouse is being used.
    removeTouchListeners();
  }
}

// Called when a touch-screen input device is detected.
function touchDetected() {
  if( __touchDetected === false ) {
    __touchDetected = true;

    // Ignore mouse events if a touch-screen is being used.
    removeMouseListeners();
  }
}

// Called when a pointer-like input device is pressed.
function pointerPressed( x, y, identifier ) {
  __pointer.identifier = identifier;
  __pointer.pressed    = true;

  pointerMoved( x, y );
}

// Called when a pointer-like input device is released.
function pointerReleased() {
  __pointer.identifier = 0;
  __pointer.pressed    = false;
}

// Called when a pointer-like input device is moved.
function pointerMoved( x, y ) {
  __pointer.currentX = x >>> 0;
  __pointer.currentY = y >>> 0;

  if( __pointer.moved === false ) {
    __pointer.moved = true;
    __pointer.previousX = __pointer.currentX;
    __pointer.previousY = __pointer.currentY;
  }
}

// Kills an event.
function killEvent( event ) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

// Called when a mouse button is pressed.
function onMouseDown( event ) {
  mouseDetected();

  if( event.button === 0 ) {
    pointerPressed( event.clientX, event.clientY, 0 );
  }

  killEvent( event );
}

// Called when a mouse button is released.
function onMouseUp( event ) {
  mouseDetected();

  if( event.button === 0 ) {
    pointerReleased();
  }

  killEvent( event );
}

// Called when a mouse is moused.
function onMouseMove( event ) {
  mouseDetected();

  pointerMoved( event.clientX, event.clientY );

  killEvent( event );
}

// Called when a touch-screen is pressed.
function onTouchStart( event ) {
  touchDetected();

  var touch = event.touches[ 0 ];

  if( __pointer.pressed === false ) {
    pointerPressed( touch.clientX, touch.clientY, touch.identifier );
  }

  killEvent( event );
}

// Called when a touch-screen is released.
function onTouchEnd( event ) {
  touchDetected();

  var list  = event.changedTouches;
  var touch = list[ 0 ];

  if( touch.identifier === __pointer.identifier ) {
    pointerReleased();
  }
  else {
    var i = 1;
    var n = list.length;

    while( i < n ) {
      touch = list[ i ];

      if( touch.identifier === __pointer.identifier ) {
        pointerReleased();
        break;
      }

      i ++;
    }
  }

  killEvent( event );
}

// Called when a touch-point is moved.
function onTouchMove( event ) {
  touchDetected();

  var list  = event.touches;
  var touch = list[ 0 ];

  if( touch.identifier === __pointer.identifier ) {
    pointerMoved( touch.clientX, touch.clientY );
  }
  else {
    var i = 1;
    var n = list.length;

    while( i < n ) {
      touch = list[ i ];

      if( touch.identifier === __pointer.identifier ) {
        pointerMoved( touch.clientX, touch.clientY );
        break;
      }

      i ++;
    }
  }

  killEvent( event );
}

// Called when a keyboard key is pressed.
function onKeyDown( event ) {
  __keyboard[ event.keyCode ] = true;

  killEvent( event );
}

// Called when a keyboard key is released.
function onKeyUp( event ) {
  __keyboard[ event.keyCode ] = false;

  killEvent( event );
}

// Mouse listeners.
function addMouseListeners() {
  window.addEventListener( "mousedown", onMouseDown, true );
  window.addEventListener( "mouseup",   onMouseUp,   true );
  window.addEventListener( "mousemove", onMouseMove, true );
}

// Mouse listeners.
function removeMouseListeners() {
  window.removeEventListener( "mousedown", onMouseDown, true );
  window.removeEventListener( "mouseup",   onMouseUp,   true );
  window.removeEventListener( "mousemove", onMouseMove, true );
}

// Touch-screen listeners.
function addTouchListeners() {
  window.addEventListener( "touchstart", onTouchStart, true );
  window.addEventListener( "touchend",   onTouchEnd,   true );
  window.addEventListener( "touchmove",  onTouchMove,  true );
}

// Touch-screen listeners.
function removeTouchListeners() {
  window.removeEventListener( "touchstart", onTouchStart, true );
  window.removeEventListener( "touchend",   onTouchEnd,   true );
  window.removeEventListener( "touchmove",  onTouchMove,  true );
}

// Touch-screen listeners.
function addKeyboardListeners() {
  window.addEventListener( "keydown", onKeyDown, true );
  window.addEventListener( "keyup",   onKeyUp,   true );
}

// Touch-screen listeners.
function removeKeyboardListeners() {
  window.removeEventListener( "keydown", onKeyDown, true );
  window.removeEventListener( "keyup",   onKeyUp,   true );
}

// Exported GameInput domain
// Note: GameInput actions will peer into a singleton input state
// - See exported observe and update functions for usage
const GameInput = {};

GameInput.create = function(state, channels) {
  const input = assign({
    value: 0,
    enabled: true
  }, state);

  for (let i = 0; i < channels.length; ++i) {
    GameInput.add(input, channels[i]);
  }

  return input;
};

GameInput.add = function(input, channel) {
  var i = __inputs.indexOf( input );

  if( i === -1 ) {
    __inputs.push( input );
    __channels.push( [ channel ] );
    return;
  }

  var ca = __channels[ i ];
  var ci = ca.indexOf( channel );

  if( ci === -1 ) {
    ca.push( channel );
  }
};

GameInput.remove = function(input, channel) {
  var i = __inputs.indexOf( input );

  if( i === -1 ) {
    return;
  }

  var ca = __channels[ i ];
  var ci = ca.indexOf( channel );

  if( ci !== -1 ) {
    ca.splice( ci, 1 );

    if( ca.length === 0 ) {
      __inputs.splice( i, 1 );
      __channels.splice( i, 1 );
    }
  }
};

GameInput.reset = function(input) {
  var i = __inputs.indexOf( input );

  if( i !== -1 ) {
    __inputs.splice( i, 1 );
    __channels.splice( i, 1 );
  }

  input.value   = 0;
  input.enabled = true;
};

// The X position of the pointer, in pixels, within the window viewport.
GameInput.pointerX = 0;

// The Y position of the pointer, in pixels, within the window viewport.
GameInput.pointerY = 0;

// The distance the pointer has to move, in pixels per frame, to
// cause the value of a GameInput instance to equal 1.0.
GameInput.pointerSpeed = 10;


GameInput.KEYBOARD_A = KEYBOARD << DEVICE | 65 << CODE;
GameInput.KEYBOARD_B = KEYBOARD << DEVICE | 66 << CODE;
GameInput.KEYBOARD_C = KEYBOARD << DEVICE | 67 << CODE;
GameInput.KEYBOARD_D = KEYBOARD << DEVICE | 68 << CODE;
GameInput.KEYBOARD_E = KEYBOARD << DEVICE | 69 << CODE;
GameInput.KEYBOARD_F = KEYBOARD << DEVICE | 70 << CODE;
GameInput.KEYBOARD_G = KEYBOARD << DEVICE | 71 << CODE;
GameInput.KEYBOARD_H = KEYBOARD << DEVICE | 72 << CODE;
GameInput.KEYBOARD_I = KEYBOARD << DEVICE | 73 << CODE;
GameInput.KEYBOARD_J = KEYBOARD << DEVICE | 74 << CODE;
GameInput.KEYBOARD_K = KEYBOARD << DEVICE | 75 << CODE;
GameInput.KEYBOARD_L = KEYBOARD << DEVICE | 76 << CODE;
GameInput.KEYBOARD_M = KEYBOARD << DEVICE | 77 << CODE;
GameInput.KEYBOARD_N = KEYBOARD << DEVICE | 78 << CODE;
GameInput.KEYBOARD_O = KEYBOARD << DEVICE | 79 << CODE;
GameInput.KEYBOARD_P = KEYBOARD << DEVICE | 80 << CODE;
GameInput.KEYBOARD_Q = KEYBOARD << DEVICE | 81 << CODE;
GameInput.KEYBOARD_R = KEYBOARD << DEVICE | 82 << CODE;
GameInput.KEYBOARD_S = KEYBOARD << DEVICE | 83 << CODE;
GameInput.KEYBOARD_T = KEYBOARD << DEVICE | 84 << CODE;
GameInput.KEYBOARD_U = KEYBOARD << DEVICE | 85 << CODE;
GameInput.KEYBOARD_V = KEYBOARD << DEVICE | 86 << CODE;
GameInput.KEYBOARD_W = KEYBOARD << DEVICE | 87 << CODE;
GameInput.KEYBOARD_X = KEYBOARD << DEVICE | 88 << CODE;
GameInput.KEYBOARD_Y = KEYBOARD << DEVICE | 89 << CODE;
GameInput.KEYBOARD_Z = KEYBOARD << DEVICE | 90 << CODE;

GameInput.KEYBOARD_0 = KEYBOARD << DEVICE | 48 << CODE;
GameInput.KEYBOARD_1 = KEYBOARD << DEVICE | 49 << CODE;
GameInput.KEYBOARD_2 = KEYBOARD << DEVICE | 50 << CODE;
GameInput.KEYBOARD_3 = KEYBOARD << DEVICE | 51 << CODE;
GameInput.KEYBOARD_4 = KEYBOARD << DEVICE | 52 << CODE;
GameInput.KEYBOARD_5 = KEYBOARD << DEVICE | 53 << CODE;
GameInput.KEYBOARD_6 = KEYBOARD << DEVICE | 54 << CODE;
GameInput.KEYBOARD_7 = KEYBOARD << DEVICE | 55 << CODE;
GameInput.KEYBOARD_8 = KEYBOARD << DEVICE | 56 << CODE;
GameInput.KEYBOARD_9 = KEYBOARD << DEVICE | 57 << CODE;

GameInput.KEYBOARD_UP    = KEYBOARD << DEVICE | 38 << CODE;
GameInput.KEYBOARD_DOWN  = KEYBOARD << DEVICE | 40 << CODE;
GameInput.KEYBOARD_LEFT  = KEYBOARD << DEVICE | 37 << CODE;
GameInput.KEYBOARD_RIGHT = KEYBOARD << DEVICE | 39 << CODE;
GameInput.KEYBOARD_SPACE = KEYBOARD << DEVICE | 32 << CODE;
GameInput.KEYBOARD_SHIFT = KEYBOARD << DEVICE | 16 << CODE;

GameInput.POINTER_UP    = POINTER << DEVICE | 0 << CODE;
GameInput.POINTER_DOWN  = POINTER << DEVICE | 1 << CODE;
GameInput.POINTER_LEFT  = POINTER << DEVICE | 2 << CODE;
GameInput.POINTER_RIGHT = POINTER << DEVICE | 3 << CODE;
GameInput.POINTER_PRESS = POINTER << DEVICE | 4 << CODE;

GameInput.GAMEPAD_A       = GAMEPAD << DEVICE | 0  << CODE;
GameInput.GAMEPAD_B       = GAMEPAD << DEVICE | 1  << CODE;
GameInput.GAMEPAD_X       = GAMEPAD << DEVICE | 2  << CODE;
GameInput.GAMEPAD_Y       = GAMEPAD << DEVICE | 3  << CODE;
GameInput.GAMEPAD_LB      = GAMEPAD << DEVICE | 4  << CODE;
GameInput.GAMEPAD_RB      = GAMEPAD << DEVICE | 5  << CODE;
GameInput.GAMEPAD_LT      = GAMEPAD << DEVICE | 6  << CODE;
GameInput.GAMEPAD_RT      = GAMEPAD << DEVICE | 7  << CODE;
GameInput.GAMEPAD_START   = GAMEPAD << DEVICE | 8  << CODE;
GameInput.GAMEPAD_SELECT  = GAMEPAD << DEVICE | 9  << CODE;
GameInput.GAMEPAD_L       = GAMEPAD << DEVICE | 10 << CODE;
GameInput.GAMEPAD_R       = GAMEPAD << DEVICE | 11 << CODE;
GameInput.GAMEPAD_UP      = GAMEPAD << DEVICE | 12 << CODE;
GameInput.GAMEPAD_DOWN    = GAMEPAD << DEVICE | 13 << CODE;
GameInput.GAMEPAD_LEFT    = GAMEPAD << DEVICE | 14 << CODE;
GameInput.GAMEPAD_RIGHT   = GAMEPAD << DEVICE | 15 << CODE;
GameInput.GAMEPAD_L_UP    = GAMEPAD << DEVICE | 16 << CODE;
GameInput.GAMEPAD_L_DOWN  = GAMEPAD << DEVICE | 17 << CODE;
GameInput.GAMEPAD_L_LEFT  = GAMEPAD << DEVICE | 18 << CODE;
GameInput.GAMEPAD_L_RIGHT = GAMEPAD << DEVICE | 19 << CODE;
GameInput.GAMEPAD_R_UP    = GAMEPAD << DEVICE | 20 << CODE;
GameInput.GAMEPAD_R_DOWN  = GAMEPAD << DEVICE | 21 << CODE;
GameInput.GAMEPAD_R_LEFT  = GAMEPAD << DEVICE | 22 << CODE;
GameInput.GAMEPAD_R_RIGHT = GAMEPAD << DEVICE | 23 << CODE;

export default GameInput;

// Kick off input tracking
export function observe() {
  // Add the event listeners.
  addMouseListeners();
  addTouchListeners();
  addKeyboardListeners();

  // Some UI actions we should prevent.
  //window.addEventListener( "contextmenu", killEvent, true );
  //window.addEventListener( "selectstart", killEvent, true );
}

// Update next tick - after this, checking inputs will be accurate within this frame
export function update() {
  updatePointer();

  var i        = __inputs.length;
  var input    = null;
  var channels = null;

  while( i -- > 0 ) {
    input    = __inputs[ i ];
    channels = __channels[ i ];

    if( input.enabled === true ) {
      updateInput( input, channels );
    }
    else {
      input.value = 0;
    }
  }
}