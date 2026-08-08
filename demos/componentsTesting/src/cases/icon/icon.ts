import {GradumIcon, GradumButton, Color, GradumIconToggle} from "../../../../../build/gradum-kit.esm";
import {box} from "../../demoBox/demoBox";
import "./icon.css";

const onLoadedLog = (prefix: string) =>
    (el: Element) => console.log(`[${prefix}] loaded`, el);

function iconTest1() {
    const icon4 = GradumIcon.create({icon: "share", type: "svg", iconColor: "#e91e63"});
    box("GradumIcon — Basics")
        .addSubBox("SVG", GradumIcon.create({icon: "link", type: "svg", onLoaded: onLoadedLog("svg")}))
        .addSubBox("Explicit ext (jpg) > type(svg)", GradumIcon.create({
            icon: "share.jpg",
            type: "svg",
            onLoaded: onLoadedLog("explicit-ext overrides type")
        }))
        .addSubBox("PNG", GradumIcon.create({icon: "photo", type: "png", onLoaded: onLoadedLog("png")}))
        .addSubBox("SVG + iconColor", icon4)
        .addContent(GradumButton.create({
            text: "Toggle color", onClick: () => icon4.iconColor = Color.random().toString()
        }));
}

function iconTest2() {
    box("GradumIcon — directory")
        .addSubBox('dir: "assets"', GradumIcon.create({directory: "assets", icon: "share", type: "svg"}))
        .addSubBox('dir: "assets/"', GradumIcon.create({directory: "assets/", icon: "share", type: "svg"}))
        .addSubBox('dir: "" + path in icon', GradumIcon.create({directory: "", icon: "assets/share", type: "svg"}));
}

function iconTest3() {
    const dyn = GradumIcon.create({icon: "share", type: "svg", onLoaded: onLoadedLog("dynamic")});
    box("GradumIcon — dynamic updates")
        .addSubBox("start", dyn)
        .addContent(GradumButton.create({text: "icon=link", onClick: () => dyn.icon = "link"}))
        .addContent(GradumButton.create({text: "type=jpg", onClick: () => dyn.type = "jpg"}))
        .addContent(GradumButton.create({text: "type=svg", onClick: () => dyn.type = "svg"}))
        .addContent(GradumButton.create({text: "dir=assets/icons", onClick: () => dyn.directory = "assets/icons"}));
}

function iconTest4() {
    const names = ["share", "link", "chevron-top", "chevron-left"];
    const racer = GradumIcon.create({icon: "share", type: "svg", onLoaded: onLoadedLog("race")});

    box("GradumIcon — async race")
        .addSubBox("racer", racer)
        .addContent(GradumButton.create({
            text: "Start race",
            onClick: () => {
                let i = 0;
                const id = setInterval(() => {
                    racer.icon = names[i % names.length];
                    racer.type = i % 2 ? "svg" : "jpg";
                    i++;
                    if (i > 12) clearInterval(id);
                }, 100);
            }
        }));
}

function iconTest5() {
    const badType = GradumIcon.create({icon: "share", type: "tiff"});
    box("GradumIcon — errors")
        .addSubBox("missing svg (expect console error)", GradumIcon.create({icon: "i-do-not-exist", type: "svg"}))
        .addContent(GradumButton.create({
            text: "Create bad type",
            onClick: () => {
                try {
                    (badType as any).type = "tiff";
                } catch (e) {
                    console.warn("[bad type] caught expected error:", e);
                }
            }
        }));
}

function iconTest6() {
    GradumIcon.customLoaders["data"] = () => {
        const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        el.setAttribute("viewBox", "0 0 24 24");
        el.innerHTML = `<circle cx="12" cy="12" r="8"></circle>`;
        el.style.width = "24px";
        el.style.height = "24px";
        return el;
    };

    box("GradumIcon — custom loader")
        .addSubBox('type="data"', GradumIcon.create({icon: "ignored-payload", type: "data", iconColor: "tomato"}));
}

function iconTest7() {
    const reUser = GradumIcon.create({icon: "photo", type: "jpg"});
    box("GradumIcon — image reuse")
        .addSubBox("re-user", reUser)
        .addContent(GradumButton.create({
            text: "flip jpg/png/jpg",
            onClick: (e, el) => {
                reUser.type = reUser.type === "jpg" ? "png" : "jpg";
                reUser.icon = reUser.icon === "photo" ? "photo2" : "photo";
            }
        }));
}

function iconTest8() {
    box("GradumIconToggle")
        .addSubBox("click me", GradumIconToggle.create({
            icon: "link",
            toggleOnClick: true, onToggle: (v) => console.log("toggle:", v)
        }));
}

export function setupIconTests() {
    iconTest1();
    iconTest2();
    iconTest3();
    iconTest4();
    iconTest5();
    iconTest6();
    iconTest7();
    iconTest8();
}