interface Prop
{
    bitmap_path:string;
    density:number;
    dynamic:boolean;
    kill_ortho:boolean;
}

var Props:{[index:string]:Prop} = {
    box: {
        bitmap_path: 'box',
        density: 0.3,
        dynamic: true,
        kill_ortho: false,
    },
    car: {
        bitmap_path: 'car',
        density: 2,
        dynamic: true,
        kill_ortho: true,
    },
};
