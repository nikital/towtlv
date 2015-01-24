/// <reference path="body.ts" />
/// <reference path="preload.ts" />
/// <reference path="box.ts" />
/// <reference path="tow_truck.ts" />

class Level extends createjs.Container implements b2ContactListener
{
    private world:b2World;
    private prev_frame_time:number = new Date().getTime();
    private tow_truck:Tow_truck;
    private towed:Box;

    private ticked:Body[] = [];

    private tow_status:createjs.Bitmap;

    private failed = false;
    private sent_win = false;

    constructor(level_id:number, private debug_draw:b2DebugDraw)
    {
        super();

        this.init_phys();

        var data = g_levels[level_id];

        var bg = new createjs.Bitmap(Preload.get_bitmap(data.background));
        this.addChild(bg);

        for (var i = 0; i < data.props.length; ++i)
        {
            var prop_data = data.props[i];

            if (prop_data.prop === 'tow')
            {
                this.tow_truck = new Tow_truck(this.world, new b2Vec2(prop_data.x, prop_data.y));
                this.ticked.push(this.tow_truck);
            }
            else
            {
                var box = new Box(this.world, prop_data.prop, new b2Vec2(prop_data.x, prop_data.y), prop_data.rotation / 180 * Math.PI);
                this.addChild(box.container);
                this.ticked.push(box);

                if (prop_data.prop === 'target')
                {
                    this.towed = box;
                }
            }
        }

        this.addChild(this.tow_truck.container);

        this.tow_status = new createjs.Bitmap(Preload.get_bitmap("ui/tow_up"));
        this.tow_status.x = this.tow_status.y = 20;
        this.addChild(this.tow_status);
    }

    private init_phys():void
    {
        var gravity = new b2Vec2(0, 0);
        this.world = new b2World(gravity, true);
        this.world.SetContactListener(this);

        this.world.SetDebugDraw(this.debug_draw);
    }

    public on_tick():void
    {
        var now = new Date().getTime();
        var dt = now - this.prev_frame_time;
        this.prev_frame_time = now;

        if (g_input.tow)
        {
            g_input.tow = false;

            if (this.tow_truck.is_towing())
            {
                this.tow_truck.stop_tow();
                this.tow_status.image = Preload.get_bitmap("ui/tow_up");
            }
            else if (this.tow_truck.can_tow(this.towed))
            {
                this.tow_truck.tow(this.towed);
                this.tow_status.image = Preload.get_bitmap("ui/tow_down");
            }
        }

        for (var i = 0; i < this.ticked.length; ++i)
        {
            this.ticked[i].on_tick();
        }

        this.world.Step(dt/1000, 6, 3);
        this.world.ClearForces();

        if (!this.failed && !this.sent_win)
        {
            var b = this.towed.container.getTransformedBounds();
            if ((b.y > g_common.canvas.height)
               ||( b.y < -b.height)
               || (b.x > g_common.canvas.width)
               || (b.x < -b.width))
            {
                this.dispatchEvent(new createjs.Event('win', false, false));
                this.sent_win = true;
            }

            if (!this.sent_win && !this.tow_truck.is_towing())
            {
                b = this.tow_truck.container.getTransformedBounds();
                if ((b.y > g_common.canvas.height + 100)
                    ||( b.y < -b.height - 100)
                    || (b.x > g_common.canvas.width + 100)
                    || (b.x < -b.width - 100))
                {
                    this.dispatchEvent(new createjs.Event('fail', false, false));
                    this.failed = true;
                }
            }
        }
    }

    public draw_debug():void
    {
        this.world.DrawDebugData();
    }

    private fail():void
    {
        this.dispatchEvent(new createjs.Event('fail', false, false));
    }

    public BeginContact(contact: b2Contact): void
    {
    }
    public EndContact(contact: b2Contact): void
    {
    }
    public PreSolve(contact: b2Contact, oldManifold: Box2D.Collision.b2Manifold): void
    {
    }
    public PostSolve(contact: b2Contact, impulse: b2ContactImpulse): void
    {
        var body_a = contact.GetFixtureA().GetBody();
        var body_b = contact.GetFixtureB().GetBody();

        var normal_impulse = 0;
        if (body_a == this.towed.body || body_b == this.towed.body)
        {
            normal_impulse = impulse.normalImpulses[0];
            if (this.tow_truck.is_towing() && (body_a == this.tow_truck.body || body_b == this.tow_truck.body))
            {
                normal_impulse = 0;
            }
        }

        if (normal_impulse > 2)
        {
            if (!this.failed)
            {
                this.failed = true;
                setTimeout(this.fail.bind(this), 1000);
            }
        }
    }
}
