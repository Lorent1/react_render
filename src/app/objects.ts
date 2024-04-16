import { vec3, vec4, mod } from "vectors_litemath";

function floorVec(op1: vec3){
    return new vec3(Math.floor(op1.x), Math.floor(op1.y), Math.floor(op1.z))
}

function modVec(op1: vec3, op2: vec3){
    return vec3.sub(op1, vec3.mul(op1, floorVec(vec3.div(op1, op2))));
}

abstract class Object{
    constructor(p: vec3, c: vec3){
        this.position = p;
        this.color = c;
    }

    createObject(p: vec3): vec4 {return new vec4(0.0)};

    getPos(p: vec3, offset: vec3): vec3 { 
        let s = vec3.sub(p, offset); 
        if(!(s instanceof vec3)) throw Error("Something went wrong");
        return s;
    }

    position: vec3;
    color: vec3;
}

export class Scene{
    constructor(st: vec4){
        this.value = st;
    }

    getValue() {return this.value};

    setValue(p: vec4) {this.value = p};

    value: vec4
}

export class Sphere extends Object{
    constructor(p: vec3, c: vec3, r: number){
        super(p, c);
        this.radius = r;
    }

    createObject(p: vec3){
        p = this.getPos(p, this.position);
        let obj = vec3.lengthVec(p) - this.radius;
        return new vec4(this.color.x, this.color.y, this.color.z, obj);
    }
    radius: number
}

export class Plane extends Object{

    constructor(p: vec3, c: vec3, n: vec3, h: number, isCelled: boolean){
        super(p,c)
        this.n = n;
        this.h = h;
        this.isCelled = isCelled;
    }

    createObject(p: vec3): vec4 {
        let plane = vec3.dot(p, vec3.normalize(this.n)) + this.h;
    
        if (this.isCelled) {
            this.color = new vec3(0.2 + 0.4 * mod(Math.floor(p.x) + Math.floor(p.z), 2.0));
        }
    
        return new vec4(this.color.x, this.color.y, this.color.z, plane);
    } 

    n: vec3
    h: number
    isCelled: boolean
}

export class Box extends Object{
    constructor(p: vec3, c: vec3, s: vec3){
        super(p, c);
        this.side = s;
    }

    createObject(p: vec3): vec4 {
        p = this.getPos(p, this.position);
        let q = vec3.sub(vec3.abs(p), this.side);

        let box = vec3.lengthVec(vec3.max(q, new vec3(0.0))) + Math.min(Math.max(q.x, Math.max(q.y, q.z)), 0);
        console.log("here");
        return new vec4(this.color.x, this.color.y, this.color.z, box);
    }

    side: vec3;
}

export class RoundBox extends Box{
    constructor(p: vec3, c: vec3, s: vec3, r: number){
        super(p, c, s);
        this.radius = r;
    }

    createObject(p: vec3): vec4 {
        p = this.getPos(p, this.position);
        let q = vec3.add(vec3.sub(vec3.abs(p), this.side), this.radius);

        let box = vec3.lengthVec(vec3.max(q, new vec3(0.0))) + Math.min(Math.max(q.x, Math.max(q.y, q.z)), 0) - this.radius;

        return new vec4(this.color.x, this.color.y, this.color.z, box);
    }

    radius: number;
}

export class MengerSponge extends Box{
    constructor(p: vec3, c: vec3, s: vec3, scale: number){
        super(p, c, s);
        this.scale = scale;
    }

    createObject(p: vec3): vec4 {
        p = this.getPos(p, this.position);
        p = vec3.div(p, this.scale);
        let box = new Box(new vec3(0), this.color, this.side).createObject(p);
    
        let s = 1.0;
    
        for (let m = 0; m < 5; m++) {
            let a = vec3.sub(modVec(vec3.mul(p, s), new vec3(2.0)), 1.0);
            s *= 3.0;
            let r = vec3.abs(vec3.sub(1.0, vec3.mul(3.0, vec3.abs(a))));
    
            let da = Math.max(r.x, r.y);
            let db = Math.max(r.y, r.z);
            let dc = Math.max(r.z, r.x);
    
            let c = (Math.min(da, Math.min(db, dc)) - 1.0) / s;
    
            box.w = Math.max(box.w, c);
        }
    
        return box;
    }


    scale: number
}

export class Mandelbulb extends Object{
    constructor(p: vec3, c: vec3, power: number, scale: number){
        super(p, c);
        this.power = power;
        this.scale = scale;
    }

    createObject(p: vec3): vec4 {
        p = this.getPos(p, this.position);
        p = vec3.div(p, this.scale);
        let z = p;

        let dr = 1;
        let r = 0
        let bailout = 50;

        for (let i = 0; i < 5; i++) {
            r = vec3.lengthVec(z);
            if (r > bailout) break;
    
            // convert to polar coordinates
            let theta = Math.acos(z.z / r);
            let phi = Math.atan2(z.y, z.x);
            dr = Math.pow(r, this.power - 1.0) * this.power * dr + 1.0;
    
            // scale and rotate the point
            let zr = Math.pow(r, this.power);
            theta = theta * this.power;
            phi = phi * this.power;
    
            // convert back to cartesian coordinates
            z = vec3.mul(zr, new vec3(Math.sin(theta) * Math.cos(phi), Math.sin(phi) * Math.sin(theta), Math.cos(theta)));
            z = vec3.add(z, p) ;
        }
    
        return new vec4(this.color.x, this.color.y, this.color.z, 0.5 * Math.log(r) * r / dr);
    }

    power: number
    scale: number
}