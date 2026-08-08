import {define, Point} from "../../../../build/gradum-kit.esm";
import "./circle.css";
import {Square} from "../square/square";

//Custom square element, defined as a custom element
export class Circle extends Square {
    public move(delta: Point) {
        this.model.position = this.model.position.sub(delta);
    }
}

define(Circle, "demo-circle");