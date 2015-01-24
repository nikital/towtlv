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
var Body = (function () {
    function Body() {
        this.container = new createjs.Container();
    }
    Body.prototype.on_tick = function () {
    };
    return Body;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Box = (function (_super) {
    __extends(Box, _super);
    function Box(world, name, position, angle) {
        if (angle === void 0) { angle = 0; }
        _super.call(this);
        this.world = world;
        var prop = Props[name];
        this.kill_ortho = prop.kill_ortho;
        this.bitmap = new createjs.Bitmap(Preload.get_bitmap(prop.bitmap_path));
        var half_width = this.bitmap.getBounds().width / 2;
        var half_height = this.bitmap.getBounds().height / 2;
        this.bitmap.regX = half_width;
        this.bitmap.regY = half_height;
        if (1 || !prop.bitmap_path.match(/^editor_/)) {
            this.container.addChild(this.bitmap);
        }
        else {
            this.bitmap = null;
        }
        position = position.Copy();
        position.Multiply(1 / g_common.pixel_scale);
        var body_def = new b2BodyDef();
        body_def.type = prop.dynamic ? b2Body.b2_dynamicBody : b2Body.b2_staticBody;
        body_def.position = position;
        body_def.angle = angle;
        body_def.linearDamping = 3;
        body_def.angularDamping = 2;
        var fix_def = new b2FixtureDef();
        if (prop.circular) {
            fix_def.shape = new b2CircleShape((half_width - 2) / g_common.pixel_scale);
        }
        else {
            var poly = new b2PolygonShape();
            poly.SetAsBox((half_width - 2) / g_common.pixel_scale, (half_height - 2) / g_common.pixel_scale);
            fix_def.shape = poly;
        }
        fix_def.density = prop.density;
        this.body = this.world.CreateBody(body_def);
        this.body.CreateFixture(fix_def);
    }
    Box.prototype.on_tick = function () {
        if (this.kill_ortho) {
            var localPoint = new b2Vec2(0, 0);
            var velocity = this.body.GetLinearVelocityFromLocalPoint(localPoint);
            var sidewaysAxis = this.body.GetTransform().R.col2.Copy();
            sidewaysAxis.Multiply(b2Math.Dot(velocity, sidewaysAxis));
            this.body.SetLinearVelocity(sidewaysAxis);
            this.body.SetAngularVelocity(0);
        }
        if (this.bitmap) {
            g_common.align_sprite_to_phys(this.bitmap, this.body);
        }
    };
    return Box;
})(Body);
var TowSound;
(function (TowSound) {
    TowSound[TowSound["None"] = 0] = "None";
    TowSound[TowSound["WithGas"] = 1] = "WithGas";
    TowSound[TowSound["NoGas"] = 2] = "NoGas";
})(TowSound || (TowSound = {}));
var Tow_truck = (function (_super) {
    __extends(Tow_truck, _super);
    function Tow_truck(world, position) {
        _super.call(this);
        this.world = world;
        this.all_wheels = [];
        this.arm_speed = 3;
        this.turning_speed = 10;
        this.motor_force = 300;
        this.arm_half_len = 2.2;
        this.tow_sound = 0 /* None */;
        position = position.Copy();
        position.Multiply(1 / g_common.pixel_scale);
        this.create_body(position);
        this.create_wheels();
        this.create_arm();
        this.create_graphics();
    }
    Tow_truck.prototype.create_body = function (position) {
        var body_def = new b2BodyDef();
        body_def.type = b2Body.b2_dynamicBody;
        body_def.position = position;
        body_def.linearDamping = 1;
        body_def.angularDamping = 1;
        var fix_def = new b2FixtureDef();
        var poly = new b2PolygonShape();
        poly.SetAsBox(1.5, 3.5);
        fix_def.shape = poly;
        fix_def.density = 1;
        this.body = this.world.CreateBody(body_def);
        this.body.CreateFixture(fix_def);
    };
    Tow_truck.prototype.create_wheels = function () {
        var wheel_offset = new b2Vec2(1.2, 2.7);
        var body_def = new b2BodyDef();
        body_def.type = b2Body.b2_dynamicBody;
        body_def.linearDamping = 1;
        body_def.angularDamping = 1;
        var fix_def = new b2FixtureDef();
        var poly = new b2PolygonShape();
        poly.SetAsBox(0.15, 0.4);
        fix_def.shape = poly;
        fix_def.density = 20;
        body_def.position = this.body.GetPosition().Copy();
        body_def.position.Add(new b2Vec2(wheel_offset.x, -wheel_offset.y));
        var right_front = this.world.CreateBody(body_def);
        right_front.CreateFixture(fix_def);
        body_def.position = this.body.GetPosition().Copy();
        body_def.position.Add(new b2Vec2(-wheel_offset.x, -wheel_offset.y));
        var left_front = this.world.CreateBody(body_def);
        left_front.CreateFixture(fix_def);
        body_def.position = this.body.GetPosition().Copy();
        body_def.position.Add(new b2Vec2(wheel_offset.x, wheel_offset.y));
        var right_rear = this.world.CreateBody(body_def);
        right_rear.CreateFixture(fix_def);
        body_def.position = this.body.GetPosition().Copy();
        body_def.position.Add(new b2Vec2(-wheel_offset.x, wheel_offset.y));
        var left_rear = this.world.CreateBody(body_def);
        left_rear.CreateFixture(fix_def);
        var revolute_def = new b2RevoluteJointDef();
        revolute_def.enableMotor = true;
        revolute_def.motorSpeed = this.turning_speed;
        revolute_def.maxMotorTorque = 1000;
        revolute_def.enableLimit = true;
        revolute_def.upperAngle = 0.8;
        revolute_def.lowerAngle = -revolute_def.upperAngle;
        revolute_def.Initialize(this.body, right_front, right_front.GetWorldCenter());
        this.right_joint = this.world.CreateJoint(revolute_def);
        revolute_def.Initialize(this.body, left_front, left_front.GetWorldCenter());
        this.left_joint = this.world.CreateJoint(revolute_def);
        var prismatic_def = new b2PrismaticJointDef();
        prismatic_def.enableLimit = true;
        prismatic_def.lowerTranslation = prismatic_def.upperTranslation = 0;
        prismatic_def.Initialize(this.body, right_rear, right_rear.GetWorldCenter(), new b2Vec2(0, 1));
        this.world.CreateJoint(prismatic_def);
        prismatic_def.Initialize(this.body, left_rear, left_rear.GetWorldCenter(), new b2Vec2(0, 1));
        this.world.CreateJoint(prismatic_def);
        this.right = right_front;
        this.left = left_front;
        this.all_wheels.push(right_front);
        this.all_wheels.push(left_front);
        this.all_wheels.push(right_rear);
        this.all_wheels.push(left_rear);
    };
    Tow_truck.prototype.create_arm = function () {
        var offset = new b2Vec2(0, 1 + this.arm_half_len);
        var body_def = new b2BodyDef();
        body_def.type = b2Body.b2_dynamicBody;
        body_def.position = this.body.GetPosition().Copy();
        body_def.position.Add(offset);
        body_def.angle = this.body.GetTransform().GetAngle();
        var fix_def = new b2FixtureDef();
        var poly = new b2PolygonShape();
        poly.SetAsBox(0.2, this.arm_half_len);
        fix_def.shape = poly;
        fix_def.density = 20;
        fix_def.isSensor = true;
        this.arm = this.world.CreateBody(body_def);
        this.arm.CreateFixture(fix_def);
        var revolute_def = new b2RevoluteJointDef();
        revolute_def.enableMotor = true;
        revolute_def.maxMotorTorque = 100;
        revolute_def.enableLimit = true;
        revolute_def.upperAngle = 0.3;
        revolute_def.lowerAngle = -revolute_def.upperAngle;
        revolute_def.Initialize(this.body, this.arm, this.arm.GetWorldPoint(new b2Vec2(0, -this.arm_half_len)));
        this.arm_joint = this.world.CreateJoint(revolute_def);
    };
    Tow_truck.prototype.create_graphics = function () {
        this.bitmap_body = new createjs.Bitmap(Preload.get_bitmap('tow_body'));
        this.bitmap_body.regX = this.bitmap_body.getBounds().width / 2;
        this.bitmap_body.regY = this.bitmap_body.getBounds().height / 2;
        this.container.addChild(this.bitmap_body);
        this.bitmap_arm = new createjs.Bitmap(Preload.get_bitmap('tow_arm'));
        this.bitmap_arm.regX = this.bitmap_arm.getBounds().width / 2;
        this.bitmap_arm.regY = this.bitmap_arm.getBounds().height / 2;
        this.container.addChild(this.bitmap_arm);
    };
    Tow_truck.prototype.play_sound = function (sound_to_play) {
        if (sound_to_play == this.tow_sound) {
            return;
        }
        if (this.curr_rumble) {
            this.curr_rumble.stop();
            this.curr_rumble = null;
        }
        if (sound_to_play == 1 /* WithGas */) {
            this.curr_rumble = createjs.Sound.play(Preload.get_sound("tow_velocity"), { loop: -1 });
        }
        else if (sound_to_play == 2 /* NoGas */) {
            this.curr_rumble = createjs.Sound.play(Preload.get_sound("tow_no_velocity"), { loop: -1 });
        }
        this.tow_sound = sound_to_play;
    };
    Tow_truck.prototype.on_tick = function () {
        var to_center = 0;
        var has_velocity = g_input.forward || g_input.backwards;
        var sound_to_play = has_velocity ? 1 /* WithGas */ : 2 /* NoGas */;
        this.play_sound(sound_to_play);
        if (has_velocity) {
            var multiplier = this.motor_force * (g_input.forward ? -1 : 1);
            var vec = this.right.GetTransform().R.col2.Copy();
            vec.Multiply(multiplier);
            this.right.ApplyForce(vec, this.right.GetPosition());
            vec = this.left.GetTransform().R.col2.Copy();
            vec.Multiply(multiplier);
            this.left.ApplyForce(vec, this.left.GetPosition());
        }
        if (g_input.right == g_input.left) {
            to_center = -this.right_joint.GetJointAngle();
            this.right_joint.SetMotorSpeed(to_center * this.turning_speed);
            to_center = -this.left_joint.GetJointAngle();
            this.left_joint.SetMotorSpeed(to_center * this.turning_speed);
        }
        else if (g_input.right) {
            this.right_joint.SetMotorSpeed(this.turning_speed);
            this.left_joint.SetMotorSpeed(this.turning_speed);
        }
        else if (g_input.left) {
            this.right_joint.SetMotorSpeed(-this.turning_speed);
            this.left_joint.SetMotorSpeed(-this.turning_speed);
        }
        to_center = -this.arm_joint.GetJointAngle();
        this.arm_joint.SetMotorSpeed(to_center * this.arm_speed);
        for (var i = 0; i < this.all_wheels.length; ++i) {
            var wheel = this.all_wheels[i];
            var localPoint = new b2Vec2(0, 0);
            var velocity = wheel.GetLinearVelocityFromLocalPoint(localPoint);
            var sidewaysAxis = wheel.GetTransform().R.col2.Copy();
            sidewaysAxis.Multiply(b2Math.Dot(velocity, sidewaysAxis));
            wheel.SetLinearVelocity(sidewaysAxis);
        }
        g_common.align_sprite_to_phys(this.bitmap_body, this.body);
        g_common.align_sprite_to_phys(this.bitmap_arm, this.arm);
    };
    Tow_truck.prototype.tow = function (towed) {
        var contact_point = this.arm.GetWorldPoint(new b2Vec2(0, this.arm_half_len));
        var revolute_def = new b2RevoluteJointDef();
        revolute_def.Initialize(this.arm, towed.body, contact_point);
        this.tow_joint = this.world.CreateJoint(revolute_def);
    };
    Tow_truck.prototype.stop_tow = function () {
        if (this.tow_joint) {
            this.world.DestroyJoint(this.tow_joint);
            this.tow_joint = null;
        }
    };
    Tow_truck.prototype.can_tow = function (towed) {
        if (this.is_towing()) {
            return false;
        }
        var contact_point = this.arm.GetWorldPoint(new b2Vec2(0, this.arm_half_len));
        var colliding = false;
        var fixture = towed.body.GetFixtureList();
        for (var fixture = towed.body.GetFixtureList(); fixture; fixture = fixture.GetNext()) {
            if (fixture.TestPoint(contact_point)) {
                colliding = true;
                break;
            }
        }
        return colliding;
    };
    Tow_truck.prototype.is_towing = function () {
        return this.tow_joint != null;
    };
    return Tow_truck;
})(Body);
/// <reference path="body.ts" />
/// <reference path="preload.ts" />
/// <reference path="box.ts" />
/// <reference path="tow_truck.ts" />
var Level = (function (_super) {
    __extends(Level, _super);
    function Level(level_id, debug_draw) {
        _super.call(this);
        this.debug_draw = debug_draw;
        this.prev_frame_time = new Date().getTime();
        this.ticked = [];
        this.failed = false;
        this.sent_win = false;
        this.init_phys();
        var data = g_levels[level_id];
        var bg = new createjs.Bitmap(Preload.get_bitmap(data.background));
        this.addChild(bg);
        for (var i = 0; i < data.props.length; ++i) {
            var prop_data = data.props[i];
            if (prop_data.prop === 'tow') {
                this.tow_truck = new Tow_truck(this.world, new b2Vec2(prop_data.x, prop_data.y));
                this.ticked.push(this.tow_truck);
            }
            else {
                var box = new Box(this.world, prop_data.prop, new b2Vec2(prop_data.x, prop_data.y), prop_data.rotation / 180 * Math.PI);
                this.addChild(box.container);
                this.ticked.push(box);
                if (prop_data.prop === 'target') {
                    this.towed = box;
                }
            }
        }
        this.addChild(this.tow_truck.container);
        this.tow_status = new createjs.Bitmap(Preload.get_bitmap("ui/tow_up"));
        this.tow_status.x = this.tow_status.y = 20;
        this.addChild(this.tow_status);
    }
    Level.prototype.init_phys = function () {
        var gravity = new b2Vec2(0, 0);
        this.world = new b2World(gravity, true);
        this.world.SetContactListener(this);
        this.world.SetDebugDraw(this.debug_draw);
    };
    Level.prototype.on_tick = function () {
        var now = new Date().getTime();
        var dt = now - this.prev_frame_time;
        this.prev_frame_time = now;
        if (g_input.tow) {
            g_input.tow = false;
            if (this.tow_truck.is_towing()) {
                this.tow_truck.stop_tow();
                this.tow_status.image = Preload.get_bitmap("ui/tow_up");
            }
            else if (this.tow_truck.can_tow(this.towed)) {
                this.tow_truck.tow(this.towed);
                this.tow_status.image = Preload.get_bitmap("ui/tow_down");
            }
        }
        for (var i = 0; i < this.ticked.length; ++i) {
            this.ticked[i].on_tick();
        }
        this.world.Step(dt / 1000, 6, 3);
        this.world.ClearForces();
        if (!this.failed && !this.sent_win) {
            var b = this.towed.container.getTransformedBounds();
            if ((b.y > g_common.canvas.height) || (b.y < -b.height) || (b.x > g_common.canvas.width) || (b.x < -b.width)) {
                this.dispatchEvent(new createjs.Event('win', false, false));
                createjs.Sound.stop();
                this.sent_win = true;
            }
            if (!this.sent_win && !this.tow_truck.is_towing()) {
                b = this.tow_truck.container.getTransformedBounds();
                if ((b.y > g_common.canvas.height + 100) || (b.y < -b.height - 100) || (b.x > g_common.canvas.width + 100) || (b.x < -b.width - 100)) {
                    this.dispatchEvent(new createjs.Event('fail', false, false));
                    createjs.Sound.stop();
                    this.failed = true;
                }
            }
        }
    };
    Level.prototype.draw_debug = function () {
        this.world.DrawDebugData();
    };
    Level.prototype.fail = function () {
        this.dispatchEvent(new createjs.Event('fail', false, false));
        createjs.Sound.stop();
    };
    Level.prototype.BeginContact = function (contact) {
    };
    Level.prototype.EndContact = function (contact) {
    };
    Level.prototype.PreSolve = function (contact, oldManifold) {
    };
    Level.prototype.PostSolve = function (contact, impulse) {
        var body_a = contact.GetFixtureA().GetBody();
        var body_b = contact.GetFixtureB().GetBody();
        var normal_impulse = 0;
        if (body_a == this.towed.body || body_b == this.towed.body) {
            normal_impulse = impulse.normalImpulses[0];
            if (this.tow_truck.is_towing() && (body_a == this.tow_truck.body || body_b == this.tow_truck.body)) {
                normal_impulse = 0;
            }
        }
        if (normal_impulse > 2) {
            if (!this.failed) {
                this.failed = true;
                setTimeout(this.fail.bind(this), 1000);
            }
        }
    };
    return Level;
})(createjs.Container);
/// <reference path="box2d_imports.ts" />
/// <reference path="defs/easeljs/easeljs.d.ts" />
/// <reference path="defs/tweenjs/tweenjs.d.ts" />
/// <reference path="defs/generated.d.ts" />
/// <reference path="common.ts" />
/// <reference path="input.ts" />
/// <reference path="preload.ts" />
/// <reference path="props.ts" />
/// <reference path="level.ts" />
/// <reference path="defs/soundjs/soundjs.d.ts"/>
var Main = (function () {
    function Main(canvas) {
        this.canvas = canvas;
        this.debug_draw = new b2DebugDraw();
        this.curr_level = 0;
        g_common = new Common();
        g_common.canvas = canvas;
        g_input = new Input();
        this.stage = new createjs.Stage(canvas);
        this.cloak = new createjs.Shape();
        this.cloak.graphics.beginFill('black').drawRect(0, 0, canvas.width, canvas.height);
        this.stage.addChild(this.cloak);
        this.loading = new createjs.Text("Loading...", "20px Arial", "white");
        this.loading.x = this.loading.y = 10;
        this.stage.addChild(this.loading);
        this.debug_draw.SetSprite(canvas.getContext("2d"));
        this.debug_draw.SetDrawScale(g_common.pixel_scale);
        this.debug_draw.SetFillAlpha(0.5);
        this.debug_draw.SetLineThickness(1.0);
        this.debug_draw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        createjs.Sound.alternateExtensions = ["mp3"];
        Preload.queue.installPlugin(createjs.Sound);
        Preload.queue.on("complete", this.on_preload, this);
        Preload.queue.loadManifest(preload_manifest);
        this.on_tick();
    }
    Main.prototype.on_preload = function () {
        this.stage.removeChild(this.loading);
        this.loading = null;
        this.do_transition(function () {
        });
        this.load_level(0);
    };
    Main.prototype.load_level = function (level) {
        this.curr_level = level;
        if (this.level) {
            this.stage.removeChild(this.level);
        }
        this.level = new Level(this.curr_level, this.debug_draw);
        this.level.on('fail', this.on_fail, this);
        this.level.on('win', this.on_win, this);
        this.stage.addChildAt(this.level, 0);
        createjs.Sound.setVolume(0.3);
        console.log('Loaded level', level);
    };
    Main.prototype.on_tick = function () {
        if (this.level) {
            this.level.on_tick();
        }
        this.stage.update();
        if (this.level) {
        }
        setTimeout(this.on_tick.bind(this), 1000 / 60);
    };
    Main.prototype.on_win = function (e) {
        var _this = this;
        this.do_transition(function () {
            _this.load_level(_this.curr_level + 1);
        });
    };
    Main.prototype.on_fail = function (e) {
        var _this = this;
        this.do_transition(function () {
            _this.load_level(_this.curr_level);
        });
    };
    Main.prototype.do_transition = function (callback) {
        this.stage.addChild(this.cloak);
        createjs.Tween.get(this.cloak).to({ alpha: 1 }, 300).call(callback).to({ alpha: 0 }, 200);
    };
    return Main;
})();
var m = new Main(document.getElementById("c"));
