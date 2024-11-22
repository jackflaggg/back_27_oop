import {Schema} from "mongoose";
import {pluginId} from "./plugin";

export function initPlugin(schemas: Schema[]){
    for (let schema of schemas) {
        schema.plugin(pluginId);
    }
}