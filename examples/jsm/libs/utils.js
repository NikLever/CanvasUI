function isDefined( value ) {
    return typeof value !== 'undefined';
}

function mergeConfig( ...objects ) {
    const isObject = obj => obj && typeof obj === 'object';
    
    return objects.reduce( ( prev, obj ) => {
        Object.keys( obj ).forEach( key => {
            const pVal = prev[key];
            const oVal = obj[key];
        
            if ( Array.isArray( pVal ) && Array.isArray( oVal ) ) {
                // use this line to contact object rather than replace
                //prev[key] = pVal.concat(...oVal);
                // in our case, don't concat but just replace 
                prev[key] = oVal;
            } else if ( isObject( pVal ) && isObject( oVal ) ) {
                prev[key] = mergeConfig( pVal, oVal );
            } else {
                prev[key] = oVal;
            }
        } );
      
        return prev;
    }, {} );
}

export { 
    isDefined,
    mergeConfig
};
