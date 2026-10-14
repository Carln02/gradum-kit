import {
    $, div, span, GradumInput, GradumNumericalInput, GradumButton
} from "../../../../../build/gradum-kit.esm";
import {box} from "../../demoBox/demoBox";
import {DefaultEventName} from "../../../../../build/gradum-kit.esm";
import "./input.css";

const valueProbe = (label: string, el: any) => {
    const wrap = div({class: "case-entry"});
    const l = span({text: label + ": "});
    const v = span({text: ""});
    const r = span({text: ""});

    const sep = span({text: "  |  "});
    wrap.append(l, v, sep, r);

    const update = () => {
        v.textContent = `value = ${String(el.value)} (${typeof el.value})`;
        r.textContent = `stringValue = "${el["element"]?.value ?? ""}"`;
    };

    // initial & on input
    update();
    $(el).on(DefaultEventName.input, update);

    return wrap;
};

/* 1) Basics: label, default input, clicking label focuses input, programmatic value */
function inputTest1() {
    const ti = GradumInput.create({
        label: "Your name",
        input: {placeholder: "type here…"}
    });

    box("GradumInput.create( — Basics")
        .addSubBox("basic field", ti)
        .addContent(valueProbe("probe", ti))
        .addContent(GradumButton.create({
            text: 'value="Ada"',
            onClick: () => {
                ti.value = "Ada";
            }
        }))
        .addContent(GradumButton.create({
            text: 'element.placeholder="Hello!"',
            onClick: () => {
                ti.element.placeholder = "Hello!";
            }
        }));
}

/* 2) Label/id wiring & late element creation */
function inputTest2() {
    const ti = GradumInput.create({
        // no element.id provided -> GradumInput.create( should assign defaultId
        label: "Has for/id wiring"
    });

    box("GradumInput.create( — label <-> input id")
        .addSubBox("for/id link", ti)
        .addContent(GradumButton.create({
            text: "log label.htmlFor & element.id",
            onClick: () => {
                // @ts-ignore
                const labelEl = (ti as any).labelElement as HTMLLabelElement;
                console.log("label.for =", labelEl?.htmlFor, "element.id =", ti.element?.id);
            }
        }))
        .addContent(GradumButton.create({
            text: "assign explicit id",
            onClick: () => {
                ti.element.id = "custom-id-123";
                // @ts-ignore
                const labelEl = (ti as any).labelElement as HTMLLabelElement;
                if (labelEl) labelEl.htmlFor = ti.element.id;
            }
        }));
}

/* 3) elementTag swap: input <-> textarea + dynamicVerticalResize */
function inputTest3() {
    const ti = GradumInput.create({
        label: "Multi-line",
        inputTag: "textarea" as any, //TODO FIX
        input: {rows: 2, placeholder: "Type multiple lines…"}
    });

    ti.dynamicVerticalResize = true;

    box("GradumInput.create( — textarea & auto-resize")
        .addSubBox("textarea (auto-resize)", ti)
        .addContent(valueProbe("probe", ti));
}

/* 4) Focus behavior: selectTextOnFocus & locked */
function inputTest4() {
    const ti = GradumInput.create({
        label: "Focus behavior",
        input: {value: "Select me on focus"}
    });

    box("GradumInput.create( — focus modes")
        .addSubBox("field", ti)
        .addContent(GradumButton.create({
            text: "selectTextOnFocus = true",
            onClick: () => {
                ti.selectTextOnFocus = true;
                ti.element.focus();
            }
        }))
        .addContent(GradumButton.create({
            text: "selectTextOnFocus = false",
            onClick: () => {
                ti.selectTextOnFocus = false;
            }
        }))
        .addContent(GradumButton.create({
            text: "locked = true (blur on focus)",
            onClick: () => {
                ti.locked = true;
                ti.element.focus();
            }
        }))
        .addContent(GradumButton.create({
            text: "locked = false",
            onClick: () => {
                ti.locked = false;
            }
        }));
}

/* 5) Regex guards: inputRegexCheck + blurRegexCheck */
function inputTest5() {
    const ti = GradumInput.create({
        label: "Only lowercase letters",
        input: {placeholder: "live guard: /^[a-z]*$/"}
    });

    // live: only lowercase ascii
    ti.inputRegexCheck = /^[a-z]*$/;
    // on blur: must end with a letter (no empty), otherwise revert
    ti.blurRegexCheck = /^[a-z]+$/;

    box("GradumInput.create( — regex guards")
        .addSubBox("live (input) & final (blur)", ti)
        .addContent(valueProbe("probe", ti))
        .addContent(GradumButton.create({
            text: 'programmatic value "abc123" (will clamp live)',
            onClick: () => {
                ti.value = "abc123";
            }
        }))
        .addContent(GradumButton.create({
            text: "clear",
            onClick: () => {
                ti.value = "";
            }
        }));
}

/* 6) Programmatic vs DOM value differences */
function inputTest6() {
    const ti = GradumInput.create({label: "Programmatic vs DOM"});

    box("GradumInput.create( — programmatic vs DOM")
        .addSubBox("field", ti)
        .addContent(valueProbe("probe", ti))
        .addContent(GradumButton.create({
            text: 'ti.value = "42"',
            onClick: () => {
                ti.value = "42";
            }
        }))
        .addContent(GradumButton.create({
            text: 'element.value = "DOM-only" (no setter)',
            onClick: () => {
                ti.element.value = "DOM-only";
                ti.dispatchEvent(new InputEvent("input"));
            }
        }))
        .addContent(GradumButton.create({
            text: "reset",
            onClick: () => {
                ti.value = "";
            }
        }));
}

/* 7) Numerical: basics with live probing */
function numTest1() {
    const ni = GradumNumericalInput.create({
        label: "Number",
        inputRegexCheck: undefined, // let factory defaults handle it if omitted
        blurRegexCheck: undefined
    });

    box("GradumNumericalInput — basics")
        .addSubBox("field", ni)
        .addContent(valueProbe("probe", ni))
        .addContent(GradumButton.create({
            text: "value = 12.345",
            onClick: () => {
                ni.value = 12.345;
            }
        }))
        .addContent(GradumButton.create({
            text: "value = '-7.8' (string)",
            onClick: () => {
                ni.value = "-7.8";
            }
        }))
        .addContent(GradumButton.create({
            text: "clear",
            onClick: () => {
                ni.value = "";
            }
        }));
}

/* 8) Numerical: min/max, multiplier, decimalPlaces */
function numTest2() {
    const ni = GradumNumericalInput.create({
        label: "Scaled + clamped"
    });

    ni.multiplier = 100;
    ni.decimalPlaces = 2;
    ni.min = -50;
    ni.max = 50;

    box("GradumNumericalInput — min/max/multiplier/decimalPlaces")
        .addSubBox("field", ni)
        .addContent(valueProbe("probe (scaled view)", ni))
        .addContent(GradumButton.create({
            text: "set raw 0.1234 → shows 12.34 (x100 & rounded)",
            onClick: () => {
                ni.value = 0.1234;
            }
        }))
        .addContent(GradumButton.create({
            text: "set raw 1000 → clamped to 50",
            onClick: () => {
                ni.value = 1000;
            }
        }))
        .addContent(GradumButton.create({
            text: "set raw -999 → clamped to -50",
            onClick: () => {
                ni.value = -999;
            }
        }))
        .addContent(GradumButton.create({
            text: "multiplier = 10 (now 0.1234 → 1.23)",
            onClick: () => {
                ni.multiplier = 10;
                ni.value = 0.1234;
            }
        }))
        .addContent(GradumButton.create({
            text: "decimalPlaces = 0 (round to int)",
            onClick: () => {
                ni.decimalPlaces = 0;
                ni.value = 12.9;
            }
        }));
}

/* 9) Numerical: regex defaults smoke (factory injects if missing) */
function numTest3() {
    const ni = GradumNumericalInput.create({
        label: "Regex defaults"
    });

    box("GradumNumericalInput — regex defaults")
        .addSubBox("field", ni)
        .addContent(valueProbe("probe", ni))
        .addContent(GradumButton.create({
            text: "enter weird chars manually to test guard",
            onClick: () => {
                console.log("Type into the field to test live/blur regex.");
            }
        }));
}

function fitContentTest() {
    const b = box("GradumInput — fitContent & plain");

    const readout = div({classes: "input-readout", text: "—"});
    const report = () => {
        const widths = [fitting, fixed].map(i => Math.round(i.element.getBoundingClientRect().width));
        readout.textContent = `fitContent: ${widths[0]}px    plain default: ${widths[1]}px`;
    };

    const fitting = GradumInput.create({value: "Ada", fitContent: true, plain: true});
    const fixed = GradumInput.create({value: "Ada"});

    b.addSubBox("fitContent + plain", fitting);
    b.addSubBox("neither (for comparison)", fixed);

    //Typing into either should move the first one's width and leave the second's alone.
    $(fitting).on(DefaultEventName.input, () => setTimeout(report));
    $(fixed).on(DefaultEventName.input, () => setTimeout(report));

    for (const value of ["A", "Ada", "Ada Lovelace", "Ada Lovelace writes a long title"]) {
        b.addContent(GradumButton.create({
            text: `"${value}"`,
            onClick: () => {
                fitting.value = value;
                fixed.value = value;
                setTimeout(report);
            }
        }));
    }
    b.addContent(GradumButton.create({
        text: "Toggle fitContent",
        onClick: () => {fitting.fitContent = !fitting.fitContent; setTimeout(report);}
    }));
    b.addContent(GradumButton.create({
        text: "Toggle plain",
        onClick: () => {fitting.plain = !fitting.plain; setTimeout(report);}
    }));
    b.addContent(readout);
    setTimeout(report);
}

export function setupInputTests() {
    fitContentTest();
    inputTest1();
    inputTest2();
    inputTest3();
    inputTest4();
    inputTest5();
    inputTest6();

    numTest1();
    numTest2();
    numTest3();
}