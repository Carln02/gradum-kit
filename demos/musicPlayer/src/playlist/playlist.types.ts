import {Coordinate, GradumElementProperties} from "../../../../build/gradum-kit.esm";
import {PlaylistView} from "./playlist.view";
import {PlaylistModel} from "./playlist.model";

export type PlaylistData = {
    name: string,
    songs: string[],
    origin: Coordinate
}

export type PlaylistProperties = GradumElementProperties<PlaylistView, PlaylistData, PlaylistModel>;