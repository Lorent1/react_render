import { vec3, vec4, clamp } from "vectors_litemath";

export function unionSDF(a: vec4, b: vec4): vec4 {
    return a.w < b.w ? a : b;
}

function mix(op1: number, op2: number, t: number): number{
    return (op2 - op1) * t + op1;
}

function getColor(c1: vec3, c2: vec3, d1: number, d2: number): vec3{
    return vec3.div(vec3.add(vec3.mul(d1, c2), vec3.mul(d2, c1)), d1 + d2);
}

export function intersectSDF(a: vec4, b: vec4): vec4 {
    return a.w > b.w ? a : b;
}

export function differenceSDF(a: vec4, b: vec4): vec4 {
    return a.w > -b.w ? a : new vec4(b.x, b.y, b.z, -b.w);
}

export function smoothUnion(d1: vec4, d2: vec4, k: number): vec4{
    let h = clamp(0.5 + 0.5 * (d1.w - d2.w) / k, 0.0, 1.0);
    let d = mix(d1.w, d2.w, h) - k * h * (1.0 - h);

    let color = getColor(new vec3(d1.x,d1.y,d1.z), new vec3(d2.x,d2.y,d2.z), d1.w, d2.w);

    return new vec4(color.x, color.y, color.z, d);
}

export function smoothSubtraction(d1: vec4, d2: vec4, k: number): vec4{
    let negDistance = new vec4(1, 1, 1, -1.0);
    return vec4.mul(smoothUnion(d1, vec4.mul(d2, negDistance), k), negDistance);
}

export function smoothIntersection(d1: vec4, d2: vec4, k: number): vec4{
    let negDistance = new vec4(1, 1, 1, -1.0);
    return vec4.mul(smoothUnion(vec4.mul(d1, negDistance), vec4.mul(d2, negDistance), k), negDistance);
}