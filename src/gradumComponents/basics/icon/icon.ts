import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {define} from "../../../decorators/define/define";
import {GradumView} from "../../../mvc/view/view";
import {GradumModel} from "../../../mvc/model/model";
import {GradumElement} from "../../../gradumElement/gradumElement";
import {observe} from "../../../decorators/observe/observe";
import {auto} from "../../../decorators/auto/auto";
import {img} from "../../../elementCreation/basicElements";
import {equalToAny} from "../../../utils/computations/equity";
import {GradumEmitter} from "../../../mvc/emitter/emitter";
import {cache} from "../../../decorators/cache/cache";
import {isUndefined} from "../../../utils/dataManipulation/misc";
import {getFileExtension} from "../../../utils/computations/file";
import {fetchSvg} from "../../../utils/dataManipulation/svg";
import {Color} from "../../datatypes/color/color";
import {GradumIconProperties} from "./icon.types";

/**
 * @class GradumIcon
 * @group Components
 * @category GradumIcon
 *
 * @description Icon class for creating icon elements.
 * @extends GradumElement
 */
class GradumIcon<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumElement<ViewType, DataType, ModelType, EmitterType> {
     public declare readonly properties: GradumIconProperties;
    public static readonly customLoaders: Record<string, (path: string) => (Element | Promise<Element>)> = {};
    public static defaultProperties: Partial<GradumIconProperties> = {
        type: "svg"
    };

    private static imageTypes = ["png", "jpg", "jpeg", "gif", "webp", "PNG", "JPG", "JPEG", "GIF", "WEBP"] as const;

    private _element: Element;
    private _loadToken = 0;

    public onLoaded: (element: Element) => void;

    /**
     * @description The type of the icon.
     */
    @observe @auto({
        preprocessValue: function (value: string) {
            if (!value || value.length == 0) return this.type;
            if (value[0] == ".") value = value.substring(1);
            return value;
        },
        callAfter: function() {this.generateIcon()},
    }) public type: string;

    /**
     * @description The user-provided (or statically configured) directory to the icon's file.
     */
    @observe @auto({
        preprocessValue: function (value: string) {
            if (isUndefined(value)) return this.directory;
            if (value.length > 0 && !value.endsWith("/")) value += "/";
            return value;
        },
        callAfter: function() {this.generateIcon()}
    }) public directory: string;

    /**
     * @description The path to the icon's source file.
     */
    public get path(): string {
        let extension = getFileExtension(this.icon);
        const icon = this.icon?.replace(extension, "");
        if (extension.length === 0 && this.type?.length > 0) extension = "." + this.type;
        return (this.directory ?? "") + icon + extension;
    }

    /**
     * @description The name (or path) of the icon. Might include the file extension (to override the icon's type).
     * Setting it will update the icon accordingly.
     */
    @observe @auto() public set icon(value: string) {
        const ext = getFileExtension(value).substring(1);
        if (ext) this.type = ext;
        this.generateIcon();
    }

    /**
     * @description The assigned color to the icon (if any)
     */
    @observe @auto() public get iconColor(): Color {return}
    @observe @auto() public set iconColor(value: Color | string) {
        this.updateColor(Color.from(value));
    }

    /**
     * @description The child element of the icon element (an HTML image or an SVG element).
     */
    private set element(value: Element) {
        this._element = value;
    }

    public get element(): Element {
        return this._element;
    }

    //Utilities

    @cache()
    protected loadSvg(path: string): Promise<SVGElement> {
        return fetchSvg(path);
    }

    protected loadImg(path: string) {
        return img({src: path, alt: this.icon});
    }

    protected updateColor(value: Color = this.iconColor) {
        if (value && this.element instanceof SVGElement) this.element.style.fill = value.toString();
    }

    protected generateIcon() {
        const path = this.path;
        const type = getFileExtension(path)?.substring(1);

        if (this.element instanceof HTMLImageElement
            && equalToAny(type, ...(this.constructor as any).imageTypes)) {
            this.element.src = this.path;
            this.element.alt = this.icon;
            return;
        }

        this.clear();
        if (!this.icon || this.icon.length === 0) return;
        if (!type) return;

        const token = ++this._loadToken;
        const element = this.getLoader(type)(path);

        if (element instanceof Element) this.setupLoadedElement(element);
        else element.then(element => {
            if (token !== this._loadToken) return;
            this.setupLoadedElement(element);
        }).catch(error => console.error(`Failed to load icon: ${error}`));
    }

    private getLoader(type: string): (path: string) => Element | Promise<Element> {
        if (!type) return;

        const customLoader = (this.constructor as any).customLoaders?.[type];
        if (customLoader) return customLoader;

        if (equalToAny(type, "svg", "SVG")) return this.loadSvg.bind(this);
        if (equalToAny(type, ...(this.constructor as any).imageTypes)) return this.loadImg.bind(this);
        throw new Error(`Unsupported icon type: ${type}`);
    }

    private setupLoadedElement(element: Element) {
        if (this.element || !element) return;
        if (element.parentElement) element = element.cloneNode(true) as Element;

        gradum(this).addChild(element);
        this.updateColor();
        this.onLoaded?.(element);
        this.element = element;
    }

    private clear() {
        gradum(this.element).destroy();
        this.element = null;
    }
}

define(GradumIcon);
export {GradumIcon};