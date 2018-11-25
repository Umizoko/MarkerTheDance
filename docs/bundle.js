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
/*! no static exports found */
/***/ (function(module, exports) {

window.addEventListener( "load", init );

function init () {

    var scene = new THREE.Scene(); // シーンの作成
    var renderer = new THREE.WebGLRenderer( { // レンダラの作成
        canvas: document.querySelector( "#threeCanvas" ),
        alpha: true,
    } );

    renderer.setClearColor( new THREE.Color( "black" ), 0 ); // レンダラの背景色
    renderer.setSize( 640, 480 ); // レンダラのサイズ

    // renderer.domElement.style.position = "absolute"; // レンダラの位置は絶対値
    // renderer.domElement.style.top = "0px"; // レンダラの上端
    // renderer.domElement.style.left = "0px"; // レンダラの左端
    // document.body.appendChild( renderer.domElement ); // レンダラの DOM を body に入れる

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
    // マーカ隠蔽（cloaking）
    // var videoTex = new THREE.VideoTexture( source.domElement ); // 映像をテクスチャとして取得
    // videoTex.minFilter = THREE.NearestFilter; // 映像テクスチャのフィルタ処理
    // var cloak = new THREEx.ArMarkerCloak( videoTex ); // マーカ隠蔽(cloak)オブジェクト
    // cloak.object3d.material.uniforms.opacity.value = 1.0; // cloakの不透明度
    // marker1.add( cloak.object3d ); // cloakをマーカに追加


    // render
    function render () {
        requestAnimationFrame( render );
        if ( source.ready === false ) return;
        context.update( source.domElement );
        renderer.render( scene, camera );
    }

    render();

}


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map