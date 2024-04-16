import { vec3 } from "vectors_litemath"

export interface IOperations {
    type: string,
    obj1: string,
    obj2: string
}

export interface ICamera {
    position: vec3,
    lookAt: vec3,
    FOV: number
}

export interface IEnvironment{
    background_color: vec3,
    light_position: vec3
}