interface ReplicatedStorage extends Instance {
	GameData: Folder & {
		Inventory: Folder;
		Templates: Folder & {
			Inventory: Folder & {
				["Energy Cube"]: IntValue;
				Stone: IntValue;
			};
		};
	};
	TS: Folder;
	Drops: Folder & {
		["Energy Cube"]: Part & {
			ParticleEmitter: ParticleEmitter;
			Quantity: IntValue;
		};
		Stone: Part & {
			Quantity: IntValue;
		};
	};
}
