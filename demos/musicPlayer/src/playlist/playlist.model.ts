import {Coordinate, dataSignal, GradumModel} from "../../../../build/gradum-kit.esm";
import {PlaylistData} from "./playlist.types";

export class PlaylistModel extends GradumModel<PlaylistData> {
    @dataSignal("name") public name: string;
    @dataSignal("songs") public songs: string[];
    @dataSignal("origin") public origin: Coordinate;
}