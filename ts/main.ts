/// <reference path="box2d_imports.ts" />
/// <reference path="defs/easeljs/easeljs.d.ts" />
/// <reference path="input.ts" />
/// <reference path="level.ts" />

class Main
{
    private debug_draw = new b2DebugDraw();
    private level:Level;

    constructor(private canvas:HTMLCanvasElement)
    {
        g_input = new Input();

        this.debug_draw.SetSprite(canvas.getContext("2d"));
        this.debug_draw.SetDrawScale(30.0);
        this.debug_draw.SetFillAlpha(0.5);
        this.debug_draw.SetLineThickness(1.0);
        this.debug_draw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

        this.level = new Level(this.debug_draw);

        this.on_tick();
    }

    private on_tick():void
    {
        this.level.on_tick();
        setTimeout(this.on_tick.bind(this), 1000 / 60);
    }
}

var m = new Main(<HTMLCanvasElement>document.getElementById("c"));
