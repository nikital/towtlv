/// <reference path="defs/box2d.d.ts" />
var b2Math = Box2D.Common.Math.b2Math;
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2World = Box2D.Dynamics.b2World;
var b2Body = Box2D.Dynamics.b2Body;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
var b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var Input = (function () {
    function Input() {
        this.forward = false;
        this.backwards = false;
        this.right = false;
        this.left = false;
        this.tow = false;
        document.onkeydown = this.on_down.bind(this);
        document.onkeyup = this.on_up.bind(this);
    }
    Input.prototype.on_down = function (e) {
        switch (e.which) {
            case 37:
                this.left = true;
                break;
            case 38:
                this.forward = true;
                break;
            case 39:
                this.right = true;
                break;
            case 40:
                this.backwards = true;
                break;
            case 32:
                this.tow = true;
                break;
            default:
                return;
        }
        e.preventDefault();
    };
    Input.prototype.on_up = function (e) {
        switch (e.which) {
            case 37:
                this.left = false;
                break;
            case 38:
                this.forward = false;
                break;
            case 39:
                this.right = false;
                break;
            case 40:
                this.backwards = false;
                break;
            case 32:
                this.tow = false;
                break;
            default:
                return;
        }
        e.preventDefault();
    };
    return Input;
})();
var g_input;
var Common = (function () {
    function Common() {
        this.pixel_scale = 30;
    }
    Common.prototype.align_sprite_to_phys = function (sprite, body) {
        sprite.rotation = body.GetAngle() / Math.PI * 180;
        var pos = body.GetPosition();
        sprite.x = pos.x * this.pixel_scale;
        sprite.y = pos.y * this.pixel_scale;
    };
    return Common;
})();
var g_common;
/// <reference path="defs/preloadjs/preloadjs.d.ts" />
var Preload = (function () {
    function Preload() {
    }
    Preload.get_bitmap = function (name) {
        return Preload.queue.getResult('assets/' + name + '.png');
    };
    Preload.queue = new createjs.LoadQueue();
    return Preload;
})();
var Props = {
    box: {
        bitmap_path: 'box',
        density: 0.3,
        dynamic: true,
        kill_ortho: false,
    },
    car: {
        bitmap_path: 'car',
        density: 2,
        dynamic: true,
        kill_ortho: true,
    },
};
/// <reference path="box2d_imports.ts" />
/// <reference path="defs/easeljs/easeljs.d.ts" />
/// <reference path="defs/generated.d.ts" />
/// <reference path="input.ts" />
/// <reference path="common.ts" />
/// <reference path="preload.ts" />
/// <reference path="props.ts" />
var Editor = (function () {
    function Editor(canvas) {
        this.canvas = canvas;
        this.stage = new createjs.Stage(canvas);
        Preload.queue.on("complete", this.on_preload, this);
        Preload.queue.loadManifest(preload_manifest);
    }
    Editor.prototype.on_preload = function () {
        this.prepare_props();
        this.on_tick();
    };
    Editor.prototype.prepare_props = function () {
        var props_div = document.getElementById("props");
        for (var p in Props) {
            var btn = document.createElement("button");
            btn.innerText = p;
            props_div.appendChild(btn);
            btn.onclick = this.add_prop.bind(this);
        }
    };
    Editor.prototype.on_tick = function () {
        this.stage.update();
        setTimeout(this.on_tick.bind(this), 1000 / 60);
    };
    Editor.prototype.add_prop = function (e) {
        var prop = Props[e.target.innerText];
        console.log(e.target.innerText);
        var bitmap = new createjs.Bitmap(Preload.get_bitmap(prop.bitmap_path));
        bitmap.regX = bitmap.getBounds().width / 2;
        bitmap.regY = bitmap.getBounds().height / 2;
        bitmap.x = this.canvas.width / 2;
        bitmap.y = this.canvas.height / 2;
        this.stage.addChild(bitmap);
    };
    return Editor;
})();
var e = new Editor(document.getElementById("c"));
