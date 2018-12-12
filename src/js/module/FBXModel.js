/**
 *FBXモデルを読み込むクラス
 *
 * @export
 * @class FBXModel
 */
export default class FBXModel {

    /**
     *Creates an instance of FBXModel.
     * @param {String} filename
     * @param {THREE.Scene} scene
     * @param {THREE.Group} group
     * @param {THREE.CubeTexture} textureCube
     * @memberof FBXModel
     */
    constructor( filename, scene, group, textureCube ) {

        this._filename = filename;
        this._scene = scene;
        this._group = group;
        this._mixier;
        this._clock = new THREE.Clock();
        this._textureCube = textureCube;

        this._meshName = 'SkinnedMesh';

    }

    /**
     *初期化
     *
     * @memberof FBXModel
     */
    init() {

        const loader = new THREE.FBXLoader();
        loader.load(

            this._filename,

            ( object ) => {

                object.mixier = new THREE.AnimationMixer( object );
                this._mixier = object.mixier;

                const action = object.mixier.clipAction( object.animations[ 0 ] );
                action.play();

                // scaling
                object.scale.set( 0.01, 0.01, 0.01 );

                this._group.add( object );

                // Mesh抽出
                object.children.map( ( value, index ) => {

                    // Meshの設定
                    if ( value.type === this._meshName ) {

                        value.material.envMap = this._textureCube;
                        value.material.shininess = 90;
                        value.material.reflectivity = 0.8;

                        // shadow
                        value.castShadow = true;
                    }
                } );

            }
        );
    }

    /**
     *update
     *
     * @memberof FBXModel
     */
    update() {

        // Animationの更新
        if ( this._mixier ) this._mixier.update( this._clock.getDelta() );

    }

}
