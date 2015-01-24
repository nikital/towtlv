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
        density: 1.5,
        dynamic: true,
        kill_ortho: true,
    },
    target: {
        bitmap_path: 'target',
        density: 1,
        dynamic: true,
        kill_ortho: true,
    },
    tow: {
        bitmap_path: 'tow_body',
        density: 0,
        dynamic: true,
        kill_ortho: true,
    },
    wall: {
        bitmap_path: 'editor_wall',
        density: 0,
        dynamic: false,
        kill_ortho: false,
    },
    bicycle: {
        bitmap_path: 'bicycle',
        density: 1,
        dynamic: true,
        kill_ortho: true,
    },
    cafe_table: {
        bitmap_path: 'cafe_table',
        density: 0.7,
        dynamic: true,
        kill_ortho: false,
    },
    cafe_umbrella: {
        bitmap_path: 'cafe_umbrella',
        density: 0.7,
        dynamic: true,
        kill_ortho: false,
    },
    chair: {
        bitmap_path: 'chair',
        density: 1,
        dynamic: true,
        kill_ortho: false,
    },
    garbage: {
        bitmap_path: 'garbage',
        density: 1,
        dynamic: true,
        kill_ortho: false,
    },
    motorcycle: {
        bitmap_path: 'motorcycle',
        density: 1,
        dynamic: true,
        kill_ortho: true,
    },
    cart: {
        bitmap_path: 'cart',
        density: 1,
        dynamic: true,
        kill_ortho: false,
    },
    stroller: {
        bitmap_path: 'stroller',
        density: 1,
        dynamic: true,
        kill_ortho: false,
    },
    suitcase: {
        bitmap_path: 'suitcase',
        density: 1,
        dynamic: true,
        kill_ortho: false,
    },
    trash_can: {
        bitmap_path: 'trash_can',
        density: 1,
        dynamic: true,
        kill_ortho: false,
    },
};
