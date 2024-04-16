import styles from "../styles/page.module.css";
import MyCanvas from "./canvas";
import { useRef } from "react";
import { vec4, vec3 } from "vectors_litemath";
import { parseJSON } from "../functions/json_functions";
import { smoothUnion, unionSDF } from "../functions/sdf_functions";
import { Plane, Scene, Sphere, Box } from "../objects";
import { ICamera, IEnvironment, IOperations } from "../types";

type CanvasHandler = {
    drawFrame: (w: number, h: number) => Promise<void>;
}

interface props {
    json: string;
    showErrorModal: (err: string) => void;
}


export default function RenderBox(props: props){
    
    const ref = useRef<CanvasHandler>(null);
    let objects = new Map<string, object>();
    let operations = new Array<IOperations>();
    let camera: ICamera = {position: new vec3(0.0), lookAt: new vec3(0.0), FOV: 1};
    let environment: IEnvironment = {background_color: new vec3(0.4, 0.7, 0.9), light_position: new vec3(1, -2, -5)}

    function render(){
        if(ref.current == null) return;
        
        try{
            parseJSON(props.json, objects, operations, camera, environment);
            ref.current.drawFrame(200, 200);
        }catch(err){
            if (err instanceof Error) props.showErrorModal(err.message);
        }
    }

    function getObject(obj: object | undefined, p: vec3): vec4{
        if (obj instanceof Plane || obj instanceof Sphere || obj instanceof Box){
            return obj.createObject(p);
        }
        if (obj instanceof Scene){
            return obj.getValue();
        }
        throw Error("Invalid type" + obj);
    }

    function map(p: vec3): vec4 {
        // because of the min function in unionSDF(most used one) default distance value should be big
        // to make sure union returns distance from an object, not a default value
        // setting it to 51(MAX_DISTANCE + 1) speeds up rendering by up to 300 %
        // as we don't need to count new distance for pixels without objects
        let scene = new vec4(1.0, 1.0, 1.0, 51.0);
        let tmp = new vec4(1.0, 1.0, 1.0, 51.0)

        for(let i = 0; i < operations.length; i++){
            let obj1_name = operations[i]["obj1"];
            let obj2_name = operations[i]["obj2"];

            let obj1: vec4 = getObject(objects.get(obj1_name), p);
            let obj2: vec4 = getObject(objects.get(obj2_name), p);

            if(operations[i]["type"] == "union"){
                if (obj1_name == "scene") {scene = unionSDF(scene, obj2)}
                else if (obj2_name == "scene") { scene = unionSDF(obj1, scene)}
                else if(obj1_name == "tmp" ){ tmp = unionSDF(tmp, obj2) }
                else if(obj2_name == "tmp"){ tmp = unionSDF(obj1, tmp)}
                else{tmp = unionSDF(obj1, obj2)}
            }
        }
    
        return scene;
    }


    return(
        <div className={styles.renderBox}>
            <header className={styles.renderBoxHeader}>
                <div style={{width: "70%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <p>Resolution:</p>
                    <input></input>
                    <input></input>
                </div>
                <button className={styles.renderButton} onClick={render}>Render!</button>
            </header>
            <MyCanvas width={400} height={400} map={map} camera={camera} environment={environment} ref={ref}></MyCanvas>
        </div>  
    )
}