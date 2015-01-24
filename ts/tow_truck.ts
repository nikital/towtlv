
enum TowSound 
{
    None,
    WithGas,
    NoGas,
}

class Tow_truck extends Body
{
    private right:b2Body;
    private left:b2Body;
    private arm:b2Body;
    private right_joint:b2RevoluteJoint;
    private left_joint:b2RevoluteJoint;
    private arm_joint:b2RevoluteJoint;
    private tow_joint:b2RevoluteJoint;

    private all_wheels:b2Body[] = [];

    private bitmap_body:createjs.Bitmap;
    private bitmap_arm:createjs.Bitmap;

    private arm_speed = 3;
    private turning_speed = 10;
    private motor_force = 300;
    private arm_half_len = 2.2;

    private tow_sound = TowSound.None;
    private curr_rumble:createjs.AbstractSoundInstance;

    constructor(private world:b2World, position:b2Vec2)
    {
        super();

        position = position.Copy();
        position.Multiply(1/g_common.pixel_scale);
        this.create_body(position);
        this.create_wheels();
        this.create_arm();

        this.create_graphics();
    }

    private create_body(position:b2Vec2):void
    {
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
    }

    private create_wheels():void
    {
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
        this.right_joint = <b2RevoluteJoint>this.world.CreateJoint(revolute_def);

        revolute_def.Initialize(this.body, left_front, left_front.GetWorldCenter());
        this.left_joint = <b2RevoluteJoint>this.world.CreateJoint(revolute_def);

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
    }

    private create_arm():void
    {
        var offset = new b2Vec2(0, 1+this.arm_half_len);

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
        this.arm_joint = <b2RevoluteJoint>this.world.CreateJoint(revolute_def);
    }

    private create_graphics():void
    {
        this.bitmap_body = new createjs.Bitmap(Preload.get_bitmap('tow_body'));
        this.bitmap_body.regX = this.bitmap_body.getBounds().width/2;
        this.bitmap_body.regY = this.bitmap_body.getBounds().height/2;
        this.container.addChild(this.bitmap_body);

        this.bitmap_arm = new createjs.Bitmap(Preload.get_bitmap('tow_arm'));
        this.bitmap_arm.regX = this.bitmap_arm.getBounds().width/2;
        this.bitmap_arm.regY = this.bitmap_arm.getBounds().height/2;
        this.container.addChild(this.bitmap_arm);
    }

    public play_sound(sound_to_play:TowSound):void
    {
        if(sound_to_play == this.tow_sound)
        {
            return;
        }
        if (this.curr_rumble)
        {
            this.curr_rumble.stop();
            this.curr_rumble = null;
        }
        
        if(sound_to_play == TowSound.WithGas)
        {
             this.curr_rumble = createjs.Sound.play(Preload.get_sound("tow_velocity"), {loop: -1});
        }

        else if(sound_to_play == TowSound.NoGas)
        {
             this.curr_rumble = createjs.Sound.play(Preload.get_sound("tow_no_velocity"), {loop: -1});
        }

        this.tow_sound = sound_to_play;
    }

    public on_tick():void
    {
        var to_center = 0;
        var has_velocity = g_input.forward || g_input.backwards;
        var sound_to_play = has_velocity ? TowSound.WithGas : TowSound.NoGas;
        this.play_sound(sound_to_play);

        if (has_velocity)
        {
            var multiplier = this.motor_force * (g_input.forward ? -1 : 1);
            var vec = this.right.GetTransform().R.col2.Copy();
            vec.Multiply(multiplier);
            this.right.ApplyForce(vec, this.right.GetPosition());

            vec = this.left.GetTransform().R.col2.Copy();
            vec.Multiply(multiplier);
            this.left.ApplyForce(vec, this.left.GetPosition());
        }

        if (g_input.right == g_input.left)
        {
            to_center = -this.right_joint.GetJointAngle();
            this.right_joint.SetMotorSpeed(to_center * this.turning_speed);
            to_center = -this.left_joint.GetJointAngle();
            this.left_joint.SetMotorSpeed(to_center * this.turning_speed);
        }
        else if (g_input.right)
        {
            this.right_joint.SetMotorSpeed(this.turning_speed);
            this.left_joint.SetMotorSpeed(this.turning_speed);
        }
        else if (g_input.left)
        {
            this.right_joint.SetMotorSpeed(-this.turning_speed);
            this.left_joint.SetMotorSpeed(-this.turning_speed);
        }

        to_center = -this.arm_joint.GetJointAngle();
        this.arm_joint.SetMotorSpeed(to_center * this.arm_speed);

        for (var i = 0; i < this.all_wheels.length; ++i)
        {
            var wheel = this.all_wheels[i];

            var localPoint = new b2Vec2(0,0);
            var velocity:b2Vec2 = wheel.GetLinearVelocityFromLocalPoint(localPoint);

            var sidewaysAxis = wheel.GetTransform().R.col2.Copy();
            sidewaysAxis.Multiply(b2Math.Dot(velocity,sidewaysAxis))

            wheel.SetLinearVelocity(sidewaysAxis);
        }

        g_common.align_sprite_to_phys(this.bitmap_body, this.body);
        g_common.align_sprite_to_phys(this.bitmap_arm, this.arm);
    }

    public tow(towed:Body):void
    {
        var contact_point = this.arm.GetWorldPoint(new b2Vec2(0, this.arm_half_len));

        var revolute_def = new b2RevoluteJointDef();
        revolute_def.Initialize(this.arm, towed.body, contact_point);
        this.tow_joint = <b2RevoluteJoint>this.world.CreateJoint(revolute_def);
    }

    public stop_tow():void
    {
        if (this.tow_joint)
        {
            this.world.DestroyJoint(this.tow_joint);
            this.tow_joint = null;
        }
    }

    public can_tow(towed:Body):boolean
    {
        if (this.is_towing())
        {
            return false;
        }

        var contact_point = this.arm.GetWorldPoint(new b2Vec2(0, this.arm_half_len));
        var colliding = false
        var fixture = towed.body.GetFixtureList();
        for (var fixture = towed.body.GetFixtureList(); fixture; fixture = fixture.GetNext())
        {
            if (fixture.TestPoint(contact_point))
            {
                colliding = true;
                break;
            }
        }

        return colliding;
    }

    public is_towing():boolean
    {
        return this.tow_joint != null;
    }
}
