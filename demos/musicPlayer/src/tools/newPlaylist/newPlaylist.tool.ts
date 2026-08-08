import {
    ClickMode,
    randomColor,
    gradum,
    GradumElement,
    GradumEvent,
    GradumTool,
    GradumView
} from "../../../../../build/gradum-kit.esm";
import {NewPlaylistModel} from "./newPlaylist.model";
import {playlist} from "../../playlist/playlist";

export class NewPlaylistTool extends GradumTool<GradumElement, GradumView, NewPlaylistModel> {
    public toolName = "newPlaylist";

    public onActivation() {
        gradum(this).toggleClass("selected", true);
    }

    public onDeactivation() {
        gradum(this).toggleClass("selected", false);
    }

    public click(e: GradumEvent, target: Node): boolean {
        if (target !== this.model.target && target !== document.body) return;
        gradum(this.model.target).addChild(playlist({
            data: {
                name: "Playlist " + NewPlaylistModel.playlistCount,
                songs: [],
                origin: e.scaledPosition
            }
        }));
        NewPlaylistModel.playlistCount++;
    }
}