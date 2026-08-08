import {
    Map as YMap,
    Array as YArray,
    AbstractType as YAbstractType,
    Text as YText,
    Doc as YDoc,
    YMapEvent,
    YArrayEvent,
    YEvent
} from "yjs";
import {GradumElementProperties} from "../gradumElement/gradumElement.types";
import {GradumView} from "../mvc/view/view";
import {GradumModel} from "../mvc/model/model";
import {GradumEmitter} from "../mvc/emitter/emitter";

declare module "yjs" {
    interface Map<MapType = any> {}
    interface Array<T = any> {}
    interface AbstractType<EventType = any> {}

    interface YEvent<T = any, EventType = any> {}
    interface YMapEvent<T = any, EventType = any> {}
    interface YArrayEvent<T = any, EventType = any> {}
}

/**
 * @group Types
 * @category Yjs
 */
type YDocumentProperties<
    ViewType extends GradumView = GradumView<any, any>,
    DataType extends object = object,
    ModelType extends GradumModel<DataType> = GradumModel,
    EmitterType extends GradumEmitter = GradumEmitter
> = GradumElementProperties<ViewType, DataType, ModelType, EmitterType> & {
    document: YDoc
};

export {
    YMap,
    YArray,
    YAbstractType,
    YText,
    YDoc,
    YEvent,
    YMapEvent,
    YArrayEvent,
    YDocumentProperties,
};