interface ReplicatedStorage extends Instance {
	Events: Folder & {
		DataTunnel: RemoteEvent;
		EventTunnel: RemoteEvent;
	};
	Tool: Tool;
	SelectionBox: SelectionBox;
	StarterBase: Folder;
	Tools: Folder;
	Blocks: Folder;
}
