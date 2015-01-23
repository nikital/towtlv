class Box extends Body
{
    constructor(private world:b2World, width:number, height:number, private position:b2Vec2, private angle = 0)
    {
        super();

        var body_def = new b2BodyDef();
        body_def.type = b2Body.b2_dynamicBody;
        body_def.position = position;
        body_def.linearDamping = 3;
        body_def.angularDamping = 2;

        var fix_def = new b2FixtureDef();
        var poly = new b2PolygonShape();
        poly.SetAsBox(width, height);
        fix_def.shape = poly;
        fix_def.density = 1;

        this.body = this.world.CreateBody(body_def);
        this.body.CreateFixture(fix_def);
    }
}
