import {modelSignal, signal, GradumModel} from "../../../../build/gradum-kit.esm";
import {SongState} from "./song.types";

export class SongModel extends GradumModel {
    @modelSignal() id: string;
    @modelSignal() title: string;
    @modelSignal() artist: string;
    @modelSignal() album: string;
    @modelSignal() cover: string;
    @modelSignal() duration: number;
    @signal state: SongState;
}