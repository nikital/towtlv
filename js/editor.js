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
var b2ContactListener = Box2D.Dynamics.b2ContactListener;
var b2Contact = Box2D.Dynamics.Contacts.b2Contact;
var b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
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
    Preload.get_sound = function (name) {
        return 'assets/' + name + '.mp3';
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
        circular: false,
    },
    car: {
        bitmap_path: 'car',
        density: 1.5,
        dynamic: true,
        kill_ortho: true,
        circular: false,
    },
    target: {
        bitmap_path: 'target',
        density: 1,
        dynamic: true,
        kill_ortho: true,
        circular: false,
    },
    tow: {
        bitmap_path: 'tow_body',
        density: 0,
        dynamic: true,
        kill_ortho: true,
        circular: false,
    },
    wall: {
        bitmap_path: 'editor_wall',
        density: 0,
        dynamic: false,
        kill_ortho: false,
        circular: false,
    },
    bicycle: {
        bitmap_path: 'bicycle',
        density: 1,
        dynamic: true,
        kill_ortho: true,
        circular: false,
    },
    cafe_table: {
        bitmap_path: 'cafe_table',
        density: 0.7,
        dynamic: true,
        kill_ortho: false,
        circular: true,
    },
    cafe_umbrella: {
        bitmap_path: 'cafe_umbrella',
        density: 0.7,
        dynamic: true,
        kill_ortho: false,
        circular: true,
    },
    chair: {
        bitmap_path: 'chair',
        density: 1,
        dynamic: true,
        kill_ortho: false,
        circular: false,
    },
    garbage: {
        bitmap_path: 'garbage',
        density: 1,
        dynamic: true,
        kill_ortho: false,
        circular: false,
    },
    motorcycle: {
        bitmap_path: 'motorcycle',
        density: 1,
        dynamic: true,
        kill_ortho: true,
        circular: false,
    },
    cart: {
        bitmap_path: 'cart',
        density: 1,
        dynamic: true,
        kill_ortho: false,
        circular: false,
    },
    stroller: {
        bitmap_path: 'stroller',
        density: 1,
        dynamic: true,
        kill_ortho: false,
        circular: false,
    },
    suitcase: {
        bitmap_path: 'suitcase',
        density: 1,
        dynamic: true,
        kill_ortho: false,
        circular: false,
    },
    trash_can: {
        bitmap_path: 'trash_can',
        density: 1,
        dynamic: true,
        kill_ortho: false,
        circular: true,
    },
};
/// <reference path="box2d_imports.ts" />
/// <reference path="defs/easeljs/easeljs.d.ts" />
/// <reference path="defs/generated.d.ts" />
/// <reference path="input.ts" />
/// <reference path="common.ts" />
/// <reference path="preload.ts" />
/// <reference path="props.ts" />
var Modal;
(function (Modal) {
    Modal[Modal["None"] = 0] = "None";
    Modal[Modal["Grab"] = 1] = "Grab";
    Modal[Modal["Rotate"] = 2] = "Rotate";
})(Modal || (Modal = {}));
var Editor = (function () {
    function Editor(canvas) {
        this.canvas = canvas;
        this.props = [];
        this.active_filter = new createjs.ColorFilter(1, 1, 0.5, 1, 50, 15, 0, 0);
        this.background_path = "bg/plain";
        this.modal = 0 /* None */;
        this.stage = new createjs.Stage(canvas);
        this.stage.enableMouseOver();
        Preload.queue.on("complete", this.on_preload, this);
        Preload.queue.loadManifest(preload_manifest);
    }
    Editor.prototype.on_preload = function () {
        this.prepare_props();
        this.background = new createjs.Bitmap(Preload.get_bitmap(this.background_path));
        this.stage.addChild(this.background);
        this.stage.on('stagemousemove', this.on_mouse_move, this);
        this.stage.on('stagemouseup', this.on_mouse_click, this);
        document.onkeyup = this.on_key.bind(this);
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
        var name = e.target.innerText;
        var prop = Props[name];
        console.log(e.target.innerText);
        var bitmap = new createjs.Bitmap(Preload.get_bitmap(prop.bitmap_path));
        bitmap.regX = bitmap.getBounds().width / 2;
        bitmap.regY = bitmap.getBounds().height / 2;
        bitmap.x = this.canvas.width / 2;
        bitmap.y = this.canvas.height / 2;
        this.stage.addChild(bitmap);
        bitmap.on('click', this.on_click, this);
        this.props.push({ bitmap: bitmap, prop: prop, name: name });
        var simulated = new createjs.MouseEvent('click', false, true, 0, 0, null, 0, true, 0, 0);
        bitmap.dispatchEvent(simulated);
        this.modal = 1 /* Grab */;
    };
    Editor.prototype.on_click = function (e) {
        if (this.active_prop) {
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
    };
    Editor.prototype.level_prop_from_mouse = function (e) {
        for (var i = 0; i < this.props.length; ++i) {
            if (e.target == this.props[i].bitmap) {
                return this.props[i];
            }
        }
    };
    Editor.prototype.on_mouse_move = function (e) {
        if (this.modal == 1 /* Grab */) {
            this.active_prop.bitmap.x = e.stageX;
            this.active_prop.bitmap.y = e.stageY;
        }
        else if (this.modal == 2 /* Rotate */) {
            var rad = Math.atan2(e.stageY - this.active_prop.bitmap.y, e.stageX - this.active_prop.bitmap.x);
            this.active_prop.bitmap.rotation = rad / Math.PI * 180;
        }
    };
    Editor.prototype.on_mouse_click = function (e) {
        if (this.modal != 0 /* None */) {
            this.modal = 0 /* None */;
        }
    };
    Editor.prototype.on_key = function (e) {
        switch (e.which) {
            case 'G'.charCodeAt(0):
                if (this.active_prop) {
                    this.modal = 1 /* Grab */;
                }
                break;
            case 'R'.charCodeAt(0):
                if (this.active_prop && this.active_prop.name !== 'tow') {
                    this.modal = 2 /* Rotate */;
                }
                break;
            case 'D'.charCodeAt(0):
                if (this.active_prop) {
                    var bitmap = this.active_prop.bitmap.clone();
                    this.stage.addChild(bitmap);
                    bitmap.on('click', this.on_click, this);
                    this.props.push({ bitmap: bitmap, prop: this.active_prop.prop, name: this.active_prop.name });
                    var simulated = new createjs.MouseEvent('click', false, true, 0, 0, null, 0, true, 0, 0);
                    bitmap.dispatchEvent(simulated);
                    this.modal = 1 /* Grab */;
                }
                break;
            case 'X'.charCodeAt(0):
                if (this.active_prop) {
                    this.stage.removeChild(this.active_prop.bitmap);
                    var i = this.props.indexOf(this.active_prop);
                    this.props.splice(i, 1);
                    this.active_prop = null;
                    this.modal = 0 /* None */;
                }
                break;
            case 'E'.charCodeAt(0):
                this.export_level();
                break;
            case 'I'.charCodeAt(0):
                this.import_level(JSON.parse(document.getElementById("level").value));
                break;
            case 'L'.charCodeAt(0):
                var to_load = parseInt(prompt('Level:'));
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
    };
    Editor.prototype.export_level = function () {
        var data = {
            background: this.background_path,
            props: [
            ],
        };
        for (var i = 0; i < this.props.length; ++i) {
            var prop = this.props[i];
            data.props.push({ prop: prop.name, x: prop.bitmap.x, y: prop.bitmap.y, rotation: Math.floor(prop.bitmap.rotation) });
        }
        document.getElementById("level").value = JSON.stringify(data);
    };
    Editor.prototype.import_level = function (data) {
        this.stage.removeAllChildren();
        this.props = [];
        this.active_prop = null;
        this.modal = 0 /* None */;
        this.background_path = data.background;
        this.background.image = Preload.get_bitmap(data.background);
        this.stage.addChild(this.background);
        for (var i = 0; i < data.props.length; ++i) {
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
            this.props.push({ bitmap: bitmap, prop: prop, name: name });
        }
        document.getElementById("level").value = '';
    };
    return Editor;
})();
var e = new Editor(document.getElementById("c"));
