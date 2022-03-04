class CanvasSlider{
    constructor(x, y, w, h, range={min:0, max:1}, value=0.5){
        this.min = range.min;
        this.max = range.max;
        this.value = value;
        this.init(x, y, w, h);
        this.needsUpdate = false;
    }
  
    init(x, y, w, h){
        this.left = w*0.85;
        let gap = Math.max(w*0.05, h*0.05);
        this.slider = {x,y,width:this.left-gap,height:h};
        this.text = {x:this.left + x,y,width:w-this.left,height:h};
        const fontSize = this.text.width * 0.2;
        this.middle = h/2;
        this.x = x;
        this.font = `${fontSize}px sans-serif`;
    }

    drawSlider(ctx){

    }

    update(ctx){
        this.drawSlider(ctx)
        ctx.font = this.font;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.value.toFixed(2), this.x, this.middle);
    }
}

export { CanvasSlider };