import { vec2, vec3, vec4, clamp } from "vectors_litemath";
import { renderProps } from "../components/canvas";

function EstimateNormal(z: vec3, eps: number, props: renderProps): vec3 {
    let z1 = vec3.add(z, new vec3(eps, 0, 0));
    let z2 = vec3.sub(z, new vec3(eps, 0, 0));
    let z3 = vec3.add(z, new vec3(0, eps, 0));
    let z4 = vec3.sub(z, new vec3(0, eps, 0));
    let z5 = vec3.add(z, new vec3(0, 0, eps));
    let z6 = vec3.sub(z, new vec3(0, 0, eps));
    let dx = props.map(z1).w - props.map(z2).w;
    let dy = props.map(z3).w - props.map(z4).w;
    let dz = props.map(z5).w - props.map(z6).w;

    return  vec3.normalize(new vec3(dx, dy, dz));
}

function getSoftShadow(p: vec3, lightPos: vec3, props: renderProps): number {
    let res = 1.0;
    let dist = 0.01;
    let lightSize = 0.03;

    for (let i = 0; i < 100 / 5; i++) {
        let hit = props.map(vec3.add(p, vec3.mul(lightPos, dist))).w;

        res = Math.min(res, hit / (dist * lightSize));
        dist += hit;
        if (hit < 1e-3 * 1e-3 || dist > 50) break;
    }

    return clamp(res, 0.0, 1.0);
}

function getAmbientOcclusion(p: vec3, normal: vec3, props: renderProps): number {
    let occ = 0.0;
    let weight = 1.0;

    for (let i = 0; i < 8; i++) {
        let len = 0.01 + 0.02 * i * i;
        let dist = props.map(vec3.mul(vec3.add(p, normal), len)).x;
        occ += (len - dist) * weight;
        weight *= 0.85;
    }
    return 1.0 - clamp(0.6 * occ, 0.0, 1.0);
}

function reflect(dir: vec3, normal: vec3): vec3 {
     return vec3.add(vec3.mul(vec3.mul(normal, vec3.dot(dir, normal)), -2.0), dir); 
}

export function getLight(pos: vec3, rd: vec3, color: vec3, props: renderProps): vec3 {
    let lightPos = props.environment.light_position;
    let L: vec3 = vec3.normalize(vec3.sub(lightPos, pos));
    let N: vec3 = EstimateNormal(pos, 1e-3, props);
    let V: vec3 = vec3.mul(-1, rd);
    let R: vec3 = reflect(vec3.mul(-1, L), N);

    let specColor: vec3 = new vec3(0.5);
    let specular: vec3 = vec3.mul(vec3.mul(1.3, specColor), Math.pow(clamp(vec3.dot(R, V), 0.0, 1.0), 10));
    let ambient: vec3 = vec3.mul(0.05, color);
    let fresnel = vec3.mul(vec3.mul(0.15, color), Math.pow(1.0 + vec3.dot(rd, N), 3));

    let shadow = getSoftShadow(vec3.add(pos, vec3.mul(N, 0.02)), vec3.normalize(lightPos), props);
    let occ = getAmbientOcclusion(pos, N, props);

    let dif: vec3 = vec3.mul(color, clamp(vec3.dot(N, L), 0.1, 1.0));

    return vec3.add(vec3.mul(vec3.add(ambient, fresnel), occ), vec3.mul(vec3.add(dif, vec3.mul(specular, occ)), shadow));
}