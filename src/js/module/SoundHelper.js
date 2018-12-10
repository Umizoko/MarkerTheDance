export function playerFadeinout ( bufferNow, context ) {
    const playNow = createSource( bufferNow, context );
    const source = playNow.source;
    const gainNode = playNow.gainNode;
    const duration = bufferNow.duration;
    const currTime = context.currentTime;

    let ctx = {
        FADE_TIME: 10,
        timer: '',
    }

    const volumeMax = 0.5;

    // FIXME: noiseが混じる 修正
    // Effect
    const filter = context.createBiquadFilter();
    // create the audio graph
    source.connect( filter );
    filter.connect( context.destination );
    // // create and specify params for the filter
    // filter.type = 'lowpass';
    // filter.frequency.value = 2000;
    // filter.gain.value = volumeMax;

    // Fade the playNow track in
    gainNode.gain.linearRampToValueAtTime( 0, currTime );
    gainNode.gain.linearRampToValueAtTime( volumeMax, currTime + ctx.FADE_TIME );

    // Play the playNow track.
    source.start( 0 );
    // At the end of the track, fade it out.
    gainNode.gain.linearRampToValueAtTime( volumeMax, currTime + duration - ctx.FADE_TIME );
    gainNode.gain.linearRampToValueAtTime( 0, currTime + duration );

    // Schedule a recursive track change with the tracks swapped.
    // setTimeout( () => {
    //     playerFadeinout( bufferNow, context );
    // }, duration * 1000 );
}


function createSource ( buffer, context ) {
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
