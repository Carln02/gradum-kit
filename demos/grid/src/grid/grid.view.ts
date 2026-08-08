import {GradumEmitter, GradumView, div, gradum} from "../../../../build/gradum-kit.esm";
import {GradumGrid} from "./grid";
import {GradumGridModel} from "./grid.model";

class GradumGridView<
    ElementType extends GradumGrid = GradumGrid,
    ModelType extends GradumGridModel = GradumGridModel,
    EmitterType extends GradumEmitter = GradumEmitter
> extends GradumView<ElementType, ModelType, EmitterType> {
    protected gridPanel: HTMLElement;
    protected cells: HTMLElement[] = [];

    protected setupUIElements() {
        super.setupUIElements();
        this.gridPanel = div({classes: "grid-panel"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        gradum(this).addChild(this.gridPanel);
    }

    public initialize() {
        super.initialize();
        this.model.onColumnWidthChanged.add(this.updateGridGeometry.bind(this));
        this.model.onRowHeightChanged.add(this.updateGridGeometry.bind(this));
    }

    protected updateGridGeometry() {
        gradum(this.gridPanel).setStyle("gridTemplateColumns",
            this.model.columnWidths.map(width => width + "px").join(" "));
        gradum(this.gridPanel).setStyle("gridTemplateRows",
            this.model.rowHeights.map(height => height + "px").join(" "));
        this.ensureCells();
    }

    protected ensureCells() {
        const total = this.model.cellCount;
        while (this.cells.length < total) this.createCell(this.cells.length);
        while (this.cells.length > total) this.cells.pop()?.remove();
    }

    protected createCell(position: number) {
        this.cells[position] = div({classes: "cell", parent: this.gridPanel});
        return this.cells[position];
    }
}

export {GradumGridView};