import Stat from './module/stats'

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
    const stats = new Stat();
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
