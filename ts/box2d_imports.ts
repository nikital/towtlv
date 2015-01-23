/// <reference path="defs/box2d.d.ts" />

import b2Vec2 = Box2D.Common.Math.b2Vec2;

import b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
import b2World = Box2D.Dynamics.b2World;
import b2Body = Box2D.Dynamics.b2Body;
import b2BodyDef = Box2D.Dynamics.b2BodyDef;
import b2Fixture = Box2D.Dynamics.b2Fixture;
import b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
import b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint;
import b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
import b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;

import b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
