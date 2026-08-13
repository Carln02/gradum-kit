import {GradumView, gradum} from "../../../../build/gradum-kit.esm";
import {Square} from "./square";
import {SquareModel} from "./square.model";

export class SquareView extends GradumView<Square, SquareModel> {
    public draw(context: CanvasRenderingContext2D) {
        context.save();

        const rect = this.element.getBoundingClientRect();
        context.translate(rect.x + rect.width / 2, rect.y + rect.height / 2);
        context.rotate(this.model.rotation ?? 0);

        context.fillStyle = this.model.color.toString();
        context.fillRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);

        this.drawLabel(context);
        context.restore();
    }

    protected drawLabel(context: CanvasRenderingContext2D) {
        const label = gradum(this).metadata.get("isPusher") ? "Pusher"
            : gradum(this).metadata.get("isSpacer") ? "Spacer" : undefined;

        if (label) {
            context.fillStyle = "#020222";
            context.font = "13px system-ui, -apple-system, sans-serif";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(label, 0, 0);
        }
    }
}