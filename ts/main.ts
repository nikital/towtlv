/// <reference path="box2d_imports.ts" />
/// <reference path="defs/easeljs/easeljs.d.ts" />
/// <reference path="defs/generated.d.ts" />
/// <reference path="common.ts" />
/// <reference path="input.ts" />
/// <reference path="preload.ts" />
/// <reference path="props.ts" />
/// <reference path="level.ts" />

class Main
{
    private debug_draw = new b2DebugDraw();
    private stage:createjs.Stage;
    private level:Level;

    constructor(private canvas:HTMLCanvasElement)
    {
        g_common = new Common();
        g_input = new Input();

        this.stage = new createjs.Stage(canvas);

        this.debug_draw.SetSprite(canvas.getContext("2d"));
        this.debug_draw.SetDrawScale(g_common.pixel_scale);
        this.debug_draw.SetFillAlpha(0.5);
        this.debug_draw.SetLineThickness(1.0);
        this.debug_draw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

        Preload.queue.on("complete", this.on_preload, this);
        Preload.queue.loadManifest(preload_manifest);
    }

    private on_preload():void
    {
        this.level = new Level(0, this.debug_draw);
        this.stage.addChild(this.level);

        this.on_tick();
    }

    private on_tick():void
    {
        this.level.on_tick();
        setTimeout(this.on_tick.bind(this), 1000 / 60);

        this.stage.update();
        // this.level.draw_debug();
    }
}

var m = new Main(<HTMLCanvasElement>document.getElementById("c"));
