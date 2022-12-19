interface ReplicatedStorage extends Instance {
	Events: Folder & {
		DataTunnel: RemoteEvent;
	};
	Tool: Tool;
	Blocks: Folder;
}
