import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import { vec2, vec3, vec4, clamp} from "vectors_litemath";
import { ICamera, IEnvironment } from "../types";
import { getLight } from "../functions/light_functions";


export interface renderProps{
    width: number,
    height: number,
    camera: ICamera,
    environment: IEnvironment

    map: (p: vec3) => vec4;
}

export default forwardRef(function MyCanvas (props : renderProps, ref){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D>();
  
    useEffect(() => {
        const canvas = canvasRef.current;
  
        if(canvas == null) return;

        const context = canvas.getContext("2d");

        if (context == null) return;

        setCanvasContext(context);
    }, []);

    function getUV(offset: vec2, x: number, y: number, width: number, heigth: number): vec2 {
        let ratio = width / heigth;
        let v = vec2.sub(vec2.div(vec2.mul(vec2.sub(new vec2(x, y), offset), 2.0), new vec2(width, heigth)), 1.0);
        return vec2.mul(v, new vec2(ratio, 1.0));
    }

    function render(uv: vec2, x: number, y: number): vec3{
        let ro = props.camera.position;
        let rd = vec3.normalize(new vec3(uv.x, uv.y, props.camera.FOV));
    
        let background = props.environment.background_color;
        let pixel = new vec3(0.0);
        let pixelInfo = new vec4(0.0); // color(r, g, b), distance;
    
        let p = new vec3(0.0);
        let t = 0.0;
    
        for (let i = 0; i < 500; i++) {
            p = vec3.add(ro, vec3.mul(rd, t));
            pixelInfo = props.map(p);
    
            t += pixelInfo.w; // distance
            if (t > 50 || pixelInfo.w < 1e-3) break;
        }
    
        if (t < 50){
            pixel = getLight(p, rd, new vec3(pixelInfo.x, pixelInfo.y, pixelInfo.z), props);
            pixel = vec3.mix(pixel, background, 1.0 - Math.exp(-1e-4 * t * t * t));
        }else {
            pixel = vec3.sub(vec3.div(background, pixelInfo.w), Math.max(0.9 * rd.y, 0.0));
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

    useImperativeHandle(ref, () => ({
        drawFrame(w: number, h: number) {
            if (!canvasContext) return; 
        
            // creating an image
        
            const imgData = canvasContext.createImageData(props.width, props.height);
        
            for(let y = 0; y < props.height; y++){
                for(let x = 0; x < props.width; x++){
                    let index = 4 * (y * props.width + x);
        
                    let uv = getUV(new vec2(0.0), x, y, props.width, props.height);
                    let pixel = render(uv, x, y);
        
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
    }));
    
    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", padding: "5px"}}>
            <canvas style={{width:"100%", height: "100%"}} ref={canvasRef} width={props.width} height={props.height}></canvas>
        </div>
    )
})