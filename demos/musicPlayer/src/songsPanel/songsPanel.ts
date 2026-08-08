import {define, element, GradumElement, GradumModel} from "../../../../build/gradum-kit.esm";
import {SongsPanelView} from "./songsPanel.view";
import {SongsPanelData, SongsPanelProperties} from "./songsPanel.types";
import "./songsPanel.css";

@define("gradum-songs-panel")
export class SongsPanel extends GradumElement<SongsPanelView, SongsPanelData> {
}

export function songsPanel(properties: SongsPanelProperties = {}) {
    if (!properties.tag) properties.tag = "gradum-songs-panel";
    if (!properties.view) properties.view = SongsPanelView;
    if (!properties.model) properties.model = GradumModel;
    return element(properties);
}