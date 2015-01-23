/// <reference path="box2d_imports.ts" />
/// <reference path="defs/easeljs/easeljs.d.ts" />
/// <reference path="defs/generated.d.ts" />
/// <reference path="input.ts" />
/// <reference path="common.ts" />
/// <reference path="preload.ts" />
/// <reference path="props.ts" />

class Editor
{
    private stage:createjs.Stage;

    constructor(private canvas:HTMLCanvasElement)
    {
        this.stage = new createjs.Stage(canvas);

        Preload.queue.on("complete", this.on_preload, this);
        Preload.queue.loadManifest(preload_manifest);
    }

    private on_preload():void
    {
        this.prepare_props();

        this.on_tick();
    }

    private prepare_props():void
    {
        var props_div = document.getElementById("props");
        for (var p in Props)
        {
            var btn = <HTMLButtonElement>document.createElement("button");
            btn.innerText = p;
            props_div.appendChild(btn);
            btn.onclick = this.add_prop.bind(this);
        }
    }

    private on_tick():void
    {
        this.stage.update();

        setTimeout(this.on_tick.bind(this), 1000 / 60);
    }

    private add_prop(e:MouseEvent):void
    {
        var prop = Props[(<HTMLButtonElement>e.target).innerText];
        console.log((<HTMLButtonElement>e.target).innerText);

        var bitmap = new createjs.Bitmap(Preload.get_bitmap(prop.bitmap_path));
        bitmap.regX = bitmap.getBounds().width / 2;
        bitmap.regY = bitmap.getBounds().height / 2;
        bitmap.x = this.canvas.width / 2;
        bitmap.y = this.canvas.height / 2;
        this.stage.addChild(bitmap);
    }
}

var e = new Editor(<HTMLCanvasElement>document.getElementById("c"));
