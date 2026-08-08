import {define, Point} from "../../../../build/gradum-kit.esm";
import "./triangle.css";
import {Square} from "../square/square";
import {TriangleView} from "./triangle.view";

//Custom square element, defined as a custom element
export class Triangle extends Square {
    public static defaultProperties = {
        ...super.defaultProperties,
        view: TriangleView
    };

    public move(delta: Point) {
        this.model.position = this.model.position.add(delta.mul(2));
    }
}

define(Triangle, "demo-triangle");