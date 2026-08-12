import {define, element, GradumElement, GradumModel} from "../../../../build/gradum-kit.esm";
import {SongsPanelView} from "./songsPanel.view";
import {SongsPanelData, SongsPanelProperties} from "./songsPanel.types";
import "./songsPanel.css";

export class SongsPanel extends GradumElement<SongsPanelView, SongsPanelData> {
    public static defaultProperties = {
        view: SongsPanelView,
        model: GradumModel
    };
}

define(SongsPanel, "gradum-songs-panel");