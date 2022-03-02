
function devsrvMonitorFileChanges() {
    
    const evtSource = new EventSource( '/devsrv' );
    evtSource.addEventListener( 'reload', reload );
    evtSource.onerror = onerror;

    function reload() {

        console.log( 'changes detected, reloading' );

        const searchParams = new URLSearchParams( window.location.search );
        const reloadTime = parseInt( searchParams.get( 'reload' ) ) || 0;

        searchParams.set( 'reload', reloadTime+1 );

        setTimeout( () => {

            window.location.search = searchParams.toString();
        
        }, 200 );

    }

    function onerror( err ) {

        console.error( err );

    }

}

setTimeout(devsrvMonitorFileChanges, 1000);

