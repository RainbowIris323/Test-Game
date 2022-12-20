/* eslint-disable roblox-ts/lua-truthiness */
import { Players, ContextActionService, ReplicatedStorage, StarterGui } from "@rbxts/services";
import { ItemGui, KeybindSettingPage, PlayerGui } from "types";
import { User } from "types";

const player = Players.LocalPlayer;
const PlayerGui = player.WaitForChild("PlayerGui") as PlayerGui;
const user: User = { Data: new Map<string, string>() };

StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);
StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Chat, false);

let Humanoid: Humanoid;
player.CharacterAdded.Connect((char) => {
	const e = char.WaitForChild("Humanoid");
	if (!e.IsA("Humanoid")) return;
	Humanoid = e;
});

wait(1);
const Toolbar = PlayerGui.ScreenGui.Toolbar;

ReplicatedStorage.Events.DataTunnel.OnClientEvent.Connect((method, key, value) => {
	if (tostring(method) === "UPDATE") {
		user.Data.set(tostring(key), tostring(value));
		const eq = Toolbar.FindFirstChild(Toolbar.active.Value)?.FindFirstChild("itemName") as TextLabel;
		if (tostring(key).split("/")[1] === eq.Text) {
			const eq = Toolbar.FindFirstChild(Toolbar.active.Value)?.FindFirstChild("itemQuantity") as TextLabel;
			eq.Text = tostring(value);
		}
	}
	if (tostring(method) === "SET") user.Data = key;
});

function set(key: string, value: string) {
	ReplicatedStorage.Events.DataTunnel.FireServer("SET", key, value);
}

wait(1);

const ScreenGui = PlayerGui.WaitForChild("ScreenGui") as ScreenGui;

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
	const part = ReplicatedStorage.Blocks.FindFirstChild(itemName.Text);
	if (!part) {
		const tool = ReplicatedStorage.Tools.FindFirstChild(itemName.Text);
		if (!tool || !tool.IsA("UnionOperation")) return;
		const tool1 = tool.Clone() as UnionOperation;
		tool1.Name = "Handle";
		tool1.Parent = hand;
		return;
	}
	if (!part.IsA("Part")) return;
	const part1 = part.Clone() as Part;
	part1.Size = new Vector3(1.5, 1.5, 1.5);
	part1.Name = "Handle";
	part1.Anchored = false;
	part1.Parent = hand;
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
	user.Data.forEach((value, key) => {
		if (key.split("/")[0] !== "Inventory" || tonumber(value) === 0) return;
		const item = PlayerGui.ScreenGui.Menu.menus.Inventory.ItemTemplate.Clone();
		item.Name = key.split("/")[1];
		item.itemQuantity.Text = value;
		item.itemName.Text = key.split("/")[1];
		item.Visible = true;
		item.Parent = PlayerGui.ScreenGui.Menu.menus.Inventory.Items;
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

let lastKey = "";

function handleAction(actionName: string, inputState: Enum.UserInputState, inputObject: InputObject) {
	if (inputState === Enum.UserInputState.Begin) {
		print(actionName);
		if (actionName.split("-")[0] === "TOOLBAR") {
			Toolbar.active.Value = actionName.split("-")[1];
		}
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

user.Data.forEach((value, key) => {
	if (key.split("/")[0] !== "Keybinds") return;
	KeybindsPage.Size = KeybindsPage.Size.add(new UDim2(0, 0, 0, 75));
	const page = KeybindsPage.Template.Clone();
	page.Position = page.Position.add(new UDim2(0, 0, 0, 75 * c));
	page.name.Text = key.split("/")[1];
	page.value.Text = value;
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
			set(key, lastKey);
			updateKey(lastKey, `KEY-${key.split("/")[1]}`);
		}
	});
	updateKey(value, `KEY-${key.split("/")[1]}`);
	c++;
});

updateKey("One", "TOOLBAR-1");
updateKey("Two", "TOOLBAR-2");
updateKey("Three", "TOOLBAR-3");
updateKey("Four", "TOOLBAR-4");
updateKey("Five", "TOOLBAR-5");
updateKey("Six", "TOOLBAR-6");
updateKey("Seven", "TOOLBAR-7");

const mouse = player.GetMouse();
const SelectionBox = ReplicatedStorage.SelectionBox.Clone();

mouse.Move.Connect(() => {
	const target = mouse.Target;
	if (target) {
		SelectionBox.Parent = target;
		SelectionBox.Adornee = target;
	} else {
		SelectionBox.Parent = undefined;
		SelectionBox.Adornee = undefined;
	}
});

mouse.Button1Down.Connect(() => {
	const target = mouse.Target;
	if (!target || !target.IsA("Instance")) return;
	const eq = Toolbar.FindFirstChild(Toolbar.active.Value)?.FindFirstChild("itemName") as TextLabel;
	ReplicatedStorage.Events.EventTunnel.FireServer("TOOL-ACTIVATED", eq.Text, target);
});

mouse.Button2Down.Connect(() => {
	const target = mouse.Target;
	if (!target || !target.IsA("Instance")) return;
	const eq = Toolbar.FindFirstChild(Toolbar.active.Value)?.FindFirstChild("itemName") as TextLabel;
	ReplicatedStorage.Events.EventTunnel.FireServer("ITEM-USE", eq.Text, mouse.Target, mouse.TargetSurface);
});