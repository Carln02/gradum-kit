import {div, gradum} from "../../../build/gradum-kit.esm";

//=====================================================================================================================
// 3. CLASSES AND STYLES — like the native APIs, but chainable, forgiving, and taking strings or arrays.
//=====================================================================================================================

const el = div();

//== Classes ===========================================================================================================
gradum(el)
    .addClass("class1 class2 class3")      //Space-separated string...
    .removeClass(["class1", "class2"])     //...or array.
    .toggleClass("class3")
    .toggleClass("locked", true);          //Force on/off. Handy inside an @effect.
gradum(el).hasClass("class1");

//== Styles ============================================================================================================
gradum(el)
    .setStyle("backgroundColor", "red")    //camelCase, like el.style.
    .setStyles({width: "100px", height: "50px"});

//== Visibility ========================================================================================================
gradum(el).show(false);
gradum(el).isShown;
