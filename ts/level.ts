/// <reference path="body.ts" />
/// <reference path="box.ts" />
/// <reference path="tow_truck.ts" />

class Level extends createjs.Container implements b2ContactListener
{
    private world:b2World;
    private tow_truck:Tow_truck;
    private towed:Box;

    private ticked:Body[] = [];

    private failed = false;

    constructor(level_id:number, private debug_draw:b2DebugDraw)
    {
        super();

        this.init_phys();

        var data = g_levels[level_id];

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
        if (g_input.tow)
        {
            g_input.tow = false;
            if (this.tow_truck.is_towing())
            {
                this.tow_truck.stop_tow();
            }
            else if (this.tow_truck.can_tow(this.towed))
            {
                this.tow_truck.tow(this.towed);
            }
        }

        for (var i = 0; i < this.ticked.length; ++i)
        {
            this.ticked[i].on_tick();
        }

        this.world.Step(1/60, 6, 3);
        this.world.ClearForces();
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
