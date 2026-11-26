import {div, element, GradumButton, GradumIcon, h1, h3, img, input, p, span, SvgNamespace, video} from "../../../build/gradum-kit.esm";

//=====================================================================================================================
// 1. CREATING ELEMENTS
//=====================================================================================================================

//== Plain elements: one function per tag ==============================================================================
div(); p(); span(); h1(); img(); input(); video();   //...and many more.

//They all take the same properties object.
div({
    id: "myDiv",
    classes: "rounded big",              //String or array.
    style: "background-color: red",
    text: "Hello",
    parent: document.body,
    children: [h1({text: "Hello"}), h3({text: "world"})],
    onClick: () => console.log("clicked"),
});

//== Any tag ===========================================================================================================
element({tag: "section"});
element({tag: "svg", namespace: SvgNamespace});

//== Components (the toolkit's or yours): static create() ==============================================================
GradumButton.create({text: "Click"});
GradumIcon.create({icon: "arrow-left"});   //Loaded by name from the icons directory.
