/// <reference path="defs/preloadjs/preloadjs.d.ts" />

class Preload
{
    public static queue = new createjs.LoadQueue();
    public static get_bitmap(name:string):HTMLImageElement
    {
        return <HTMLImageElement>Preload.queue.getResult('assets/'+name+'.png');
    }
    public static get_sound(name:string):string
    {
        return 'assets/'+name+'.mp3';
    }
}
