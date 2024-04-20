import styles from "../styles/page.module.css";
import MyCanvas from "./canvas";
import { useRef } from "react";
import { vec4, vec3 } from "vectors_litemath";
import { parseJSON } from "../functions/json_functions";
import { differenceSDF, intersectSDF, smoothIntersection, smoothSubtraction, smoothUnion, unionSDF } from "../functions/sdf_functions";
import { Scene, SceneObject } from "../objects";
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
        if (obj instanceof SceneObject){
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
                if (obj1_name == "scene" && obj2_name == "tmp") {scene = unionSDF(scene, tmp)}
                else if (obj1_name == "tmp" && obj2_name == "scene") {scene = unionSDF(tmp, scene)}
                else if (obj1_name == "scene") {scene = unionSDF(scene, obj2)}
                else if (obj2_name == "scene") { scene = unionSDF(obj1, scene)}
                else if(obj1_name == "tmp" ){ tmp = unionSDF(tmp, obj2) }
                else if(obj2_name == "tmp"){ tmp = unionSDF(obj1, tmp)}
                else{tmp = unionSDF(obj1, obj2)}
            }else if(operations[i]["type"] == "intersection"){
                if (obj1_name == "scene" && obj2_name == "tmp") {scene = intersectSDF(scene, tmp)}
                else if (obj1_name == "tmp" && obj2_name == "scene") {scene = intersectSDF(tmp, scene)}
                else if (obj1_name == "scene") {scene = intersectSDF(scene, obj2)}
                else if (obj2_name == "scene") { scene = intersectSDF(obj1, scene)}
                else if(obj1_name == "tmp" ){ tmp = intersectSDF(tmp, obj2) }
                else if(obj2_name == "tmp"){ tmp = intersectSDF(obj1, tmp)}
                else{tmp = intersectSDF(obj1, obj2)}
            }else if(operations[i]["type"] == "difference"){
                if (obj1_name == "scene" && obj2_name == "tmp") {scene = differenceSDF(scene, tmp)}
                else if (obj1_name == "tmp" && obj2_name == "scene") {scene = differenceSDF(tmp, scene)}
                else if (obj1_name == "scene") {scene = differenceSDF(scene, obj2)}
                else if (obj2_name == "scene") { scene = differenceSDF(obj1, scene)}
                else if(obj1_name == "tmp" ){ tmp = differenceSDF(tmp, obj2) }
                else if(obj2_name == "tmp"){ tmp = differenceSDF(obj1, tmp)}
                else{tmp = differenceSDF(obj1, obj2)}
            }else if(operations[i]["type"] == "smoothUnion"){
                let smoothness = operations[i].smoothness!;
                if (obj1_name == "scene" && obj2_name == "tmp") {scene = smoothUnion(scene, tmp, smoothness)}
                else if (obj1_name == "tmp" && obj2_name == "scene") {scene = smoothUnion(tmp, scene, smoothness)}
                else if (obj1_name == "scene") {scene = smoothUnion(scene, obj2, smoothness)}
                else if (obj2_name == "scene") { scene = smoothUnion(obj1, scene, smoothness)}
                else if(obj1_name == "tmp" ){ tmp = smoothUnion(tmp, obj2, smoothness) }
                else if(obj2_name == "tmp"){ tmp = smoothUnion(obj1, tmp, smoothness)}
                else{tmp = smoothUnion(obj1, obj2, smoothness)}
            }else if(operations[i]["type"] == "smoothSubtraction"){
                let smoothness = operations[i].smoothness!;
                if (obj1_name == "scene" && obj2_name == "tmp") {scene = smoothSubtraction(scene, tmp, smoothness)}
                else if (obj1_name == "tmp" && obj2_name == "scene") {scene = smoothSubtraction(tmp, scene, smoothness)}
                else if (obj1_name == "scene") {scene = smoothSubtraction(scene, obj2, smoothness)}
                else if (obj2_name == "scene") { scene = smoothSubtraction(obj1, scene, smoothness)}
                else if(obj1_name == "tmp" ){ tmp = smoothSubtraction(tmp, obj2, smoothness) }
                else if(obj2_name == "tmp"){ tmp = smoothSubtraction(obj1, tmp, smoothness)}
                else{tmp = smoothSubtraction(obj1, obj2, smoothness)}
            }else if(operations[i]["type"] == "smoothIntersection"){
                let smoothness = operations[i].smoothness!;
                if (obj1_name == "scene" && obj2_name == "tmp") {scene = smoothIntersection(scene, tmp, smoothness)}
                else if (obj1_name == "tmp" && obj2_name == "scene") {scene = smoothIntersection(tmp, scene, smoothness)}
                else if (obj1_name == "scene") {scene = smoothIntersection(scene, obj2, smoothness)}
                else if (obj2_name == "scene") { scene = smoothIntersection(obj1, scene, smoothness)}
                else if(obj1_name == "tmp" ){ tmp = smoothIntersection(tmp, obj2, smoothness)}
                else if(obj2_name == "tmp"){ tmp = smoothIntersection(obj1, tmp, smoothness)}
                else{tmp = smoothIntersection(obj1, obj2, smoothness)}
            }
        }
    
        return scene;
    }


    return(
        <div className={styles.renderBox}>
            <header className={styles.renderBoxHeader}>
                <div style={{width: "70%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                </div>
                <button className={styles.renderButton} onClick={render}>Render!</button>
            </header>
            <MyCanvas width={400} height={400} map={map} camera={camera} environment={environment} ref={ref}></MyCanvas>
        </div>  
    )
}