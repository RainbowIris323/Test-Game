/* eslint-disable roblox-ts/lua-truthiness */
import { Players, ContextActionService, ReplicatedStorage, StarterGui } from "@rbxts/services";
import { ItemGui, KeybindSettingPage, PlayerGui, Settings } from "types";

StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);
StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Chat, false);

const player = Players.LocalPlayer;

let Humanoid: Humanoid;
player.CharacterAdded.Connect((char) => {
	const e = char.WaitForChild("Humanoid");
	if (!e.IsA("Humanoid")) return;
	Humanoid = e;
});

const PlayerGui = player.WaitForChild("PlayerGui") as PlayerGui;
const Inventory = ReplicatedStorage.GameData.Inventory.WaitForChild(`${player.UserId}`) as Folder;

const ScreenGui = PlayerGui.WaitForChild("ScreenGui") as ScreenGui;

const Toolbar = PlayerGui.ScreenGui.Toolbar;
const KeybindsPage = PlayerGui.ScreenGui.Menu.menus.Settings.Items.Keybinds;

const hand = ReplicatedStorage.Tool.Clone();

Toolbar.GetChildren().forEach((child) => {
	if (!child.IsA("ImageButton")) return;
	child.Activated.Connect(() => {
		Toolbar.active.Value = child.Name;
	});
});
let lastActive = "1";
Toolbar.active.Changed.Connect((value) => {
	let stroke = Toolbar.FindFirstChild(lastActive)?.FindFirstChild("UIStroke") as UIStroke;
	stroke.Transparency = 0.5;
	lastActive = value;
	stroke = Toolbar.FindFirstChild(lastActive)?.FindFirstChild("UIStroke") as UIStroke;
	stroke.Transparency = 0.25;
	Humanoid.EquipTool(hand);
	hand.GetChildren().forEach((child) => child.Destroy());
	if (lastActive === "") return;
	const itemName = Toolbar.FindFirstChild(lastActive)?.FindFirstChild("itemName") as TextLabel;
	if (itemName.Text === "") return;
	const part = ReplicatedStorage.Drops.WaitForChild(itemName.Text).Clone() as Part;
	part.Name = "Handle";
	part.Parent = hand;
});

let menuName = "";
const Menu = PlayerGui.ScreenGui.Menu;

function changeMenu(TO: string) {
	if (menuName) {
		const menu = Menu.menus.FindFirstChild(menuName) as Frame;
		if (menu.Name === "Inventory") {
			menu.WaitForChild("Items")
				.GetChildren()
				.forEach((child) => {
					if (child.IsA("ImageButton")) child.Destroy();
				});
		}
		menu.Visible = false;
	}
	Menu.Visible = false;
	if (menuName === TO) return (menuName = "");
	menuName = TO;
	if (menuName === "") return;
	Menu.Visible = true;
	const menu = Menu.menus.FindFirstChild(menuName) as Frame;
	menu.Visible = true;
	if (menu.Name !== "Inventory") return;
	Inventory.GetChildren()
		.filter((child) => {
			return true;
			// if (child.Name.lower().find( query /* for search bar */)[0]) return true;
		})
		.forEach((child) => {
			if (!child.IsA("IntValue")) return;
			if (child.Value === 0) return;
			const item = PlayerGui.ScreenGui.Menu.menus.Inventory.ItemTemplate.Clone();
			item.Name = child.Name;
			item.itemQuantity.Text = `${child.Value}`;
			item.itemName.Text = child.Name;
			item.Parent = PlayerGui.ScreenGui.Menu.menus.Inventory.Items;
			item.Visible = true;
			item.Activated.Connect(() => {
				let done = false;
				Toolbar.GetChildren().forEach((child) => {
					if (done || !child.IsA("ImageButton")) return;
					const child1 = child as ItemGui;
					if (child1.itemName.Text === item.Name) {
						child1.itemName.Text = "";
						child1.itemQuantity.Text = "";
						return (done = true);
					}
				});
				Toolbar.GetChildren()
					.sort((a, b) => {
						if (a.Name < b.Name) return true;
						return false;
					})
					.forEach((child) => {
						if (done || !child.IsA("ImageButton")) return;
						const child1 = child as ItemGui;
						if (child1.itemName.Text === "") {
							child1.itemName.Text = item.Name;
							child1.itemQuantity.Text = item.itemQuantity.Text;
							done = true;
						}
					});
			});
		});
}

Menu.WaitForChild("menuButtons")
	.GetChildren()
	.forEach((child1) => {
		const child = child1 as ImageButton;
		child.Activated.Connect(() => {
			changeMenu(child.Name);
		});
	});

const playerSettings = ReplicatedStorage.GameData.Settings.WaitForChild(`${player.UserId}`) as Settings;

let lastKey = "";

function handleAction(actionName: String, inputState: Enum.UserInputState, inputObject: InputObject) {
	if (inputState === Enum.UserInputState.Begin) {
		print(actionName);
		if (actionName === "KEY-Inventory") {
			changeMenu("Inventory");
		}
		if (actionName === "KEY-Settings") {
			changeMenu("Settings");
		}
		if (actionName === "KEY-Help") {
			changeMenu("Help");
		}
		if (actionName === "KEY-Sprint") {
			if (!Humanoid) return;
			if (Humanoid.WalkSpeed === 32) return (Humanoid.WalkSpeed = 16);
			if (Humanoid.WalkSpeed === 16) return (Humanoid.WalkSpeed = 32);
		}
		if (actionName === "KEYBOARD") {
			lastKey = inputObject.KeyCode.Name;
		}
	}
}

function updateKey(newKey: string, actionName: string) {
	ContextActionService.UnbindAction(actionName);
	const keyCode = Enum.KeyCode.GetEnumItems().filter((value) => {
		if (value.Name === newKey) return true;
	})[0];
	ContextActionService.BindAction(actionName, handleAction, false, keyCode);
}

let c = 1;

playerSettings.Keybinds.GetChildren().forEach((setting) => {
	if (!setting.IsA("StringValue")) return;
	KeybindsPage.Size = KeybindsPage.Size.add(new UDim2(0, 0, 0, 75));
	const page = KeybindsPage.Template.Clone();
	page.Position = page.Position.add(new UDim2(0, 0, 0, 75 * c));
	page.name.Text = setting.Name;
	page.value.Text = setting.Value;
	page.Visible = true;
	page.Parent = KeybindsPage.content;
	page.value.Activated.Connect(() => {
		lastKey = "";
		ContextActionService.BindAction("KEYBOARD", handleAction, false, Enum.UserInputType.Keyboard);
		wait(2);
		ContextActionService.UnbindAction("KEYBOARD");
		if (lastKey !== "") {
			let good = true;
			KeybindsPage.content.GetChildren().forEach((child) => {
				const child1 = child as KeybindSettingPage;
				if (child1.value.Text === lastKey) good = false;
			});
			if (good) page.value.Text = lastKey;
			setting.Value = lastKey;
		}
	});
	updateKey(setting.Value, `KEY-${setting.Name}`);
	setting.Changed.Connect(() => {
		updateKey(setting.Value, `KEY-${setting.Name}`);
	});
	c++;
});
