# Simple React Render
## Usage
This project gives an opportunity to render simple low resolution scenes in browser using SDF function

It uses a `vectors_litemath` library that provides `vec2`, `vec3`, `vec4` classes to work with graphics

You can write your own scene using json file or code editor on web page

Current list of objects you can render:

1. `sphere`: {`position`: [x, y, z], `color`: [r, g, b], `radius`: number}
2. `box`: {`position`: [x, y, z], `color`: [r, g, b], `side`: [x, y, z]}
3. `roundBox`: {`position`: [x, y, z], `color`: [r, g, b], `side`: [x, y, z], `radius`: number}
4. `mengerSponge`: {`position`: [x, y, z], `color`: [r, g, b], `side`: [x, y, z], `scale`: number}
5. `plane`: {`position`: [x, y, z], `color`: [r, g, b], `n`: [x, y, z], `h`: number, `isCelled`: boolean}
6. `mandelbulb`: {`position`: [x, y, z], `color`: [r, g, b], `side`: [x, y, z], `power`: number, `scale`: number}

Current list of operations:

1. `union`: {`obj1`: object_name, `obj2`: object_name}
2. `intersection`: {`obj1`: object_name, `obj2`: object_name}
3. `difference`: {`obj1`: object_name, `obj2`: object_name}
4. `smoothUnion`: {`obj1`: object_name, `obj2`: object_name, `smoothness`: number}
5. `smoothIntersection`: {`obj1`: object_name, `obj2`: object_name, `smoothness`: number}
6. `smoothSubtraction`: {`obj1`: object_name, `obj2`: object_name, `smoothness`: number}

## Images
![Alt text](/public/preview.png "Scene preview")
![Alt text](/public/site_preview.JPG "Site preview")

## Future

TODO:
1. Make operations to work as a Tree
2. Add more objects
3. Make loading screen
4. Add support of different resolutions
