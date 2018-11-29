import Stat from './module/stats'
import FBXModel from './module/FBXModel'
import GLTFModel from './module/GLTFModel'

export default class Engine {

    constructor( canvasElement ) {

        this.canvas = document.getElementById( canvasElement );

    }


    init() {

        // performance
        const stats = new Stat();
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
        renderer.gammaInput = true;
        renderer.shadowMap.enabled = true;

        // create camera
        const camera = new THREE.Camera();
        scene.add( camera );


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

        // CubeMap(環境マップ)
        const cubeTextureLoader = new THREE.CubeTextureLoader();
        const env = './assets/env/Lycksele2/';
        const textureCube = cubeTextureLoader.load( [
            env + 'posx.jpg',
            env + 'negx.jpg',
            env + 'posy.jpg',
            env + 'negy.jpg',
            env + 'posz.jpg',
            env + 'negz.jpg'
        ] );


        const robot = new FBXModel(
            './assets/robot/WaveHipHopDance.fbx',
            scene,
            marker,
            textureCube
        );

        robot.init();

        // Web Audio API
        // FIXME: 汎用クラスでの書き換え
        let audioContext;
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();

        let dogBarkingBuffer = null;

        function loadDogSound ( url ) {

            let request = new XMLHttpRequest();
            request.open( 'GET', url, true );
            request.responseType = 'arraybuffer';


            request.onload = () => {
                audioContext.decodeAudioData( request.response, ( buffer ) => {
                    dogBarkingBuffer = buffer;
                    playSound( dogBarkingBuffer );
                } );
            }

            request.send();
        }

        function playSound ( buffer ) {
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect( audioContext.destination );
            source.start( 0 );
            source.loop = true;
        }

        loadDogSound( './assets/sound/Go_to_the_camp.mp3' );

        // Directional Light
        const directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1 );
        directionalLight.castShadow = true;
        directionalLight.position.y = 4;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add( directionalLight );


        // floor
        const floor = new THREE.Mesh(
            new THREE.BoxGeometry( 2, 0.1, 2 ),
            new THREE.MeshStandardMaterial( {
                color: 0xFFFFFF,
                roughness: 0,
                metalness: 1,
                envMap: textureCube
            } )
        );
        floor.position.y = -0.1
        floor.receiveShadow = true;
        marker.add( floor );

        tick();

        function tick () {


            requestAnimationFrame( tick );

            if ( source.ready === false ) return;

            // obs performance
            stats.update();

            // ar
            context.update( source.domElement );

            // robot update
            robot.update();

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
