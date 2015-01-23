/// <reference path="body.ts" />
/// <reference path="box.ts" />
/// <reference path="tow_truck.ts" />

class Level
{
    private world:b2World;
    private tow_truck:Tow_truck;

    constructor(private debug_draw:b2DebugDraw)
    {
        this.init_phys();

        this.tow_truck = new Tow_truck(this.world, new b2Vec2(4, 20));

        for (var i = 0; i < 10; ++i)
        {
            for (var j = 0; j < 10; ++j)
            {
                new Box(this.world, 0.5, 0.5, new b2Vec2(j*0.5+i*1.5, j*1.5), 0.3);
            }
        }
    }

    private init_phys():void
    {
        var gravity = new b2Vec2(0, 0);
        this.world = new b2World(gravity, true);

        this.world.SetDebugDraw(this.debug_draw);
    }

    public on_tick():void
    {
        this.tow_truck.on_tick();

        this.world.Step(1/60, 6, 3);
        this.world.ClearForces();

        this.world.DrawDebugData();
    }
}
