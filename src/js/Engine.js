import Stat from './module/stats'

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
        const audioElement = document.createElement( 'audio' );
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
