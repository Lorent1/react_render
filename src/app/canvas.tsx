import { useEffect, useRef, useState } from "react";

import { vec2, vec3, vec4, add, sub, mul, div, normalize, length, mix, dot, clamp, abs} from "./vectors";

import styles from "./page.module.css";

interface props{
    width: number,
    height: number
}

export default function MyCanvas (props : props){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D>();
  
    useEffect(() => {
        const canvas = canvasRef.current;
  
        if(canvas == null) return;
  
        const context = canvas.getContext("2d");

        if (context == null) return;

        setCanvasContext(context);
    }, [canvasRef]);

    function getUV(offset: vec2, x: number, y: number, width: number, heigth: number): vec2 {
        let ratio = width / heigth;
        let v = sub(div(mul(sub(new vec2(x, y), offset), 2.0), new vec2(width, heigth)), 1.0);
        return mul(v, new vec2(ratio, 1.0));
    }

    function getPos(p: vec3, offset: vec3): vec3 { 
        let s = sub(p, offset); 
        if(!(s instanceof vec3)) throw Error("Something went wrong");
        return s;
    }

    function sdf_sphere(p: vec3, offset: vec3, color: vec3, r: number): vec4 {
        p = getPos(p, offset);
        let obj = length(p) - r;
        return new vec4(color.x, color.y, color.z, obj);
    }

    function mod(x: number, y: number){
        return x - y * Math.floor(x/y);
    }

    function sdf_plane(p: vec3, color: vec3, n: vec3, h: number, isCelled: boolean): vec4 {

        let plane = dot(p, normalize(n)) + h;
    
        if (isCelled) {
            color = new vec3(0.2 + 0.4 * mod(Math.floor(p.x) + Math.floor(p.z), 2.0));
        }
    
        return new vec4(color.x, color.y, color.z, plane);
    }

    function unionSDF(a: vec4, b: vec4): vec4 {
        return a.w < b.w ? a : b;
    }

    function EstimateNormal(z: vec3, eps: number): vec3 {
        let z1 = add(z, new vec3(eps, 0, 0));
        let z2 = sub(z, new vec3(eps, 0, 0));
        let z3 = add(z, new vec3(0, eps, 0));
        let z4 = sub(z, new vec3(0, eps, 0));
        let z5 = add(z, new vec3(0, 0, eps));
        let z6 = sub(z, new vec3(0, 0, eps));
        if (!(z1 instanceof vec3 && z2 instanceof vec3 && z3 instanceof vec3
            && z4 instanceof vec3 && z5 instanceof vec3 && z6 instanceof vec3)
        ) throw Error("sonething went wrong");
        let dx = map(z1).w - map(z2).w;
        let dy = map(z3).w - map(z4).w;
        let dz = map(z5).w - map(z6).w;
        let v = normalize(new vec3(dx, dy, dz))
        if (!(v instanceof vec3)) throw Error("sonething went wrong");
        return v;
    }
    
    function getSoftShadow(p: vec3, lightPos: vec3): number {
        let res = 1.0;
        let dist = 0.01;
        let lightSize = 0.03;
    
        for (let i = 0; i < 100 / 5; i++) {
            let v = mul(add(p, lightPos), dist);
            if (!(v instanceof vec3)) throw Error("sonething went wrong");
            let hit = map(v).w;
    
            res = Math.min(res, hit / (dist * lightSize));
            dist += hit;
            if (hit < 1e-3 * 1e-3 || dist > 50) break;
        }
    
        return clamp(res, 0.0, 1.0);
    }
    
    function getLight(pos: vec3, rd: vec3, color: vec3): vec3 {
        let lightPos = new vec3(1.0, -2.0, -5.0);
        let l = sub(lightPos, pos);
        if (!(l instanceof vec3)) throw Error("something went wrong");
        let L = normalize(l);
        let N = EstimateNormal(pos, 1e-3);
        let V = mul(-1, rd);
    
        let specColor = new vec3(0.5);
        let ambient = mul(0.05, color);
        let fresnel = mul(mul(0.15, color), Math.pow(1.0 + dot(rd, N), 3.0));
    
        let v = add(pos, mul(N, 0.02));
        let v1 = normalize(lightPos);
        if (!(v instanceof vec3 && v1 instanceof vec3)) throw Error("sonething went wrong");
        let shadow = getSoftShadow(v, v1);
    
        let dif = mul(color, clamp(dot(N, L), 0.1, 1.0));

        v = dif;
        if (!(v instanceof vec3)) throw Error("sonething went wrong");
        return v;
    }

    function map(p: vec3): vec4 {
        let scene = new vec4(1.0);
    
        let sphere = sdf_sphere(p, new vec3(0.0, 0.0, 0.0), new vec3(0.0, 0.0, 1.0), 2.0);
        let plain = sdf_plane(p, new vec3(1.0, 1.0, 1.0), new vec3(0.0, 1.0, 0.0), 1.5, true);

        scene = unionSDF(scene, sphere);
    
        return scene;
    }

    function render(uv: vec2, x: number, y: number): vec3{
        let ro = new vec3(0.0, -2.0, -5.0);
        let rd = normalize(new vec3(uv.x, uv.y, 1.0));
    
        let background = new vec3(0.4, 0.7, 0.9);
        let pixel = new vec3(0.0);
        let pixelInfo = new vec4(0.1); // color(r, g, b), distance;
    
        let p = new vec3(0.0);
        let t = 0.0;
    
        for (let i = 0; i < 500; i++) {
            let v = add(ro, mul(rd, t));
            if (!(v instanceof vec3)) throw Error("Something wrong");
            p = v;
            pixelInfo = map(p);
    
            t += pixelInfo.w; // distance
            if (t > 50 || pixelInfo.w < 1e-3) break;
        }
    
        if (t < 50){
            if (!(rd instanceof vec3)) throw Error("Something wrong");
            pixel = getLight(p, rd, new vec3(pixelInfo.x, pixelInfo.y, pixelInfo.z));
            let v = mix(pixel, background, 1.0 - Math.exp(-1e-4 * t * t * t));
            if (!(v instanceof vec3)) throw Error("Something wrong");
            pixel = v;
        }else {
            let v = sub(div(background, pixelInfo.w), Math.max(0.9 * rd.y, 0.0));
            if (!(v instanceof vec3)) throw Error("Something wrong");
            pixel = v;
        }
    
        return pixel;
    }

    function RealColorToUint32(color: vec4) : vec4{
        let red = Math.max(0, Math.min(255, color.x * 255.0));
        let green = Math.max(0, Math.min(255, color.y * 255.0));
        let blue = Math.max(0, Math.min(255, color.z * 255.0));
        let alpha = Math.max(0, Math.min(255, color.w * 255.0));

        return new vec4(red, green, blue, alpha);
    }

    function drawFrame() {
        if (!canvasContext) return; 

        // defining loading state
        canvasContext.fillStyle = "green";
        canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);

        // creating an image

        const imgData = canvasContext.createImageData(props.width, props.height);

        for(let y = 0; y < props.height; y++){
            for(let x = 0; x < props.width; x++){
                let index = 4 * (y * props.width + x);

                let uv = getUV(new vec2(0.0), x, y, props.width, props.height);
                let pixel = render(uv, x, y);

                // We have RGBA that takes 32 bits per index in total

                let color = RealColorToUint32(new vec4(pixel.x, pixel.y, pixel.z, 1.0));
                imgData.data[index + 0] = color.x;
                imgData.data[index + 1] = color.y;
                imgData.data[index + 2] = color.z;
                imgData.data[index + 3] = color.w;
            }
            console.log(y);
        }
        canvasContext.putImageData(imgData, 0, 0);
    }
    
    return (
        <div>
            <canvas ref={canvasRef} onClick={drawFrame} width={props.width} height={props.height}></canvas>
        </div>
    )
}