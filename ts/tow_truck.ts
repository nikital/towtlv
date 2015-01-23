class Tow_truck
{
    constructor(private world:b2World)
    {
        var ground_body_def = new b2BodyDef();
        ground_body_def.position.Set(2, 2);
        ground_body_def.type = b2Body.b2_dynamicBody;

        var ground_fix_def = new b2FixtureDef();
        var poly = new b2PolygonShape();
        poly.SetAsBox(1.5, 3);
        ground_fix_def.shape = poly;

        var ground = this.world.CreateBody(ground_body_def);
        ground.CreateFixture(ground_fix_def);

    }

    public set_position(pos:b2Vec2):void
    {
    }
}
