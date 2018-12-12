import Engine from './Engine'

// ロード後の処理
window.addEventListener( 'load', () => {

    const scene = new Engine( 'threeCanvas' );

    scene.init();

} );
