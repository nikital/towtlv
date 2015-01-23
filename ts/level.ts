/// <reference path="body.ts" />
/// <reference path="box.ts" />
/// <reference path="tow_truck.ts" />

class Level extends createjs.Container
{
    private world:b2World;
    private tow_truck:Tow_truck;
    private towed:Box;

    private ticked:Body[] = [];

    constructor(private debug_draw:b2DebugDraw)
    {
        super();

        this.init_phys();

        this.tow_truck = new Tow_truck(this.world, new b2Vec2(4, 20));
        this.ticked.push(this.tow_truck);

        for (var i = 0; i < 10; ++i)
        {
            for (var j = 0; j < 10; ++j)
            {
                var b = new Box(this.world, 'box', new b2Vec2(j*0.5+i*1.5, j*1.5));
                this.addChild(b.container);
                this.ticked.push(b);
            }
        }

        // this.towed = new Box(this.world, 0.85, 2.25, new b2Vec2(j*0.5+i*1.5, j*1.5), 0.3);
        this.towed = new Box(this.world, 'car', new b2Vec2(20, 10));
        this.addChild(this.towed.container);
        this.ticked.push(this.towed);

        this.addChild(this.tow_truck.container);
    }

    private init_phys():void
    {
        var gravity = new b2Vec2(0, 0);
        this.world = new b2World(gravity, true);

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
}
