import Stat from './module/stats'

window.addEventListener( "load", init );

function init () {


    // create scene
    const scene = new THREE.Scene();


    // create renderer
    const renderer = new THREE.WebGLRenderer( {
        canvas: document.querySelector( "#threeCanvas" ),
        alpha: true,
    } );

    renderer.setClearColor( new THREE.Color( "black" ), 0 );
    // renderer.setSize( 640, 480 );
    const myCanvas = document.querySelector( '#threeCanvas' );
    let canvasWidth = myCanvas.clientWidth;
    let canvasHeight = myCanvas.clientHeight;
    renderer.setSize( canvasWidth, canvasHeight );
    renderer.gammaOutput = true;


    // create camera
    var camera = new THREE.Camera();
    scene.add( camera );


    // create light
    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 0, 2 );
    scene.add( light );


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
        // canvasWidth: canvasWidth,
        // canvasHeight: canvasHeight
    } );

    console.log( source.parameters );

    context.init( function onCompleted () {

        // コンテクスト初期化が完了
        // 射影行列をコピー
        camera.projectionMatrix.copy( context.getProjectionMatrix() );

    } );


    // resiza
    window.addEventListener( "resize", function () {

        onResize();

    } );

    function onResize () {

        source.onResizeElement();
        source.copyElementSizeTo( renderer.domElement );
        if ( context.arController !== null ) {
            source.copyElementSizeTo( context.arController.canvas );
        }

    }


    // MarkerのGroup作成
    const marker = new THREE.Group();
    scene.add( marker ); // マーカをシーンに追加

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


    // モデル（メッシュ）
    // var geo = new THREE.CubeGeometry( 1, 1, 1 ); // cube ジオメトリ（サイズは 1x1x1）
    // var mat = new THREE.MeshNormalMaterial( { // マテリアルの作成
    //     transparent: true, // 透過
    //     opacity: 0.5, // 不透明度
    //     side: THREE.DoubleSide, // 内側も描く
    // } );
    // var mesh1 = new THREE.Mesh( geo, mat ); // メッシュを生成
    // mesh1.name = "cube"; // メッシュの名前（後でピッキングで使う）
    // mesh1.position.set( 0, 0.5, 0 ); // 初期位置
    // marker.add( mesh1 ); // メッシュをマーカに追加


    // animation
    let mixier;
    // gltf loader
    let loader = new THREE.GLTFLoader();

    // model load
    loader.load(
        './assets/voxel/umizoko.gltf',
        ( gltf ) => {


            // animaiton再生
            const animations = gltf.animations;
            const object = gltf.scene;
            if ( animations && animations.length ) {
                let i;
                mixier = new THREE.AnimationMixer( object );
                for ( i = 0; i < animations.length; i++ ) mixier.clipAction( animations[ i ] ).play();
            }

            // modelをgroupに追加
            marker.add( object );

        },
        ( xhr ) => ( console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ) ),
        ( error ) => ( console.log( 'An error happened ', error ) )
    );


    // performance
    const stats = new Stat();
    document.body.appendChild( stats.dom );


    // manage animation frame 
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
