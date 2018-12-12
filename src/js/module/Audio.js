/**
 *Audioを制御するクラス
 *
 * @export
 * @class Audio
 */
export default class Audio {

    /**
     *Creates an instance of Audio.
     * @param {AudioBuffer} bufferNow 
     * @param {AudioContext} context
     * @memberof Audio
     */
    constructor( bufferNow, context ) {

        this.playNow = this.createSource( bufferNow, context );
        this.source = this.playNow.source;
        this.gainNode = this.playNow.gainNode;

        // Play the playNow track.
        this.source.start( 0 );

        // volume 0
        this.gainNode.gain.value = 0;

    }

    /**
     *ソース、エフェクトノード（Gain）を作成
     *
     * @param {AudioBuffer} buffer
     * @param {AudioContext} context
     * @returns {source, gainNode}
     * @memberof Audio
     */
    createSource( buffer, context ) {

        var source = context.createBufferSource();
        // Create a gain node.
        var gainNode = context.createGain();
        source.buffer = buffer;
        // Turn on looping.
        source.loop = true;
        // Connect source to gain.
        source.connect( gainNode );
        // Connect gain to destination.
        gainNode.connect( context.destination );

        return {
            source: source,
            gainNode: gainNode
        };

    }


    /**
     *volumeをフェードインする
     *
     * @memberof Audio
     */
    volumeFadeIn() {

        if ( this.gainNode.gain.value <= 1.0 ) this.gainNode.gain.value += 0.01;

    }

    /**
     *volumeをフェードアウトする
     *
     * @memberof Audio
     */
    volumeFadeOut() {

        if ( this.gainNode.gain.value > 0.0 ) this.gainNode.gain.value -= 0.01;
        else if ( this.gainNode.gain.value < 0.0 ) this.gainNode.gain.value += 0.01;

    }

}
