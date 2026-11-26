import {dataSignal, signal, GradumModel} from "../../../../build/gradum-kit.esm";
import {SongState} from "./song.types";

export class SongModel extends GradumModel {
    @dataSignal() id: string;
    @dataSignal() title: string;
    @dataSignal() artist: string;
    @dataSignal() album: string;
    @dataSignal() cover: string;
    @dataSignal() duration: number;
    @signal state: SongState;
}