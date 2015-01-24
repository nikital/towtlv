class Box extends Body
{
    private bitmap:createjs.Bitmap;
    private kill_ortho:boolean;

    constructor(private world:b2World, name:string, position:b2Vec2, angle:number = 0)
    {
        super();

        var prop = Props[name];
        this.kill_ortho = prop.kill_ortho;

        this.bitmap = new createjs.Bitmap(Preload.get_bitmap(prop.bitmap_path));
        var half_width = this.bitmap.getBounds().width/2
        var half_height = this.bitmap.getBounds().height/2;
        this.bitmap.regX = half_width;
        this.bitmap.regY = half_height;
        this.container.addChild(this.bitmap);

        position = position.Copy();
        position.Multiply(1/g_common.pixel_scale);
        var body_def = new b2BodyDef();
        body_def.type = prop.dynamic ? b2Body.b2_dynamicBody : b2Body.b2_staticBody;
        body_def.position = position;
        body_def.angle = angle;
        body_def.linearDamping = 3;
        body_def.angularDamping = 2;

        var fix_def = new b2FixtureDef();
        var poly = new b2PolygonShape();
        poly.SetAsBox((half_width-2) / g_common.pixel_scale, (half_height-2) / g_common.pixel_scale);
        fix_def.shape = poly;
        fix_def.density = prop.density;

        this.body = this.world.CreateBody(body_def);
        this.body.CreateFixture(fix_def);
    }

    public on_tick():void
    {
        if (this.kill_ortho)
        {
            var localPoint = new b2Vec2(0,0);
            var velocity:b2Vec2 = this.body.GetLinearVelocityFromLocalPoint(localPoint);

            var sidewaysAxis = this.body.GetTransform().R.col2.Copy();
            sidewaysAxis.Multiply(b2Math.Dot(velocity,sidewaysAxis))

            this.body.SetLinearVelocity(sidewaysAxis);
            this.body.SetAngularVelocity(0);
        }

        g_common.align_sprite_to_phys(this.bitmap, this.body);
    }
}
