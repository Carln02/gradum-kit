import {define, div, effect, gradum, signal} from "../../../../build/gradum-kit.esm";
import {Circle} from "../circle/circle";
import "./clock.css";

export class Clock extends Circle {
    @signal protected now: Date = new Date();
    protected timer: ReturnType<typeof setInterval>;

    protected hourHand: HTMLElement;
    protected minuteHand: HTMLElement;
    protected secondHand: HTMLElement;

    public initialize() {
        super.initialize();
        this.onAttach.add(() => this.timer = setInterval(() => this.now = new Date(), 1000));
        this.onDetach.add(() => clearInterval(this.timer));
    }

    protected setupUIElements() {
        super.setupUIElements();
        this.hourHand = div({classes: "clock-hand clock-hour"});
        this.minuteHand = div({classes: "clock-hand clock-minute"});
        this.secondHand = div({classes: "clock-hand clock-second"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild([this.hourHand, this.minuteHand, this.secondHand]);
    }

    @effect protected updateHands() {
        const seconds = this.now.getSeconds();
        const minutes = this.now.getMinutes() + seconds / 60;
        const hours = this.now.getHours() % 12 + minutes / 60;
        this.hourHand.style.rotate = hours * 30 + "deg";
        this.minuteHand.style.rotate = minutes * 6 + "deg";
        this.secondHand.style.rotate = seconds * 6 + "deg";
    }
}

define(Clock, "my-clock");
