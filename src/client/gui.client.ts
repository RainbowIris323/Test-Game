import { Players, UserInputService, ReplicatedStorage } from "@rbxts/services";

interface PlayerGui extends BasePlayerGui {
	ScreenGui: ScreenGui & {
		Toolbar: Frame & {
			Active: StringValue;
			["1"]: ImageButton & {
				UICorner: UICorner;
				UIStroke: UIStroke;
				name: TextLabel;
				Quantity: TextLabel;
			};
			["3"]: ImageButton & {
				UICorner: UICorner;
				UIStroke: UIStroke;
				name: TextLabel;
				Quantity: TextLabel;
			};
			["2"]: ImageButton & {
				UICorner: UICorner;
				UIStroke: UIStroke;
				name: TextLabel;
				Quantity: TextLabel;
			};
			["5"]: ImageButton & {
				UICorner: UICorner;
				UIStroke: UIStroke;
				name: TextLabel;
				Quantity: TextLabel;
			};
			["4"]: ImageButton & {
				UICorner: UICorner;
				UIStroke: UIStroke;
				name: TextLabel;
				Quantity: TextLabel;
			};
			["7"]: ImageButton & {
				UICorner: UICorner;
				UIStroke: UIStroke;
				name: TextLabel;
				Quantity: TextLabel;
			};
			["6"]: ImageButton & {
				UICorner: UICorner;
				UIStroke: UIStroke;
				name: TextLabel;
				Quantity: TextLabel;
			};
		};
		Menu: Frame & {
			menus: Folder & {
				Inventory: Frame & {
					Items: ScrollingFrame & {
						UICorner: UICorner;
						UIStroke: UIStroke;
						UIPadding: UIPadding;
						UIGridLayout: UIGridLayout;
					};
					ItemTemplate: ImageButton & {
						UICorner: UICorner;
						Quantity: TextLabel;
						UIPadding: UIPadding;
						name: TextLabel;
					};
					UIPadding: UIPadding;
				};
				Help: Frame & {
					UIPadding: UIPadding;
					ItemPage: Frame & {
						Image: ImageLabel & {
							UICorner: UICorner;
						};
						UIPadding: UIPadding;
						UICorner: UICorner;
						UIStroke: UIStroke;
						Info: TextLabel;
						Stats: TextLabel;
					};
					Pages: ScrollingFrame & {
						UICorner: UICorner;
						UIStroke: UIStroke;
						UIPadding: UIPadding;
						UIListLayout: UIListLayout;
					};
					PageButtonTemp: TextButton & {
						UICorner: UICorner;
						UIPadding: UIPadding;
					};
				};
				Settings: Frame & {
					UIPadding: UIPadding;
					Items: ScrollingFrame & {
						UICorner: UICorner;
						UIStroke: UIStroke;
						UIPadding: UIPadding;
						UIListLayout: UIListLayout;
					};
				};
			};
			UIPadding: UIPadding;
			active: StringValue;
			UICorner: UICorner;
			["static"]: Folder & {
				line: Frame;
			};
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			name: TextLabel;
			UIStroke: UIStroke;
			menuButtons: Folder & {
				Inventory: ImageButton & {
					UICorner: UICorner;
				};
				Calculator: ImageButton & {
					UICorner: UICorner;
				};
				Help: ImageButton & {
					UICorner: UICorner;
				};
				Settings: ImageButton & {
					UICorner: UICorner;
				};
			};
			UISizeConstraint: UISizeConstraint;
		};
		UIPadding: UIPadding;
		UIScale: UIScale;
	};
	ItemGui: BillboardGui & {
		ItemName: TextLabel;
	};
}

const player = Players.LocalPlayer;
const PlayerGui = player.WaitForChild("PlayerGui") as PlayerGui;
wait(2);
const Inventory = ReplicatedStorage.GameData.Inventory.WaitForChild(`${player.UserId}`) as Folder;

const Toolbar = PlayerGui.ScreenGui.Toolbar;

Toolbar.GetChildren().forEach((child) => {
	assert(child.IsA("ImageButton"));
	child.Activated.Connect(() => {
		Toolbar.Active.Value = child.Name;
	});
});

class Menu {
	menu: Frame;
	menuName: TextLabel;
	active: StringValue;
	menus: Frame[];
	buttons: ImageButton[];
	constructor() {
		this.menu = PlayerGui.ScreenGui.Menu;
		this.menuName = PlayerGui.ScreenGui.Menu.name;
		this.active = PlayerGui.ScreenGui.Menu.active;
		this.menus = [
			PlayerGui.ScreenGui.Menu.menus.Inventory,
			PlayerGui.ScreenGui.Menu.menus.Settings,
			PlayerGui.ScreenGui.Menu.menus.Help,
		];
		this.buttons = [
			PlayerGui.ScreenGui.Menu.menuButtons.Inventory,
			PlayerGui.ScreenGui.Menu.menuButtons.Settings,
			PlayerGui.ScreenGui.Menu.menuButtons.Help,
		];
		this.active.Changed.Connect((changeTo) => this.changeMenu(changeTo));
		for (const button of this.buttons) {
			button.Activated.Connect(() => (this.active.Value = button.Name));
		}
	}
	toggleMenu() {
		if (this.menu.Visible === false) return (this.menu.Visible = true);
		if (this.menu.Visible === true) return (this.menu.Visible = false);
	}
	changeMenu(TO: string) {
		this.menuName.Text = TO;
		for (const menu of this.menus) {
			if (menu.Name === TO) {
				menu.Visible = true;
				if (menu.Name === "Inventory") this.openInventory();
			} else {
				menu.Visible = false;
				if (menu.Name === "Inventory") this.closeInventory();
			}
		}
	}
	openInventory() {
		Inventory.GetChildren().forEach((child) => {
			assert(child.IsA("IntValue"));
			if (child.Value === 0) return;
			const item = PlayerGui.ScreenGui.Menu.menus.Inventory.ItemTemplate.Clone();
			item.Name = child.Name;
			item.Quantity.Text = `${child.Value}`;
			item.name.Text = child.Name;
			item.Parent = PlayerGui.ScreenGui.Menu.menus.Inventory.Items;
			item.Visible = true;
			item.Activated.Connect(() => {
				let done = false;
				Toolbar.GetChildren().forEach((child) => {
					if (done) return;
					assert(child.IsA("ImageButton"));
					const name = child.FindFirstChild("name") as TextLabel;
					if (name.Text === item.Name) return (done = true);
				});
				Toolbar.GetChildren().forEach((child) => {
					if (done) return;
					assert(child.IsA("ImageButton"));
					const name = child.FindFirstChild("name") as TextLabel;
					const quantity = child.FindFirstChild("Quantity") as TextLabel;
					if (name.Text === "") {
						name.Text = item.Name;
						quantity.Text = item.Quantity.Text;
						done = true;
					}
				});
			});
		});
	}
	closeInventory() {
		PlayerGui.ScreenGui.Menu.menus.Inventory.Items.GetChildren().forEach((child) => {
			try {
				assert(child.IsA("ImageButton"));
				child.Destroy();
			} catch {
				return;
			}
		});
	}
}

const menu = new Menu();

UserInputService.InputBegan.Connect((input) => {
	if (input.KeyCode === Enum.KeyCode.E) {
		// open menu on Inventory
		menu.toggleMenu();
		menu.changeMenu("Inventory");
	}
});
