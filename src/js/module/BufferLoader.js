/**
 *Audioデータを読み込むクラス
 *
 * @export
 * @class BufferLoader
 */
export default class BufferLoader {


    /**
     *Creates an instance of BufferLoader.
     * @param {AudioContext} context
     * @param {Array} urlList
     * @param {callback} callback
     * @memberof BufferLoader
     */
    constructor( context, urlList, callback ) {
        this.context = context;
        this.urlList = urlList;
        this.onload = callback;
        this.bufferList = new Array();
        this.loadCount = 0;
    }

    /**
     *Audioデータの読み込み
     *
     * @param {String} url
     * @param {Number} index
     * @memberof BufferLoader
     */
    loadBuffer( url, index ) {
        // Load buffer asynchronously
        var request = new XMLHttpRequest();
        request.open( "GET", url, true );
        request.responseType = "arraybuffer";

        var loader = this;

        request.onload = function () {
            // Asynchronously decode the audio file data in request.response
            loader.context.decodeAudioData(
                request.response,
                function ( buffer ) {
                    if ( !buffer ) {
                        alert( 'error decoding file data: ' + url );
                        return;
                    }
                    loader.bufferList[ index ] = buffer;
                    if ( ++loader.loadCount == loader.urlList.length )
                        loader.onload( loader.bufferList );
                },
                function ( error ) {
                    console.error( 'decodeAudioData error', error );
                }
            );
        }

        request.onerror = function () {
            alert( 'BufferLoader: XHR error' );
        }

        request.send();
    }

    /**
     *ロード実行
     *
     * @memberof BufferLoader
     */
    load() {
        for ( var i = 0; i < this.urlList.length; ++i )
            this.loadBuffer( this.urlList[ i ], i );
    }


}
