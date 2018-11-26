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

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _module_stats__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module/stats */ "./src/js/module/stats.js");


window.addEventListener( "load", init );

function init () {

    var scene = new THREE.Scene(); // シーンの作成
    var renderer = new THREE.WebGLRenderer( { // レンダラの作成
        canvas: document.querySelector( "#threeCanvas" ),
        alpha: true,
    } );

    renderer.setClearColor( new THREE.Color( "black" ), 0 ); // レンダラの背景色
    renderer.setSize( 640, 480 ); // レンダラのサイズ
    renderer.gammaOutput = true;


    var camera = new THREE.Camera(); // カメラの作成
    scene.add( camera ); // カメラをシーンに追加


    var light = new THREE.DirectionalLight( 0xffffff ); // 平行光源（白）を作成
    light.position.set( 0, 0, 2 ); // カメラ方向から照らす
    scene.add( light );


    // arToolkitSource
    const source = new THREEx.ArToolkitSource( {
        sourceType: "webcam",
    } );
    source.init( function onReady () {
        onResize();
    } );


    // set arToolkitContext
    const context = new THREEx.ArToolkitContext( { // arToolkitContextの作成
        debug: false, // デバッグ用キャンバス表示（デフォルトfalse）
        cameraParametersUrl: "ar/camera_para.dat", // カメラパラメータファイル
        detectionMode: "mono", // 検出モード（color/color_and_matrix/mono/mono_and_matrix）
        imageSmoothingEnabled: true, // 画像をスムージングするか（デフォルトfalse）
        maxDetectionRate: 30, // マーカの検出レート（デフォルト60）
        canvasWidth: source.parameters.sourceWidth, // マーカ検出用画像の幅（デフォルト640）
        canvasHeight: source.parameters.sourceHeight, // マーカ検出用画像の高さ（デフォルト480）
    } );
    context.init( function onCompleted () { // コンテクスト初期化が完了したら
        camera.projectionMatrix.copy( context.getProjectionMatrix() ); // 射影行列をコピー
    } );


    // resiza
    window.addEventListener( "resize", function () { // ウィンドウがリサイズされたら
        onResize(); // リサイズ処理
    } );
    // リサイズ関数
    function onResize () {
        source.onResizeElement(); // トラッキングソースをリサイズ
        source.copyElementSizeTo( renderer.domElement ); // レンダラも同じサイズに
        if ( context.arController !== null ) { // arControllerがnullでなければ
            source.copyElementSizeTo( context.arController.canvas ); // それも同じサイズに
        }
    }


    // Marker検出時
    var marker1 = new THREE.Group(); // マーカをグループとして作成
    var controls = new THREEx.ArMarkerControls( context, marker1, { // マーカを登録
        size: 1,
        type: "pattern", // マーカのタイプ
        patternUrl: "ar/hiro.patt", // マーカファイル
    } );
    scene.add( marker1 ); // マーカをシーンに追加

    // モデル（メッシュ）
    var geo = new THREE.CubeGeometry( 1, 1, 1 ); // cube ジオメトリ（サイズは 1x1x1）
    var mat = new THREE.MeshNormalMaterial( { // マテリアルの作成
        transparent: true, // 透過
        opacity: 0.5, // 不透明度
        side: THREE.DoubleSide, // 内側も描く
    } );
    var mesh1 = new THREE.Mesh( geo, mat ); // メッシュを生成
    mesh1.name = "cube"; // メッシュの名前（後でピッキングで使う）
    mesh1.position.set( 0, 0.5, 0 ); // 初期位置
    marker1.add( mesh1 ); // メッシュをマーカに追加


    let mixier;
    let loader = new THREE.GLTFLoader();

    loader.load(
        './assets/voxel/umizoko.gltf',
        ( gltf ) => {

            // modelをgroupに追加
            marker1.add( gltf.scene );

            // animaiton再生
            const animations = gltf.animations;
            console.log( animations );
            console.log( gltf.scene );
            if ( animations && animations.length ) {
                let i;
                mixier = new THREE.AnimationMixer( gltf.scene );
                for ( i = 0; i < animations.length; i++ ) mixier.clipAction( animations[ i ] ).play();
            }

        },
        ( xhr ) => ( console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ) ),
        ( error ) => ( console.log( 'An error happened ', error ) )
    );


    // マーカ隠蔽（cloaking）
    // var videoTex = new THREE.VideoTexture( source.domElement ); // 映像をテクスチャとして取得
    // videoTex.minFilter = THREE.NearestFilter; // 映像テクスチャのフィルタ処理
    // var cloak = new THREEx.ArMarkerCloak( videoTex ); // マーカ隠蔽(cloak)オブジェクト
    // cloak.object3d.material.uniforms.opacity.value = 1.0; // cloakの不透明度
    // marker1.add( cloak.object3d ); // cloakをマーカに追加

    // performance
    const stats = new _module_stats__WEBPACK_IMPORTED_MODULE_0__["default"]();
    document.body.appendChild( stats.dom );

    const clock = new THREE.Clock();

    // render
    function render () {

        // obs performance
        stats.update();

        requestAnimationFrame( render );

        if ( source.ready === false ) return;

        // ar
        context.update( source.domElement );

        // animation
        if ( mixier ) mixier.update( clock.getDelta() );

        renderer.render( scene, camera );
    }

    render();

}


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