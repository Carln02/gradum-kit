import {
    ClickMode,
    gradum,
    GradumElement,
    GradumEvent,
    GradumTool,
    GradumView, behavior, Propagation
} from "../../../../../build/gradum-kit.esm";
import {NewPlaylistModel} from "./newPlaylist.model";
import {Playlist} from "../../playlist/playlist";

export class NewPlaylistTool extends GradumTool<GradumElement, GradumView, NewPlaylistModel> {
    public toolName = "newPlaylist";

    public onActivate() {
        gradum(this).toggleClass("selected", true);
    }

    public onDeactivate() {
        gradum(this).toggleClass("selected", false);
    }

    @behavior() public click(e: GradumEvent, target: Node) {
        if (target !== this.model.target && target !== document.body) return Propagation.propagate;
        gradum(this.model.target).addChild(Playlist.create({
            data: {
                name: "Playlist " + NewPlaylistModel.playlistCount,
                songs: [],
                origin: e.scaledPosition
            }
        }));
        NewPlaylistModel.playlistCount++;
        return Propagation.stopPropagation;
    }
}