interface ReplicatedStorage extends Instance {
	GameData: Folder & {
		Inventory: Folder;
		Settings: Folder;
		Templates: Folder & {
			Inventory: Folder;
			Settings: Folder;
		};
	};
	Drops: Folder & {
		["Energy Cube"]: Part & {
			Quantity: IntValue;
		};
		Stone: Part & {
			Quantity: IntValue;
		};
	};
	Events: Folder & {
		DataTunnel: RemoteEvent;
	};
	Tool: Tool;
}
