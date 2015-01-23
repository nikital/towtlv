class Tow_truck extends Body
{
    private body:b2Body;
    private right:b2Body;
    private left:b2Body;
    private right_joint:b2RevoluteJoint;
    private left_joint:b2RevoluteJoint;
    private all_wheels:b2Body[] = [];

    private turning_speed = 10;
    private motor_force = 300;

    constructor(private world:b2World, position:b2Vec2)
    {
        super();

        this.create_body(position);
        this.create_wheels(position);
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
        poly.SetAsBox(1.5, 3);
        fix_def.shape = poly;
        fix_def.density = 1;

        this.body = this.world.CreateBody(body_def);
        this.body.CreateFixture(fix_def);
    }

    private create_wheels(position:b2Vec2):void
    {
        var wheel_offset = new b2Vec2(1.2, 2.3);

        var body_def = new b2BodyDef();
        body_def.type = b2Body.b2_dynamicBody;
        body_def.linearDamping = 1;
        body_def.angularDamping = 1;

        var fix_def = new b2FixtureDef();
        var poly = new b2PolygonShape();
        poly.SetAsBox(0.15, 0.4);
        fix_def.shape = poly;
        fix_def.density = 20;

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

    public on_tick():void
    {
        if (g_input.forward || g_input.backwards)
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
            var to_center = -this.right_joint.GetJointAngle();
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

        for (var i = 0; i < this.all_wheels.length; ++i)
        {
            var wheel = this.all_wheels[i];

            var localPoint = new b2Vec2(0,0);
            var velocity:b2Vec2 = wheel.GetLinearVelocityFromLocalPoint(localPoint);

            var sidewaysAxis = wheel.GetTransform().R.col2.Copy();
            sidewaysAxis.Multiply(b2Math.Dot(velocity,sidewaysAxis))

            wheel.SetLinearVelocity(sidewaysAxis);
        }
    }
}
