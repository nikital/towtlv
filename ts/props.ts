interface Prop
{
    bitmap_path:string;
    density:number;
    dynamic:boolean;
    kill_ortho:boolean;
    circular:boolean;
}

var Props:{[index:string]:Prop} = {
    box: {
        bitmap_path: 'box',
        density: 0.3,
        dynamic: true,
        kill_ortho: false,
        circular: false,
    },
    car: {
        bitmap_path: 'car',
        density: 1.5,
        dynamic: true,
        kill_ortho: true,
        circular: false,
    },
    target: {
        bitmap_path: 'target',
        density: 1,
        dynamic: true,
        kill_ortho: true,
        circular: false,
    },
    tow: {
        bitmap_path: 'tow_body',
        density: 0,
        dynamic: true,
        kill_ortho: true,
        circular: false,
    },
    wall: {
        bitmap_path: 'editor_wall',
        density: 0,
        dynamic: false,
        kill_ortho: false,
        circular: false,
    },
    bicycle: {
        bitmap_path: 'bicycle',
        density: 1,
        dynamic: true,
        kill_ortho: true,
        circular: false,
    },
    cafe_table: {
        bitmap_path: 'cafe_table',
        density: 0.7,
        dynamic: true,
        kill_ortho: false,
        circular: true,
    },
    cafe_umbrella: {
        bitmap_path: 'cafe_umbrella',
        density: 0.7,
        dynamic: true,
        kill_ortho: false,
        circular: true,
    },
    chair: {
        bitmap_path: 'chair',
        density: 1,
        dynamic: true,
        kill_ortho: false,
        circular: false,
    },
    garbage: {
        bitmap_path: 'garbage',
        density: 1,
        dynamic: true,
        kill_ortho: false,
        circular: false,
    },
    motorcycle: {
        bitmap_path: 'motorcycle',
        density: 1,
        dynamic: true,
        kill_ortho: true,
        circular: false,
    },
    cart: {
        bitmap_path: 'cart',
        density: 1,
        dynamic: true,
        kill_ortho: false,
        circular: false,
    },
    stroller: {
        bitmap_path: 'stroller',
        density: 1,
        dynamic: true,
        kill_ortho: false,
        circular: false,
    },
    suitcase: {
        bitmap_path: 'suitcase',
        density: 1,
        dynamic: true,
        kill_ortho: false,
        circular: false,
    },
    trash_can: {
        bitmap_path: 'trash_can',
        density: 1,
        dynamic: true,
        kill_ortho: false,
        circular: true,
    },
};
