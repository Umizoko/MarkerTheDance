export default class GLTFModel {

    constructor( filename, scene, group ) {

        this._filename = filename;
        this._scene = scene;
        this._group = group;
        this._mixier;
        this._clock = new THREE.Clock();

    }

    init() {

        // gltf loader
        const loader = new THREE.GLTFLoader();
        loader.load(
            this._filename,
            ( gltf ) => {

                // animaiton再生
                const animations = gltf.animations;
                const object = gltf.scene;
                if ( animations && animations.length ) {
                    let i;
                    this._mixier = new THREE.AnimationMixer( object );
                    for ( i = 0; i < animations.length; i++ ) this._mixier.clipAction( animations[ i ] ).play();
                }

                // modelをgroupに追加
                this._group.add( object );

            },
            ( xhr ) => ( console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ) ),
            ( error ) => ( console.log( 'An error happened ', error ) )
        );

    }

    update() {

        if ( this._mixier ) this._mixier.update( this._clock.getDelta() );

    }


}
