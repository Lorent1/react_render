import { Plane, Sphere, Scene, Box, RoundBox, MengerSponge, Mandelbulb } from "../objects";
import { vec3, vec4 } from "vectors_litemath";
import { ICamera, IEnvironment, IOperations } from "../types";


function checkField(data: object, field: string){
    if(!(field in data)){
        throw Error("No " + field + " field in json");
    }
}

function checkArrayValue(data: object, field: string){
    if(!(data instanceof Array && data.length == 3)){
        throw Error("Can't convert " + field + " to vec3");
    }
}

function to_vec3(data: Array<number>){
    return new vec3(data[0], data[1], data[2]);
}



function checkJSON(json: string){
    const data = JSON.parse(json);

    checkField(data, "environment");
    checkField(data, "camera");
    checkField(data, "objects");
    checkField(data, "operations");

    checkField(data.environment, "background-color");
    checkField(data.environment, "light-position");

    checkArrayValue(data.environment["background-color"], "background-color");
    checkArrayValue(data.environment["light-position"], "light-position");

    checkField(data.camera, "position");
    checkField(data.camera, "lookAt");
    checkField(data.camera, "FOV");
    
    checkArrayValue(data.camera["position"], "position");
    checkArrayValue(data.camera["lookAt"], "lookAt");

    if(!(data.objects instanceof Object)){
        throw Error("Objects must be object");
    }

    let names = new Map<string, number>();
    names.set("scene", 1);

    for(let key in data.objects){
        checkField(data.objects[key], "position");
        checkField(data.objects[key], "color");

        checkArrayValue(data.objects[key]["position"], "position");
        checkArrayValue(data.objects[key]["color"], "color");

        if(data.objects[key] == "sphere"){
            checkField(data.object[key], "radius");

            if(data.objects[key]["radius"] < 0){
                throw Error("Radius can't be negative!");
            }
        }

        if(data.objects[key]["type"] == "plane"){
            checkField(data.objects[key], "h");
            checkField(data.objects[key], "isCelled");
            checkField(data.objects[key], "n");

            checkArrayValue(data.objects[key]["n"], "n");
        }

        if (data.objects[key]["type"] == "box"){
            checkField(data.objects[key], "side");

            checkArrayValue(data.objects[key]["side"], "side");

            if(data.objects[key]["side"][0] < 0 || data.objects[key]["side"][1] < 0 || data.objects[key]["side"][2] < 0){
                throw Error("Side can't be negative!");
            }
        }

        if (data.objects[key]["type"] == "roundBox"){
            checkField(data.objects[key], "side");
            checkField(data.objects[key], "radius");

            checkArrayValue(data.objects[key]["side"], "side");
            if(data.objects[key]["side"][0] < 0 || data.objects[key]["side"][1] < 0 || data.objects[key]["side"][2] < 0){
                throw Error("Side can't be negative!");
            }
            if(data.objects[key]["radius"] < 0){
                throw Error("Radius can't be negative!");
            }
        }

        if (data.objects[key]["type"] == "mengerSponge"){
            checkField(data.objects[key], "side");
            checkField(data.objects[key], "scale");

            checkArrayValue(data.objects[key]["side"], "side");

            if(data.objects[key]["side"][0] < 0 || data.objects[key]["side"][1] < 0 || data.objects[key]["side"][2] < 0){
                throw Error("Side can't be negative!");
            }
        }

        if (data.objects[key]["type"] == "mandelbulb"){
            checkField(data.objects[key], "power");
            checkField(data.objects[key], "scale");
        }

        names.set(key, 1);
    }

    if(!(data.operations instanceof Array)){
        throw Error("Objects must be array");
    }

    for(let key in data.operations){
        checkField(data.operations[key], "type");

        for(let i = 1; i <= 2; i++){
            checkField(data.operations[key], "obj" + i);
            let name = data.operations[key]["obj" + i];

            if(!(names.has(name))){
                throw Error("Can't find " + name + " object");
            }
        }
    }
}

export function parseJSON(json: string, objects: Map<string, any>, operations: Array<IOperations>, camera: ICamera, environment: IEnvironment){
    checkJSON(json);

    const data = JSON.parse(json);

    for(let key in data.objects){
        let obj;
        let position = to_vec3(data.objects[key]["position"]);
        let color = to_vec3(data.objects[key]["color"]);
        color = vec3.div(color, 255);

        if(data.objects[key]["type"] == "sphere"){
            let radius = data.objects[key]["radius"];
            obj = new Sphere(position, color, radius);
        }

        if(data.objects[key]["type"] == "plane"){
            let h = data.objects[key]["h"];
            let isCelled = data.objects[key]["isCelled"];
            let n = to_vec3(data.objects[key]["n"]);
            obj = new Plane(position, color, n, h, isCelled);
        }

        if (data.objects[key]["type"] == "box"){
            let side = data.objects[key]["side"];
            obj = new Box(position, color, side);
        }

        if (data.objects[key]["type"] == "roundBox"){
            let side = data.objects[key]["side"];
            let radius = data.objects[key]["radius"];
            obj = new RoundBox(position, color, side, radius);
        }

        if (data.objects[key]["type"] == "mengerSponge"){
            let side = data.objects[key]["side"];
            let scale = data.objects[key]["scale"];
            obj = new MengerSponge(position, color, side, scale);
        }

        if (data.objects[key]["type"] == "mandelbulb"){
            let power = data.objects[key]["power"];
            let scale = data.objects[key]["scale"];
            obj = new Mandelbulb(position, color, power, scale);
        }

        objects.set(key, obj);
    }

    // default objects
    objects.set("scene", new Scene(new vec4(1.0, 1.0, 1.0, 51.0)));
    objects.set("tmp", new Scene(new vec4(1.0, 1.0, 1.0, 51.0)));

    for(let i = 0; i < data.operations.length; i++){
        let dict = {
            "type": data.operations[i]["type"],
            "obj1": data.operations[i]["obj1"],
            "obj2": data.operations[i]["obj2"]
        }
        operations.push(dict);
    }

    camera.position = to_vec3(data.camera["position"]);
    camera.lookAt = to_vec3(data.camera["lookAt"]);
    camera.FOV = data.camera["FOV"];

    environment.background_color = to_vec3(data.environment["background-color"]);
    environment.background_color = vec3.div(environment.background_color, 255);
    environment.light_position = to_vec3(data.environment["light-position"]);
}