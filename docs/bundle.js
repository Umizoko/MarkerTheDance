/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/Engine.js":
/*!**************************!*\
  !*** ./src/js/Engine.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Engine; });
/* harmony import */ var _module_stats__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module/stats */ "./src/js/module/stats.js");


class Engine {

    constructor( canvasElement ) {

        this.canvas = document.getElementById( canvasElement );

    }


    init() {

        // performance
        const stats = new _module_stats__WEBPACK_IMPORTED_MODULE_0__["default"]();
        document.body.appendChild( stats.dom );


        // create scene
        const scene = new THREE.Scene();


        // create renderer
        const renderer = new THREE.WebGLRenderer( {
            canvas: document.querySelector( "#threeCanvas" ),
            antialias: true,
            alpha: true,
        } );

        renderer.setClearColor( new THREE.Color( "black" ), 0 );
        const myCanvas = document.querySelector( '#threeCanvas' );
        let canvasWidth = myCanvas.clientWidth;
        let canvasHeight = myCanvas.clientHeight;
        renderer.setSize( canvasWidth, canvasHeight );
        renderer.gammaOutput = true;


        // create camera
        const camera = new THREE.Camera();
        scene.add( camera );


        // create light
        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 0, 0, 2 );
        scene.add( light );


        // ARControllerClass
        // param @ camera THREE.Camera
        // param @ marker THREE.Group
        // method

        // init
        // update
        // resize

        // arToolkitSource
        const source = new THREEx.ArToolkitSource( {
            sourceType: "webcam",
        } );

        source.init( function onReady () {
            onResize();
        } );


        // create arToolkitContext
        const context = new THREEx.ArToolkitContext( {
            debug: false,
            cameraParametersUrl: "ar/camera_para.dat",
            detectionMode: "mono",
            imageSmoothingEnabled: true,
            maxDetectionRate: 30,
            canvasWidth: source.parameters.sourceWidth,
            canvasHeight: source.parameters.sourceHeight,
        } );

        context.init( function onCompleted () {

            // コンテクスト初期化が完了
            camera.projectionMatrix.copy( context.getProjectionMatrix() );

        } );


        // MarkerのGroup作成
        const marker = new THREE.Group();
        scene.add( marker );

        // set arMarkerControls
        const option = {
            size: 1,
            type: 'pattern',
            patternUrl: 'ar/hiro.patt'
        }
        const controls = new THREEx.ArMarkerControls(
            context,
            marker,
            option
        );


        // GLTFModelClass
        // params @ filename String
        // params @ scene THREE.Scene
        // params @ group THREE.Group
        // params @ mixier THREE.Mixier

        // method
        // init
        // update
        // animStart
        // animation
        // let mixier;
        // // gltf loader
        // let loader = new THREE.GLTFLoader();

        // // model load
        // loader.load(
        //     './assets/voxel/umizoko.gltf',
        //     ( gltf ) => {


        //         // animaiton再生
        //         const animations = gltf.animations;
        //         const object = gltf.scene;
        //         if ( animations && animations.length ) {
        //             let i;
        //             mixier = new THREE.AnimationMixer( object );
        //             for ( i = 0; i < animations.length; i++ ) mixier.clipAction( animations[ i ] ).play();
        //         }

        //         // modelをgroupに追加
        //         marker.add( object );

        //     },
        //     ( xhr ) => ( console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ) ),
        //     ( error ) => ( console.log( 'An error happened ', error ) )
        // );


        // FBXModelClass
        // params @ filename String
        // params @ scene THREE.Scene
        // params @ group THREE.Group
        // params @ mixier THREE.Mixier

        // method
        // init
        // update
        // animStart

        // manage animation frame 
        const clock = new THREE.Clock();
        // control key frame
        let mixier;

        let loader = new THREE.FBXLoader();
        loader.load(
            './assets/robot/WaveHipHopDance.fbx',
            ( object ) => {

                object.mixier = new THREE.AnimationMixer( object );
                mixier = object.mixier;

                const action = object.mixier.clipAction( object.animations[ 0 ] );
                action.play();

                // scaling
                object.scale.set( 0.01, 0.01, 0.01 );

                marker.add( object );
            }
        );

        // audio
        const audioElement = new Audio();
        audioElement.setAttribute( 'src', './assets/sound/Go_to_the_camp.mp3' );
        document.body.appendChild( audioElement );
        audioElement.loop = true;
        audioElement.play();

        tick();

        function tick () {


            requestAnimationFrame( tick );

            if ( source.ready === false ) return;

            // obs performance
            stats.update();

            // ar
            context.update( source.domElement );

            // animation
            if ( mixier ) mixier.update( clock.getDelta() );

            renderer.render( scene, camera );


            // resiza
            window.addEventListener( "resize", function () {

                onResize();

            } );

        }

        function onResize () {

            source.onResizeElement();
            source.copyElementSizeTo( renderer.domElement );
            if ( context.arController !== null ) {
                source.copyElementSizeTo( context.arController.canvas );
            }

        }
    }

}


/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Engine */ "./src/js/Engine.js");


window.addEventListener( 'load', () => {

    const scene = new _Engine__WEBPACK_IMPORTED_MODULE_0__["default"]( 'threeCanvas' );

    scene.init();

} );


/***/ }),

/***/ "./src/js/module/stats.js":
/*!********************************!*\
  !*** ./src/js/module/stats.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Stats; });
/**
 * @author mrdoob / http://mrdoob.com/
 */

var Stats = function () {
    var mode = 0

    var container = document.createElement( 'div' )
    container.style.cssText =
        'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000'
    container.addEventListener(
        'click',
        function ( event ) {
            event.preventDefault()
            showPanel( ++mode % container.children.length )
        },
        false
    )

    //

    function addPanel ( panel ) {
        container.appendChild( panel.dom )
        return panel
    }

    function showPanel ( id ) {
        for ( var i = 0; i < container.children.length; i++ ) {
            container.children[ i ].style.display = i === id ? 'block' : 'none'
        }

        mode = id
    }

    //

    var beginTime = ( performance || Date ).now(),
        prevTime = beginTime,
        frames = 0

    var fpsPanel = addPanel( new Stats.Panel( 'FPS', '#0ff', '#002' ) )
    var msPanel = addPanel( new Stats.Panel( 'MS', '#0f0', '#020' ) )

    if ( self.performance && self.performance.memory ) {
        var memPanel = addPanel( new Stats.Panel( 'MB', '#f08', '#201' ) )
    }

    showPanel( 0 )

    return {
        REVISION: 16,

        dom: container,

        addPanel: addPanel,
        showPanel: showPanel,

        begin: function () {
            beginTime = ( performance || Date ).now()
        },

        end: function () {
            frames++

            var time = ( performance || Date ).now()

            msPanel.update( time - beginTime, 200 )

            if ( time >= prevTime + 1000 ) {
                fpsPanel.update( ( frames * 1000 ) / ( time - prevTime ), 100 )

                prevTime = time
                frames = 0

                if ( memPanel ) {
                    var memory = performance.memory
                    memPanel.update(
                        memory.usedJSHeapSize / 1048576,
                        memory.jsHeapSizeLimit / 1048576
                    )
                }
            }

            return time
        },

        update: function () {
            beginTime = this.end()
        },

        // Backwards Compatibility

        domElement: container,
        setMode: showPanel,
    }
}

Stats.Panel = function ( name, fg, bg ) {
    var min = Infinity,
        max = 0,
        round = Math.round
    var PR = round( window.devicePixelRatio || 1 )

    var WIDTH = 80 * PR,
        HEIGHT = 48 * PR,
        TEXT_X = 3 * PR,
        TEXT_Y = 2 * PR,
        GRAPH_X = 3 * PR,
        GRAPH_Y = 15 * PR,
        GRAPH_WIDTH = 74 * PR,
        GRAPH_HEIGHT = 30 * PR

    var canvas = document.createElement( 'canvas' )
    canvas.width = WIDTH
    canvas.height = HEIGHT
    canvas.style.cssText = 'width:80px;height:48px'

    var context = canvas.getContext( '2d' )
    context.font = 'bold ' + 9 * PR + 'px Helvetica,Arial,sans-serif'
    context.textBaseline = 'top'

    context.fillStyle = bg
    context.fillRect( 0, 0, WIDTH, HEIGHT )

    context.fillStyle = fg
    context.fillText( name, TEXT_X, TEXT_Y )
    context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT )

    context.fillStyle = bg
    context.globalAlpha = 0.9
    context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT )

    return {
        dom: canvas,

        update: function ( value, maxValue ) {
            min = Math.min( min, value )
            max = Math.max( max, value )

            context.fillStyle = bg
            context.globalAlpha = 1
            context.fillRect( 0, 0, WIDTH, GRAPH_Y )
            context.fillStyle = fg
            context.fillText(
                round( value ) +
                ' ' +
                name +
                ' (' +
                round( min ) +
                '-' +
                round( max ) +
                ')',
                TEXT_X,
                TEXT_Y
            )

            context.drawImage(
                canvas,
                GRAPH_X + PR,
                GRAPH_Y,
                GRAPH_WIDTH - PR,
                GRAPH_HEIGHT,
                GRAPH_X,
                GRAPH_Y,
                GRAPH_WIDTH - PR,
                GRAPH_HEIGHT
            )

            context.fillRect(
                GRAPH_X + GRAPH_WIDTH - PR,
                GRAPH_Y,
                PR,
                GRAPH_HEIGHT
            )

            context.fillStyle = bg
            context.globalAlpha = 0.9
            context.fillRect(
                GRAPH_X + GRAPH_WIDTH - PR,
                GRAPH_Y,
                PR,
                round( ( 1 - value / maxValue ) * GRAPH_HEIGHT )
            )
        },
    }
}




/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map