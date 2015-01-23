class Tow_truck
{
    private body:b2Body;

    constructor(private world:b2World, position:b2Vec2)
    {
        this.create_body(position);
        this.create_wheels(position);
    }

    private create_body(position:b2Vec2):void
    {
        var body_def = new b2BodyDef();
        body_def.type = b2Body.b2_dynamicBody;
        body_def.position = position;
        // add linear and angular damping

        var fix_def = new b2FixtureDef();
        var poly = new b2PolygonShape();
        poly.SetAsBox(1.5, 3);
        fix_def.shape = poly;

        this.body = this.world.CreateBody(body_def);
        this.body.CreateFixture(fix_def);
    }

    private create_wheels(position:b2Vec2):void
    {
        var wheel_offset = new b2Vec2(1.2, 2.3);

        var body_def = new b2BodyDef();
        body_def.type = b2Body.b2_dynamicBody;

        var fix_def = new b2FixtureDef();
        var poly = new b2PolygonShape();
        poly.SetAsBox(0.15, 0.4);
        fix_def.shape = poly;

        body_def.position = position.Copy();
        body_def.position.Add(new b2Vec2(wheel_offset.x, -wheel_offset.y));
        var right_front = this.world.CreateBody(body_def);
        right_front.CreateFixture(fix_def);

        body_def.position = position.Copy();
        body_def.position.Add(new b2Vec2(-wheel_offset.x, -wheel_offset.y));
        var left_front = this.world.CreateBody(body_def);
        left_front.CreateFixture(fix_def);

        body_def.position = position.Copy();
        body_def.position.Add(new b2Vec2(wheel_offset.x, wheel_offset.y));
        var right_rear = this.world.CreateBody(body_def);
        right_rear.CreateFixture(fix_def);

        body_def.position = position.Copy();
        body_def.position.Add(new b2Vec2(-wheel_offset.x, wheel_offset.y));
        var left_rear = this.world.CreateBody(body_def);
        left_rear.CreateFixture(fix_def);

    }
}
