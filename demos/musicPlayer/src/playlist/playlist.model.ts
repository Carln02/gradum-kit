import {Coordinate, modelSignal, GradumModel} from "../../../../build/gradum-kit.esm";
import {PlaylistData} from "./playlist.types";

export class PlaylistModel extends GradumModel<PlaylistData> {
    @modelSignal("name") public name: string;
    @modelSignal("songs") public songs: string[];
    @modelSignal("origin") public origin: Coordinate;
}