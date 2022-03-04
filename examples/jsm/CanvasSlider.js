class CanvasSlider{
    constructor(x, y, w, h, range={min:0, max:1}, value=0.5){
        this.min = range.min;
        this.max = range.max;
        this.value = value;
        this.init(x, y, w, h);
        this.needsUpdate = false;
    }
  
    init(x, y, w, h){
        const left = w*0.9;
        const gap = Math.max(w*0.05, h*0.05);
        const fontSize = (w-left) * 0.3;
        const radius = 15;
        this.slider = {x:x+radius,y,width:left-gap-2*radius,height:h};
        this.text = {x:left + x, y:y + h/2, width:w-left, height:h, font: `${fontSize}px sans-serif`};
    }

    drawSlider(ctx){
        if (this.canvasui){
            ctx.fillStyle = '#aaa';
            const middle = this.slider.y + this.slider.height*0.5;
            this.canvasui.fillRoundedRect(this.slider.x, middle-3, this.slider.width, 6, 3);
            ctx.fillStyle = '#ee3';
            const posX = this.slider.x + this.slider.width * (this.value - this.min)/(this.max-this.min);
            ctx.beginPath();
            ctx.arc(posX, middle, 15, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    update(ctx){
        this.drawSlider(ctx)
        ctx.font = this.text.font;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(this.value.toFixed(2), this.text.x, this.text.y);
    }
}

export { CanvasSlider };