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
    private curr_level:number = 0;
    private level:Level;

    constructor(private canvas:HTMLCanvasElement)
    {
        g_common = new Common();
        g_common.canvas = canvas;
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
        this.load_level(0);

        this.on_tick();
    }

    private load_level(level:number):void
    {
        this.curr_level = level;

        if (this.level)
        {
            this.stage.removeChild(this.level);
        }

        this.level = new Level(this.curr_level, this.debug_draw);
        this.level.on('fail', this.on_fail, this);
        this.level.on('win', this.on_win, this);
        this.stage.addChild(this.level);

        console.log('Loaded level', level);
    }

    private on_tick():void
    {
        if (this.level)
        {
            this.level.on_tick();
        }

        this.stage.update();
        if (this.level)
        {
            // this.level.debug_draw();
        }

        setTimeout(this.on_tick.bind(this), 1000 / 60);
    }

    private on_win(e:createjs.Event):void
    {
        this.load_level(this.curr_level + 1);
    }

    private on_fail(e:createjs.Event):void
    {
        this.load_level(this.curr_level);
    }
}

var m = new Main(<HTMLCanvasElement>document.getElementById("c"));
