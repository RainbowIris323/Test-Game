// for toolbar and inventory buttons
export interface ItemGui extends ImageButton {
	itemName: TextLabel;
	itemQuantity: TextLabel;
}

// for setting keybinds
export interface KeybindSettingPage extends Frame {
	value: TextButton;
	name: TextLabel;
}

export interface PlayerGui extends BasePlayerGui {
	ScreenGui: ScreenGui & {
		Toolbar: Frame & {
			active: StringValue;
		};
		Menu: Frame & {
			menus: Folder & {
				Inventory: Frame & {
					Items: ScrollingFrame;
					ItemTemplate: ItemGui;
				};
				Help: Frame & {
					ItemPage: Frame & {
						Image: ImageLabel;
						Info: TextLabel;
						Stats: TextLabel;
					};
					Pages: ScrollingFrame;
					PageButtonTemp: TextButton;
				};
				Settings: Frame & {
					Items: ScrollingFrame & {
						Keybinds: Frame & {
							content: Folder;
							Template: KeybindSettingPage;
						};
					};
				};
			};
			active: StringValue;
			name: TextLabel;
			menuButtons: Folder & {
				Inventory: ImageButton;
				Calculator: ImageButton;
				Help: ImageButton;
				Settings: ImageButton;
			};
		};
	};
	ItemGui: BillboardGui & {
		ItemName: TextLabel;
	};
}

// Droped Items
export interface dropedItem extends Part {
	Data: Folder & {
		Quantity: IntValue;
		Owner: StringValue;
	};
}

// Settings
export interface Settings extends Folder {
	Keybinds: Folder & {
		Sprint: StringValue;
		Inventory: StringValue;
		Settings: StringValue;
		Help: StringValue;
		Pickup: StringValue;
		Drop: StringValue;
	};
}

// Inventory Items
export interface Inventory extends Folder {
	["Power Cube"]: IntValue;
	Stone: IntValue;
}

export interface Item {
	Name: string;
	Tool: Model | undefined;
	Build: Model | undefined;
}

export interface PlayerData {
	Keybinds: Map<string, string>;
	Inventory: Map<string, number>;
}
