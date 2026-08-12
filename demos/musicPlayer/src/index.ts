import {SongsPanel} from "./songsPanel/songsPanel";
import {div, GradumIcon, GradumEventManager} from "../../../build/gradum-kit.esm";
import "./main.css";
import "./scrollbar.css";
import {Toolbar} from "./toolbar/toolbar";
import {NewPlaylistTool} from "./tools/newPlaylist/newPlaylist.tool";
import {NewPlaylistModel} from "./tools/newPlaylist/newPlaylist.model";
import {SelectTool} from "./tools/select/select.tool";
import {DataHandler} from "./dataHandler";
import {DeleteTool} from "./tools/delete/delete.tool";

GradumIcon.defaultProperties.directory = "assets";
// GradumEventManager.instance.preventDefaultWheel = false;

const canvasEl = div({id: "canvas", parent: document.body});
const toolbarEl = Toolbar.create({parent: document.body});

toolbarEl.addTool(GradumIcon.create({icon: "cursor", tools: SelectTool}));

const newPlaylistTool = GradumIcon.create({icon: "new-playlist", tools: NewPlaylistTool, model: NewPlaylistModel});
newPlaylistTool.model.target = canvasEl;
toolbarEl.addTool(newPlaylistTool);

toolbarEl.addTool(GradumIcon.create({icon: "trash", tools: DeleteTool}));

DataHandler.getSongs().then(data => SongsPanel.create({data, parent: document.body}));