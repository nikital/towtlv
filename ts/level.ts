/// <reference path="tow_truck.ts" />

class Level
{
    private world:b2World;
    private tow_truck:Tow_truck;

    constructor(private debug_draw:b2DebugDraw)
    {
        this.init_phys();
    }

    private init_phys():void
    {
        var gravity = new b2Vec2(0, 1);
        this.world = new b2World(gravity, true);

        this.tow_truck = new Tow_truck(this.world);

        this.world.SetDebugDraw(this.debug_draw);
    }

    public on_tick():void
    {
        this.world.Step(1/60, 15, 15);
        this.world.DrawDebugData();
    }
}
