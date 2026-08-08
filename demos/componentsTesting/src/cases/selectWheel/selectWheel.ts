import { GradumSelectWheel, GradumButton, GradumRichElement
} from "../../../../../build/gradum-kit.esm";
import { box } from "../../demoBox/demoBox";
import "./selectWheel.css";

function selectWheelTest1() {
    const wheel = GradumSelectWheel.create({});
    wheel.values = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"];

    box("GradumSelectWheel — Basics")
        .addSubBox("wheel", wheel)
        .addContent(GradumButton.create({
            text: "Select Beta",
            onClick: () => wheel.select.select("Beta")
        }))
        .addContent(GradumButton.create({
            text: "selectByIndex(2)",
            onClick: () => wheel.select.selectByIndex(2)
        }))
        .addContent(GradumButton.create({
            text: "Log selected",
            onClick: () => console.log("[wheel1] selected:", wheel.selectedValue)
        }));
}

function selectWheelTest2() {
    const wheel = GradumSelectWheel.create({});
    wheel.alwaysOpen = true;
    wheel.values = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    box("GradumSelectWheel — alwaysOpen")
        .addSubBox("wheel (always visible)", wheel)
        .addContent(GradumButton.create({
            text: "Log selected",
            onClick: () => console.log("[wheel2] selected:", wheel.selectedValue)
        }))
        .addContent(GradumButton.create({
            text: "alwaysOpen = false",
            onClick: () => wheel.alwaysOpen = false
        }))
        .addContent(GradumButton.create({
            text: "alwaysOpen = true",
            onClick: () => wheel.alwaysOpen = true
        }));
}

// Tests Bug 2 fix (zero-size retry) and removeEntry.
// The wheel starts populated. Entries added/removed dynamically should size correctly.
function selectWheelTest3() {
    const initialValues = ["One", "Two", "Three"];
    const wheel = GradumSelectWheel.create({});
    wheel.alwaysOpen = true;
    wheel.values = [...initialValues];

    box("GradumSelectWheel — Dynamic add/remove (Bug 2: size retry)")
        .addSubBox("wheel", wheel)
        .addContent(GradumButton.create({
            text: "Add 'Four'",
            onClick: () => { wheel.values = [...wheel.values as string[], "Four"]; }
        }))
        .addContent(GradumButton.create({
            text: "Remove last entry",
            onClick: () => {
                const last = wheel.entries[wheel.entries.length - 1];
                if (last) wheel.select.removeEntry(last as any);
            }
        }))
        .addContent(GradumButton.create({
            text: "Clear all",
            onClick: () => { wheel.values = []; }
        }))
        .addContent(GradumButton.create({
            text: "Restore original",
            onClick: () => { wheel.values = [...initialValues]; }
        }))
        .addContent(GradumButton.create({
            text: "Log selected",
            onClick: () => console.log("[wheel3] selected:", wheel.selectedValue)
        }));
}

// Tests Bug 1 fix (drag propagation isolation).
// A parent div has a border that turns red if it receives a dragStart behavior.
// Dragging the wheel entries should NOT trigger the parent's drag — border stays neutral.
function selectWheelTest4() {
    const wheel = GradumSelectWheel.create({});
    wheel.alwaysOpen = true;
    wheel.values = ["North", "South", "East", "West", "Centre"];

    const status = GradumRichElement.create({text: "Parent drag: NOT fired ✓"}) as HTMLElement;
    (status as HTMLElement).style.cssText = "padding:6px 10px; border-radius:4px; background:#d4f5d4; color:#1a6b1a; font-size:12px;";

    const parent = document.createElement("div");
    parent.style.cssText = "padding:16px; border:2px solid #aaa; border-radius:8px; display:inline-flex; flex-direction:column; gap:8px; align-items:flex-start;";
    parent.appendChild(wheel as unknown as Node);
    parent.appendChild(status);

    // Simulate what a parent Card behavior would do
    parent.addEventListener("gradum-drag-start", () => {
        parent.style.borderColor = "#e55";
        (status as HTMLElement).textContent = "Parent drag: FIRED ✗ (Bug 1 regression!)";
        (status as HTMLElement).style.background = "#fdd";
        (status as HTMLElement).style.color = "#a00";
    }, {capture: false});

    box("GradumSelectWheel — Drag propagation isolation (Bug 1)")
        .addContent(parent)
        .addContent(GradumButton.create({
            text: "Reset indicator",
            onClick: () => {
                parent.style.borderColor = "#aaa";
                (status as HTMLElement).textContent = "Parent drag: NOT fired ✓";
                (status as HTMLElement).style.background = "#d4f5d4";
                (status as HTMLElement).style.color = "#1a6b1a";
            }
        }))
        .addContent(GradumButton.create({
            text: "Log selected",
            onClick: () => console.log("[wheel4] selected:", wheel.selectedValue)
        }));
}

// Tests that dragging is smooth (no transition lag) — the wheel should track your finger instantly.
function selectWheelTest5() {
    const wheel = GradumSelectWheel.create({});
    wheel.alwaysOpen = true;
    wheel.transitionDuration = 0.4;
    wheel.values = ["🍎 Apple", "🍋 Lemon", "🍇 Grape", "🍊 Orange", "🍓 Berry", "🥝 Kiwi", "🍑 Peach"];

    box("GradumSelectWheel — Drag smoothness (transition disabled during drag)")
        .addSubBox("wheel", wheel)
        .addContent(GradumButton.create({
            text: "transition 0.1s",
            onClick: () => wheel.transitionDuration = 0.1
        }))
        .addContent(GradumButton.create({
            text: "transition 0.4s",
            onClick: () => wheel.transitionDuration = 0.4
        }))
        .addContent(GradumButton.create({
            text: "transition 1s",
            onClick: () => wheel.transitionDuration = 1
        }))
        .addContent(GradumButton.create({
            text: "Log selected",
            onClick: () => console.log("[wheel5] selected:", wheel.selectedValue)
        }));
}

export function setupSelectWheelTests() {
    selectWheelTest1();
    selectWheelTest2();
    selectWheelTest3();
    selectWheelTest4();
    selectWheelTest5();
}
