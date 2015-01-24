class Common
{
    public pixel_scale = 30;
    public align_sprite_to_phys(sprite:createjs.DisplayObject, body:b2Body):void
    {
        sprite.rotation = body.GetAngle() / Math.PI * 180;
        var pos = body.GetPosition();
        sprite.x = pos.x * this.pixel_scale;
        sprite.y = pos.y * this.pixel_scale;
    }
    public canvas:HTMLCanvasElement;
}

var g_common:Common;
