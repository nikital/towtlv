/// <reference path="box2d_imports.ts" />
/// <reference path="defs/easeljs/easeljs.d.ts" />
/// <reference path="defs/generated.d.ts" />
/// <reference path="input.ts" />
/// <reference path="common.ts" />
/// <reference path="preload.ts" />
/// <reference path="props.ts" />

interface LevelProp
{
    bitmap:createjs.Bitmap;
    prop:Prop;
    name:string;
}

enum Modal
{
    None,
    Grab,
    Rotate,
}

class Editor
{
    private stage:createjs.Stage;
    private props:LevelProp[] = [];
    private active_prop:LevelProp;
    private active_filter:createjs.ColorFilter = new createjs.ColorFilter(1, 1, 0.5, 1, 50, 15, 0, 0);

    private background_path = "bg/plain";
    private background:createjs.Bitmap;

    private modal = Modal.None;

    constructor(private canvas:HTMLCanvasElement)
    {
        this.stage = new createjs.Stage(canvas);
        this.stage.enableMouseOver();

        Preload.queue.on("complete", this.on_preload, this);
        Preload.queue.loadManifest(preload_manifest);
    }

    private on_preload():void
    {
        this.prepare_props();

        this.background = new createjs.Bitmap(Preload.get_bitmap(this.background_path));
        this.stage.addChild(this.background);

        this.stage.on('stagemousemove', this.on_mouse_move, this);
        this.stage.on('stagemouseup', this.on_mouse_click, this);

        document.onkeyup = this.on_key.bind(this);
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
        var name = (<HTMLButtonElement>e.target).innerText;
        var prop = Props[name];
        console.log((<HTMLButtonElement>e.target).innerText);

        var bitmap = new createjs.Bitmap(Preload.get_bitmap(prop.bitmap_path));
        bitmap.regX = bitmap.getBounds().width / 2;
        bitmap.regY = bitmap.getBounds().height / 2;
        bitmap.x = this.canvas.width / 2;
        bitmap.y = this.canvas.height / 2;
        this.stage.addChild(bitmap);

        bitmap.on('click', this.on_click, this);

        this.props.push({bitmap:bitmap, prop:prop, name: name});

        var simulated = new createjs.MouseEvent('click', false, true, 0, 0, null, 0, true, 0, 0);
        bitmap.dispatchEvent(simulated);
        this.modal = Modal.Grab;
    }

    private on_click(e:createjs.MouseEvent):void
    {
        if (this.active_prop)
        {
            this.active_prop.bitmap.filters = [];
            var b2 = this.active_prop.bitmap.getBounds();
            this.active_prop.bitmap.cache(b2.x, b2.y, b2.width, b2.height);
        }
        var prop = this.level_prop_from_mouse(e);
        prop.bitmap.filters = [this.active_filter];
        var b = prop.bitmap.getBounds();
        prop.bitmap.cache(b.x, b.y, b.width, b.height);

        this.active_prop = prop;

        e.stopPropagation();
    }

    private level_prop_from_mouse(e:createjs.MouseEvent):LevelProp
    {
        for (var i = 0; i < this.props.length; ++i)
        {
            if (e.target == this.props[i].bitmap)
            {
                return this.props[i];
            }
        }
    }

    private on_mouse_move(e:createjs.MouseEvent):void
    {
        if (this.modal == Modal.Grab)
        {
            this.active_prop.bitmap.x = e.stageX;
            this.active_prop.bitmap.y = e.stageY;
        }
        else if (this.modal == Modal.Rotate)
        {
            var rad = Math.atan2(e.stageY - this.active_prop.bitmap.y, e.stageX - this.active_prop.bitmap.x);
            this.active_prop.bitmap.rotation = rad / Math.PI * 180;
        }
    }

    private on_mouse_click(e:createjs.MouseEvent):void
    {
        if (this.modal != Modal.None)
        {
            this.modal = Modal.None;
        }
    }

    private on_key(e:KeyboardEvent):void
    {
        switch (e.which)
        {
            case 'G'.charCodeAt(0):
                if (this.active_prop)
                {
                    this.modal = Modal.Grab;
                }
                break;
            case 'R'.charCodeAt(0):
                if (this.active_prop && this.active_prop.name !== 'tow')
                {
                    this.modal = Modal.Rotate;
                }
                break;
            case 'D'.charCodeAt(0):
                if (this.active_prop)
                {
                    var bitmap = this.active_prop.bitmap.clone();
                    this.stage.addChild(bitmap);
                    bitmap.on('click', this.on_click, this);

                    this.props.push({bitmap:bitmap, prop:this.active_prop.prop, name: this.active_prop.name});

                    var simulated = new createjs.MouseEvent('click', false, true, 0, 0, null, 0, true, 0, 0);
                    bitmap.dispatchEvent(simulated);
                    this.modal = Modal.Grab;
                }
                break;
            case 'X'.charCodeAt(0):
                if (this.active_prop)
                {
                    this.stage.removeChild(this.active_prop.bitmap);
                    var i = this.props.indexOf(this.active_prop);
                    this.props.splice(i, 1);
                    this.active_prop = null;
                    this.modal = Modal.None;
                }
                break;
            case 'E'.charCodeAt(0):
                this.export_level();
                break;
            case 'I'.charCodeAt(0):
                this.import_level(JSON.parse((<HTMLTextAreaElement>document.getElementById("level")).value));
                break;
            case 'L'.charCodeAt(0):
                var to_load = parseInt(prompt('Level:'))
                console.log('Loading', to_load);
                this.import_level(g_levels[to_load]);
                break;
            case 'B'.charCodeAt(0):
                this.background_path = prompt('Background:', 'bg/plain');
                this.background.image = Preload.get_bitmap(this.background_path);
                break;
            default:
                return;
        }

        e.preventDefault();
    }

    private export_level():void
    {
        var data:LevelData = {
            background: this.background_path,
            props: [
            ],
        }

        for (var i = 0; i < this.props.length; ++i)
        {
            var prop = this.props[i];
            data.props.push({prop:prop.name, x:prop.bitmap.x, y:prop.bitmap.y, rotation:Math.floor(prop.bitmap.rotation)});
        }

        (<HTMLTextAreaElement>document.getElementById("level")).value = JSON.stringify(data);
    }

    private import_level(data:any):void
    {
        this.stage.removeAllChildren();
        this.props = [];
        this.active_prop = null;
        this.modal = Modal.None;

        this.background_path = data.background;
        this.background.image = Preload.get_bitmap(data.background);
        this.stage.addChild(this.background);

        for (var i = 0; i < data.props.length; ++i)
        {
            var name = data.props[i].prop;
            var prop = Props[name];

            var bitmap = new createjs.Bitmap(Preload.get_bitmap(prop.bitmap_path));
            bitmap.regX = bitmap.getBounds().width / 2;
            bitmap.regY = bitmap.getBounds().height / 2;
            bitmap.x = data.props[i].x;
            bitmap.y = data.props[i].y;
            bitmap.rotation = data.props[i].rotation;
            this.stage.addChild(bitmap);

            bitmap.on('click', this.on_click, this);

            this.props.push({bitmap:bitmap, prop:prop, name: name});
        }
        (<HTMLTextAreaElement>document.getElementById("level")).value = '';
    }
}

var e = new Editor(<HTMLCanvasElement>document.getElementById("c"));
