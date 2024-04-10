

type vector = vec2 | vec3 | vec4;

export function clamp(op1: number, min: number, max: number): number{
    return Math.min(Math.max(op1, min), max);
}

export class vec2 {
    public x: number;
    public y: number;

    constructor(x: number, y?: number) {
        if (y == null){
            this.x = x;
            this.y = x;
        }else{
            this.x = x;
            this.y = y;
        }
    };
}

export class vec3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y?: number, z?: number) {
        if (+(y == null) + +(z == null) == 1) throw Error("Invalid number of arguments");

        if (y == null && z == null){
            this.x = x;
            this.y = x;
            this.z = x;
        }else{
            this.x = x;
            this.y = y!;
            this.z = z!;
        }
    };
}

export class vec4 {
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    constructor(x: number, y?: number, z?: number, w?: number) {
        if (+(y == null) + +(z == null) + +(w == null) == 1 
        || +(y == null) + +(z == null) + +(w == null) == 2) throw Error("Invalid number of arguments");

        if (y == null && z == null && w == null){
            this.x = x;
            this.y = x;
            this.z = x;
            this.w = x;
        }else{
            this.x = x;
            this.y = y!;
            this.z = z!;
            this.w = w!;
        }
    };
}

export function add(op1: vector | number, op2: vector | number): vector{
    if (op1 instanceof vec4 && op2 instanceof vec4){
        return new vec4(op1.x + op2.x, op1.y + op2.y, op1.z + op2.z, op1.w + op2.w);
    }

    if (op1 instanceof vec3 && op2 instanceof vec3){
        return new vec3(op1.x + op2.x, op1.y + op2.y, op1.z + op2.z);
    }

    if (op1 instanceof vec2 && op2 instanceof vec2){
        return new vec2(op1.x + op2.x, op1.y + op2.y);
    }

    if(op1 instanceof vec4 && typeof op2 === "number"){
        return new vec4(op1.x + op2, op1.y + op2, op1.z + op2, op1.w + op2);
    }

    if(op1 instanceof vec3 && typeof op2 === "number"){
        return new vec3(op1.x + op2, op1.y + op2, op1.z + op2);
    }

    if(op1 instanceof vec2 && typeof op2 === "number"){
        return new vec2(op1.x + op2, op1.y + op2);
    }

    if(typeof op1 === "number" && op2 instanceof vec4){
        return new vec4(op1 + op2.x, op1 + op2.y, op1 + op2.z, op1 + op2.w);
    }

    if(typeof op1 === "number" && op2 instanceof vec3){
        return new vec3(op1 + op2.x, op1 + op2.y, op1 + op2.z);
    }

    if(typeof op1 === "number" && op2 instanceof vec2){
        return new vec2(op1 + op2.x, op1 + op2.y);
    }

    throw new Error("Wrong arguments");
}

export function sub(op1: vector | number, op2: vector | number): vector{
    if (op1 instanceof vec4 && op2 instanceof vec4){
        return new vec4(op1.x - op2.x, op1.y - op2.y, op1.z - op2.z, op1.w - op2.w);
    }

    if (op1 instanceof vec3 && op2 instanceof vec3){
        return new vec3(op1.x - op2.x, op1.y - op2.y, op1.z - op2.z);
    }

    if (op1 instanceof vec2 && op2 instanceof vec2){
        return new vec2(op1.x - op2.x, op1.y - op2.y);
    }

    if(op1 instanceof vec4 && typeof op2 === "number"){
        return new vec4(op1.x - op2, op1.y - op2, op1.z - op2, op1.w - op2);
    }

    if(op1 instanceof vec3 && typeof op2 === "number"){
        return new vec3(op1.x - op2, op1.y - op2, op1.z - op2);
    }

    if(op1 instanceof vec2 && typeof op2 === "number"){
        return new vec2(op1.x - op2, op1.y - op2);
    }

    if(typeof op1 === "number" && op2 instanceof vec4){
        return new vec4(op1 - op2.x, op1 - op2.y, op1 - op2.z, op1 - op2.w);
    }

    if(typeof op1 === "number" && op2 instanceof vec3){
        return new vec3(op1 - op2.x, op1 - op2.y, op1 - op2.z);
    }

    if(typeof op1 === "number" && op2 instanceof vec2){
        return new vec2(op1 - op2.x, op1 - op2.y);
    }

    throw new Error("Wrong arguments");
}

export function mul(op1: vector | number, op2: vector | number): vector{
    if (op1 instanceof vec4 && op2 instanceof vec4){
        return new vec4(op1.x * op2.x, op1.y * op2.y, op1.z * op2.z, op1.w * op2.w);
    }

    if (op1 instanceof vec3 && op2 instanceof vec3){
        return new vec3(op1.x * op2.x, op1.y * op2.y, op1.z * op2.z);
    }

    if (op1 instanceof vec2 && op2 instanceof vec2){
        return new vec2(op1.x * op2.x, op1.y * op2.y);
    }

    if(op1 instanceof vec4 && typeof op2 === "number"){
        return new vec4(op1.x * op2, op1.y * op2, op1.z * op2, op1.w * op2);
    }

    if(op1 instanceof vec3 && typeof op2 === "number"){
        return new vec3(op1.x * op2, op1.y * op2, op1.z * op2);
    }

    if(op1 instanceof vec2 && typeof op2 === "number"){
        return new vec2(op1.x * op2, op1.y * op2);
    }

    if(typeof op1 === "number" && op2 instanceof vec4){
        return new vec4(op1 * op2.x, op1 * op2.y, op1 * op2.z, op1 * op2.w);
    }

    if(typeof op1 === "number" && op2 instanceof vec3){
        return new vec3(op1 * op2.x, op1 * op2.y, op1 * op2.z);
    }

    if(typeof op1 === "number" && op2 instanceof vec2){
        return new vec2(op1 * op2.x, op1 * op2.y);
    }

    throw new Error("Wrong arguments");
}

export function div(op1: vector | number, op2: vector | number): vector{
    if (op1 instanceof vec4 && op2 instanceof vec4){
        return new vec4(op1.x / op2.x, op1.y / op2.y, op1.z / op2.z, op1.w / op2.w);
    }

    if (op1 instanceof vec3 && op2 instanceof vec3){
        return new vec3(op1.x / op2.x, op1.y / op2.y, op1.z / op2.z);
    }

    if (op1 instanceof vec2 && op2 instanceof vec2){
        return new vec2(op1.x / op2.x, op1.y / op2.y);
    }

    if(op1 instanceof vec4 && typeof op2 === "number"){
        return new vec4(op1.x / op2, op1.y / op2, op1.z / op2, op1.w / op2);
    }

    if(op1 instanceof vec3 && typeof op2 === "number"){
        return new vec3(op1.x / op2, op1.y / op2, op1.z / op2);
    }

    if(op1 instanceof vec2 && typeof op2 === "number"){
        return new vec2(op1.x / op2, op1.y / op2);
    }

    if(typeof op1 === "number" && op2 instanceof vec4){
        return new vec4(op1 / op2.x, op1 / op2.y, op1 / op2.z, op1 / op2.w);
    }

    if(typeof op1 === "number" && op2 instanceof vec3){
        return new vec3(op1 / op2.x, op1 / op2.y, op1 / op2.z);
    }

    if(typeof op1 === "number" && op2 instanceof vec2){
        return new vec2(op1 / op2.x, op1 / op2.y);
    }

    throw new Error("Wrong arguments");
}

export function greater(op1: vector, op2: vector): vector{
    if (op1 instanceof vec4 && op2 instanceof vec4){
        return new vec4(+(op1.x > op2.x), +(op1.y > op2.y), +(op1.z > op2.z), +(op1.w > op2.w));
    }

    if (op1 instanceof vec3 && op2 instanceof vec3){
        return new vec3(+(op1.x > op2.x), +(op1.y > op2.y), +(op1.z > op2.z));
    }

    if (op1 instanceof vec2 && op2 instanceof vec2){
        return new vec2(+(op1.x > op2.x), +(op1.y > op2.y));
    }

    throw new Error("Wrong arguments");
}

export function less(op1: vector, op2: vector): vector{
    if (op1 instanceof vec4 && op2 instanceof vec4){
        return new vec4(+(op1.x < op2.x), +(op1.y < op2.y), +(op1.z < op2.z), +(op1.w < op2.w));
    }

    if (op1 instanceof vec3 && op2 instanceof vec3){
        return new vec3(+(op1.x < op2.x), +(op1.y < op2.y), +(op1.z < op2.z));
    }

    if (op1 instanceof vec2 && op2 instanceof vec2){
        return new vec2(+(op1.x < op2.x), +(op1.y < op2.y));
    }

    throw new Error("Wrong arguments");
}

export function greaterOrEqual(op1: vector, op2: vector): vector{
    if (op1 instanceof vec4 && op2 instanceof vec4){
        return new vec4(+(op1.x >= op2.x), +(op1.y >= op2.y), +(op1.z >= op2.z), +(op1.w >= op2.w));
    }

    if (op1 instanceof vec3 && op2 instanceof vec3){
        return new vec3(+(op1.x >= op2.x), +(op1.y >= op2.y), +(op1.z >= op2.z));
    }

    if (op1 instanceof vec2 && op2 instanceof vec2){
        return new vec2(+(op1.x >= op2.x), +(op1.y >= op2.y));
    }

    throw new Error("Wrong arguments");
}

export function lessOrEqual(op1: vector, op2: vector): vector{
    if (op1 instanceof vec4 && op2 instanceof vec4){
        return new vec4(+(op1.x <= op2.x), +(op1.y <= op2.y), +(op1.z <= op2.z), +(op1.w <= op2.w));
    }

    if (op1 instanceof vec3 && op2 instanceof vec3){
        return new vec3(+(op1.x <= op2.x), +(op1.y <= op2.y), +(op1.z <= op2.z));
    }

    if (op1 instanceof vec2 && op2 instanceof vec2){
        return new vec2(+(op1.x <= op2.x), +(op1.y <= op2.y));
    }

    throw new Error("Wrong arguments");
}

export function equal(op1: vector, op2: vector): vector{
    if (op1 instanceof vec4 && op2 instanceof vec4){
        return new vec4(+(op1.x == op2.x), +(op1.y == op2.y), +(op1.z == op2.z), +(op1.w == op2.w));
    }

    if (op1 instanceof vec3 && op2 instanceof vec3){
        return new vec3(+(op1.x == op2.x), +(op1.y == op2.y), +(op1.z == op2.z));
    }

    if (op1 instanceof vec2 && op2 instanceof vec2){
        return new vec2(+(op1.x == op2.x), +(op1.y == op2.y));
    }

    throw new Error("Wrong arguments");
}

export function notEqual(op1: vector, op2: vector): vector{
    if (op1 instanceof vec4 && op2 instanceof vec4){
        return new vec4(+(op1.x != op2.x), +(op1.y != op2.y), +(op1.z != op2.z), +(op1.w != op2.w));
    }

    if (op1 instanceof vec3 && op2 instanceof vec3){
        return new vec3(+(op1.x != op2.x), +(op1.y != op2.y), +(op1.z != op2.z));
    }

    if (op1 instanceof vec2 && op2 instanceof vec2){
        return new vec2(+(op1.x != op2.x), +(op1.y != op2.y));
    }

    throw new Error("Wrong arguments");
}

export function min(op1: vector, op2: vector): vector{
    if (op1 instanceof vec4 && op2 instanceof vec4){
        return new vec4(Math.min(op1.x, op2.x), Math.min(op1.y, op2.y), Math.min(op1.z, op2.z), Math.min(op1.w, op2.w));
    }

    if (op1 instanceof vec3 && op2 instanceof vec3){
        return new vec3(Math.min(op1.x, op2.x), Math.min(op1.y, op2.y), Math.min(op1.z, op2.z));
    }

    if (op1 instanceof vec2 && op2 instanceof vec2){
        return new vec2(Math.min(op1.x, op2.x), Math.min(op1.y, op2.y))
    }

    throw new Error("Wrong arguments");
}

export function max(op1: vector, op2: vector): vector{
    if (op1 instanceof vec4 && op2 instanceof vec4){
        return new vec4(Math.max(op1.x, op2.x), Math.max(op1.y, op2.y), Math.max(op1.z, op2.z), Math.max(op1.w, op2.w));
    }

    if (op1 instanceof vec3 && op2 instanceof vec3){
        return new vec3(Math.max(op1.x, op2.x), Math.max(op1.y, op2.y), Math.max(op1.z, op2.z));
    }

    if (op1 instanceof vec2 && op2 instanceof vec2){
        return new vec2(Math.max(op1.x, op2.x), Math.max(op1.y, op2.y))
    }

    throw new Error("Wrong arguments");
}

export function clampVec(op1: vector, op2: vector | number, op3: vector | number): vector{
    if(op1 instanceof vec4 && op2 instanceof vec4 && op3 instanceof vec4){
        return new vec4(clamp(op1.x, op2.x, op3.x), clamp(op1.y, op2.y, op3.y), clamp(op1.z, op2.z, op3.z), clamp(op1.w, op2.w, op3.w));
    }

    if(op1 instanceof vec3 && op2 instanceof vec3 && op3 instanceof vec3){
        return new vec3(clamp(op1.x, op2.x, op3.x), clamp(op1.y, op2.y, op3.y), clamp(op1.z, op2.z, op3.z));
    }

    if(op2 instanceof vec2 && op3 instanceof vec2){
        return new vec2(clamp(op1.x, op2.x, op3.x), clamp(op1.y, op2.y, op3.y));
    }

    if(op1 instanceof vec4 && typeof op2 === "number" && typeof op3 === "number"){
        return new vec4(clamp(op1.x, op2, op3), clamp(op1.y, op2, op3), clamp(op1.z, op2, op3), clamp(op1.w, op2, op3));
    }

    if(op1 instanceof vec3 && typeof op2 === "number" && typeof op3 === "number"){
        return new vec3(clamp(op1.x, op2, op3), clamp(op1.y, op2, op3), clamp(op1.z, op2, op3));
    }

    if(op1 instanceof vec2 && typeof op2 === "number" && typeof op3 === "number"){
        return new vec2(clamp(op1.x, op2, op3), clamp(op1.y, op2, op3));
    }

    throw new Error("Wrong arguments");
}

export function abs(op1: vector): vector{
    if (op1 instanceof vec4){
        return new vec4(Math.abs(op1.x), Math.abs(op1.y), Math.abs(op1.z), Math.abs(op1.w));
    }

    if (op1 instanceof vec3){
        return new vec3(Math.abs(op1.x), Math.abs(op1.y), Math.abs(op1.z));
    }

    if (op1 instanceof vec2){
        return new vec2(Math.abs(op1.x), Math.abs(op1.y));
    }

    throw new Error("Wrong arguments");
}

export function lerp(op1: vector, op2: vector, t: number): vector{
    return add(mul(sub(op2, op1), t), op1);
}

export function mix(op1: vector, op2: vector, t: number): vector{
    return add(mul(sub(op2, op1), t), op1);
}

export function sqrt(op1: vector): vector{
    if (op1 instanceof vec4){
        return new vec4(Math.sqrt(op1.x), Math.sqrt(op1.y), Math.sqrt(op1.z), Math.sqrt(op1.w));
    }

    if (op1 instanceof vec3){
        return new vec3(Math.sqrt(op1.x), Math.sqrt(op1.y), Math.sqrt(op1.z));
    }

    if (op1 instanceof vec2){
        return new vec2(Math.sqrt(op1.x), Math.sqrt(op1.y));
    }

    throw new Error("Wrong arguments");
}

export function dot(op1: vector, op2: vector): number{
    if (op1 instanceof vec4 && op2 instanceof vec4){
        return op1.x * op2.x + op1.y * op2.y + op1.z * op2.z + op1.w * op2.w;
    }

    if (op1 instanceof vec3 && op2 instanceof vec3){
        return op1.x * op2.x + op1.y * op2.y + op1.z * op2.z;
    }

    if (op1 instanceof vec2){
        return op1.x * op2.x + op1.y * op2.y;
    }

    throw new Error("Wrong arguments");
}

export function length(op1: vector): number{
    return Math.sqrt(dot(op1, op1));
}

export function normalize(op1: vector): vector{
    let lenInv = 1.0/length(op1);
    return mul(op1, lenInv);
}

