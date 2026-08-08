import {GradumIcon, div, span, GradumRichElement, GradumButton, Color
} from "../../../../../build/gradum-kit.esm";
import {box} from "../../demoBox/demoBox";
import "./richElement.css";

function richTest1() {
    // Basics: element as text, left/right icons, prefix/suffix strings
    const r1 = GradumRichElement.create({
        text: "Hello world",
        leftIcon: "chevron-left",
        rightIcon: "chevron-top",
        prefixEntry: "pre",
        suffixEntry: "suf"
    });

    box("RichElement — Basics")
        .addSubBox("basic composition", r1);
}

function richTest2() {
    // String→in-place update (prefix/suffix), icon string→instance reuse
    const r = GradumRichElement.create({
        text: "Editable",
        leftIcon: "link",
        rightIcon: "share",
        prefixEntry: "prefix",
        suffixEntry: "suffix"
    });

    box("RichElement — in-place updates")
        .addSubBox("start", r)
        .addContent(GradumButton.create({
            text: "prefix = 'PRE*'",
            onClick: () => r.prefixEntry = "PRE*"
        }))
        .addContent(GradumButton.create({
            text: "suffix = 'SUF*'",
            onClick: () => r.suffixEntry = "SUF*"
        }))
        .addContent(GradumButton.create({
            text: "leftIcon = 'chevron-top' (reuses instance)",
            onClick: () => r.leftIcon = "chevron-top"
        }))
        .addContent(GradumButton.create({
            text: "rightIcon = 'chevron-left' (reuses instance)",
            onClick: () => r.rightIcon = "chevron-left"
        }))
        .addContent(GradumButton.create({
            text: "text = 'Updated!'",
            onClick: () => r.text = "Updated!"
        }));
}

function richTest3() {
    const r = GradumRichElement.create({
        text: "Clear parts",
        leftIcon: "link",
        rightIcon: "share",
        prefixEntry: "PRE",
        suffixEntry: "SUF",
    });

    box("RichElement — clearing parts")
        .addSubBox("start (fully loaded)", r)
        .addContent(GradumButton.create({
            text: "leftIcon = null",
            onClick: () => r.leftIcon = null
        }))
        .addContent(GradumButton.create({
            text: "rightIcon = null",
            onClick: () => r.rightIcon = null
        }))
        .addContent(GradumButton.create({
            text: "prefixEntry = null",
            onClick: () => r.prefixEntry = null
        }))
        .addContent(GradumButton.create({
            text: "suffixEntry = null",
            onClick: () => r.suffixEntry = null
        }))
        .addContent(GradumButton.create({
            text: "restore all",
            onClick: () => {
                r.leftIcon = "link";
                r.rightIcon = "share";
                r.prefixEntry = "PRE";
                r.suffixEntry = "SUF";
            }
        }));
}

function richTest4() {
    // Replace center element with custom element; also provide via object props
    const r = GradumRichElement.create({text: "Center text"});

    box("RichElement — center replacement")
        .addSubBox("start", r)
        .addContent(GradumButton.create({
            text: "element = pill('CENTER')",
            onClick: () => r.element = div({text: "CENTER", style: "background: " + Color.random().toString(), classes: "pill"})
        }))
        .addContent(GradumButton.create({
            text: "element = { tag:'span', text:'from props' }",
            onClick: () => r.element = {tag: "span", text: "from props"}
        }))
        .addContent(GradumButton.create({
            text: "element = 'Back to string'",
            onClick: () => r.element = "Back to string"
        }));
}

function richTest5() {
    // Left/Right custom elements array + ordering check
    const r = GradumRichElement.create({
        text: "Order matters",
        leftIcon: "link",
        rightIcon: "share",
    });

    box("RichElement — custom elements & order")
        .addSubBox("base", r)
        .addContent(GradumButton.create({
            text: "leftCustomElements = [pill('L1'), pill('L2')]",
            onClick: () => r.leftCustomElements = [
                div({text: "L1", style: "background: " + Color.random().toString(), classes: "pill"}),
                div({text: "L2", style: "background: " + Color.random().toString(), classes: "pill"})
            ]
        }))
        .addContent(GradumButton.create({
            text: "rightCustomElements = [pill('R1')]",
            onClick: () => r.rightCustomElements = div({
                text: "R1",
                style: "background: " + Color.random().toString(),
                classes: "pill"
            })
        }))
        .addContent(GradumButton.create({
            text: "prefixEntry = 'P:'; suffixEntry = ':S'",
            onClick: () => {
                r.prefixEntry = "P:";
                r.suffixEntry = ":S";
            }
        }))
        .addContent(GradumButton.create({
            text: "Swap text",
            onClick: () => r.text = "Order still good?"
        }));
}

function richTest6() {
    // Icon instances reuse & property updates on the instance
    const left = GradumIcon.create({icon: "chevron-left", type: "svg"}) as GradumIcon;
    const right = GradumIcon.create({icon: "chevron-top", type: "svg"}) as GradumIcon;

    const r = GradumRichElement.create({
        text: "Reuse icon instances",
        leftIcon: left,
        rightIcon: right
    });

    box("RichElement — icon instance reuse")
        .addSubBox("start", r)
        .addContent(GradumButton.create({
            text: "leftIcon.icon = 'link'",
            onClick: () => left.icon = "link"
        }))
        .addContent(GradumButton.create({
            text: "rightIcon.icon = 'share'",
            onClick: () => right.icon = "share"
        }))
        .addContent(GradumButton.create({
            text: "replace leftIcon with string (new)",
            onClick: () => r.leftIcon = "photo"
        }))
        .addContent(GradumButton.create({
            text: "replace rightIcon with instance (back)",
            onClick: () => r.rightIcon = right
        }));
}

function richTest7() {
    // Stress: rapid flips across all parts to smoke test addAtPosition & cleanup
    const r = GradumRichElement.create({
        text: "Stress me",
        leftIcon: "link",
        rightIcon: "share",
        prefixEntry: "pre",
        suffixEntry: "suf"
    });

    box("RichElement — stress / race-ish")
        .addSubBox("start", r)
        .addContent(GradumButton.create({
            text: "Rapid flip 12x",
            onClick: () => {
                let i = 0;
                const id = setInterval(() => {
                    r.text = "Tick " + i;
                    r.prefixEntry = (i % 2) ? "P" : "PRE";
                    r.suffixEntry = (i % 3) ? "S" : "SUF";
                    r.leftIcon = (i % 2) ? "chevron-top" : "chevron-left";
                    r.rightIcon = (i % 2) ? "share" : "link";
                    if (++i > 12) clearInterval(id);
                }, 80);
            }
        }));
}

function richTest8() {
    // Transition between strings and HTMLElements for prefix/suffix
    const r = GradumRichElement.create({text: "Hybrid prefix/suffix"});

    box("RichElement — prefix/suffix hybrids")
        .addSubBox("start", r)
        .addContent(GradumButton.create({
            text: "prefixEntry = pill('PILL')",
            onClick: () => r.prefixEntry = div({text: "PILL", style: "background: " + Color.random().toString(), classes: "pill"})
        }))
        .addContent(GradumButton.create({
            text: "prefixEntry = 'pre again'",
            onClick: () => r.prefixEntry = "pre again"
        }))
        .addContent(GradumButton.create({
            text: "suffixEntry = span('ok')",
            onClick: () => r.suffixEntry = span({text: "ok"})
        }))
        .addContent(GradumButton.create({
            text: "suffixEntry = 'suf again'",
            onClick: () => r.suffixEntry = "suf again"
        }));
}

export function setupRichElementTests() {
    richTest1();
    richTest2();
    richTest3();
    richTest4();
    richTest5();
    richTest6();
    richTest7();
    richTest8();
}