import { Color } from 'https://cdn.skypack.dev/three@0.119';

class CanvasColorPicker{
    constructor( x, y, w, h, col ){
        this.init( x, y, w, h );
        this.color.hex = col;
        this.color.base = '#FF0000';
        this.needsUpdate = false;
    }

    init( x, y, w, h ){
        let left = w*0.85;
        let top = h*0.85;
        let gap = Math.max( w*0.05, h*0.05 );
        let splitWidth = ( left-gap ) * 0.5; 
        this.picker = { x,y,width:left-gap,height:top-gap };
        this.strip = { x:left + x,y,width:w-left,height:h };
        this.color = { x,y:top + y,width:splitWidth,height:h-top };
        this.hex = { x:splitWidth+gap + x, y:top+y + ( h-top )*0.5, width: splitWidth, height:h-top };
        const fontSize = splitWidth * 0.2;
        this.font = `${fontSize}px sans-serif`;
        if ( this.grdWhite ) delete this.grdWhite;
        if ( this.grdBlack ) delete this.grdBlack;
        if ( this.grdStrip ) delete this.grdStrip;
    }

    createGradients( ctx ){
        this.grdWhite = ctx.createLinearGradient( this.picker.x, 0, this.picker.x + this.picker.width, 0 );
        this.grdWhite.addColorStop( 0, 'rgba(255,255,255,1)' );
        this.grdWhite.addColorStop( 1, 'rgba(255,255,255,0)' );

        this.grdBlack = ctx.createLinearGradient( 0, this.picker.y, 0, this.picker.y + this.picker.height );
        this.grdBlack.addColorStop( 0, 'rgba(0,0,0,0)' );
        this.grdBlack.addColorStop( 1, 'rgba(0,0,0,1)' );

        const grd = ctx.createLinearGradient( 0, this.strip.y, 0, this.strip.y + this.strip.height );
        grd.addColorStop( 0.05, 'rgba(255, 0, 0, 1)' );
        grd.addColorStop( 0.17, 'rgba(255, 255, 0, 1)' );
        grd.addColorStop( 0.34, 'rgba(0, 255, 0, 1)' );
        grd.addColorStop( 0.51, 'rgba(0, 255, 255, 1)' );
        grd.addColorStop( 0.68, 'rgba(0, 0, 255, 1)' );
        grd.addColorStop( 0.85, 'rgba(255, 0, 255, 1)' );
        grd.addColorStop( 0.95, 'rgba(255, 0, 0, 1)' );
        this.grdStrip = grd;
    }

    get hexStr(){
        let hex = this.color.hex.replace( '#', '' );

        if ( hex.length === 3 ) {
            hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
        } 

        return hex;
    }

    get colRGBA(){
        const hex = this.hexStr;

        const r = parseInt( hex.substring( 0, 2 ), 16 );
        const g = parseInt( hex.substring( 2, 4 ), 16 );
        const b = parseInt( hex.substring( 4, 6 ), 16 );

        return `rgba(${r},${g},${b},1)`;
    }

    get colTHREE(){
        const hex = this.hexStr;    

        const r = parseInt( hex.substring( 0, 2 ), 16 )/255.0;
        const g = parseInt( hex.substring( 2, 4 ), 16 )/255.0;
        const b = parseInt( hex.substring( 4, 6 ), 16 )/255.0;

        return new Color( r, g, b );
    }

    get colR(){
        const hex = this.hexStr;    

        const r = parseInt( hex.substring( 0, 2 ), 16 );

        return r;
    }

    /*
    get colB(){
        const hex = this.hexStr;   

        const g = parseInt( hex.substring( 2, 4 ), 16 );
        
        return g;
    }
    */
   
    get colB(){
        const hex = this.hexStr;

        const b = parseInt( hex.substring( 4, 6 ), 16 );

        return b;
    }

    inPtRect( pt, rect ){
        return ( pt.x>rect.x && pt.x<( rect.x + rect.width ) && pt.y>rect.y && pt.y<( rect.y + rect.height ) );
    }

    onSelect( pt ){
        if ( this.inPtRect( pt, this.strip ) ){
            const imageData = this.ctx.getImageData( pt.x, pt.y, 1, 1 ).data;
            this.color.base = '#' + ( ( 1 << 24 ) + ( imageData[0] << 16 ) + ( imageData[1] << 8 ) + imageData[2] ).toString( 16 ).slice( 1 );
            this.needsUpdate = true;
        }else if( this.inPtRect( pt, this.picker ) ){
            const imageData = this.ctx.getImageData( pt.x, pt.y, 1, 1 ).data;
            this.color.hex = '#' + ( ( 1 << 24 ) + ( imageData[0] << 16 ) + ( imageData[1] << 8 ) + imageData[2] ).toString( 16 ).slice( 1 );
            this.needsUpdate = true;
            if ( this.onChange ) this.onChange( this.color.hex );
        }
    }

    drawPicker( ctx ) {
        if ( this.grdWhite === undefined ) this.createGradients( ctx );

        ctx.fillStyle = this.color.base;
        ctx.fillRect( this.picker.x, this.picker.y, this.picker.width, this.picker.height );
    
        ctx.fillStyle = this.grdWhite;
        ctx.fillRect( this.picker.x, this.picker.y, this.picker.width, this.picker.height );
        
        ctx.fillStyle = this.grdBlack;
        ctx.fillRect( this.picker.x, this.picker.y, this.picker.width, this.picker.height );
        ctx.fillRect( this.picker.x, this.picker.y, this.picker.width, this.picker.height );
    }

    drawStrip( ctx ){
        if ( this.grdStrip === undefined ) this.createGradients( ctx );
        
        ctx.fillStyle = this.grdStrip;
        ctx.fillRect( this.strip.x, this.strip.y, this.strip.width, this.strip.height );  
    }

    update( ctx ){
        this.ctx = ctx;
        //const transform = ctx.getTransform();
        //ctx.resetTransform();
        this.drawPicker( ctx );
        this.drawStrip( ctx );
        ctx.fillStyle = this.color.hex;
        ctx.fillRect( this.color.x, this.color.y, this.color.width, this.color.height );
        ctx.fillStyle = '#fff';
        ctx.font = this.font;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText( this.color.hex, this.hex.x, this.hex.y );
        //ctx.setTransform(transform);
    }
}

export { CanvasColorPicker };