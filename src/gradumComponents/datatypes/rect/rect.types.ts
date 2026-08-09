import {Anchor} from "../../../types/enums.types";
import {Point} from "../point/point";
import {AnchorPoint} from "../anchorPoint/anchorPoint";

/**
 * @type GradumRectProperties
 * @group Components
 * @category Data Structures
 */
type GradumRectProperties = {
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    angleRad?: number,
    angleDeg?: number,
    anchor?: Point | Anchor | AnchorPoint,
}

export {GradumRectProperties};