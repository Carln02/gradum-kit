import {define, GradumButtonPopup} from "../../../../build/gradum-kit.esm";
import {ImportedFilesView} from "./importedFiles.view";
import {ImportedFilesFilesHandler} from "./importedFiles.filesHandler";
import {ImportedFilesModel} from "./importedFiles.model";

export class ImportedFiles extends GradumButtonPopup {
    public static defaultProperties = {
        view: ImportedFilesView,
        handlers: ImportedFilesFilesHandler,
        model: ImportedFilesModel,
        data: new Map()
    }
}
define(ImportedFiles);