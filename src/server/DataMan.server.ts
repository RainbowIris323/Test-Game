/* eslint-disable roblox-ts/lua-truthiness */
import { Players, DataStoreService, ReplicatedStorage, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import { User } from "types";

const userData = new Map<number, Map<string, string>>();
const baseData = new Map<number, Folder>();

const PlayerDataStore = DataStoreService.GetDataStore("PlayerDataStore=v1.2");
const BaseDataStore = DataStoreService.GetDataStore("BaseDataStore=v1.2");

function NewData() {
	const UserData = new Map<string, string>();
	ReplicatedStorage.Blocks.GetChildren().forEach((child) => {
		UserData.set(`Inventory/${child.Name}`, "0");
	});
	ReplicatedStorage.Tools.GetChildren().forEach((child) => {
		UserData.set(`Inventory/${child.Name}`, "0");
	});
	UserData.set(`Keybinds/Inventory`, "E");
	UserData.set(`Keybinds/Settings`, "P");
	UserData.set(`Keybinds/Help`, "H");
	UserData.set(`Keybinds/DropItem`, "Q");
	UserData.set(`Keybinds/PickupItem`, "F");
	UserData.set(`Keybinds/Sprint`, "LeftShift");
	UserData.set(`Character/Health`, "100");
	// STARTER ITEMS
	UserData.set(`Inventory/Pickaxe`, "1");
	UserData.set(`Inventory/Stone`, "15");
	return UserData;
}

function NewBase(player: Player) {
	const base = ReplicatedStorage.StarterBase.Clone();
	base.Name = tostring(player.UserId);
	base.Parent = Workspace;
	baseData.set(player.UserId, base);
}

function LoadBase(player: Player) {
	const LoadString = BaseDataStore.GetAsync(tostring(player.UserId))[0] as string;
	if (!LoadString) return NewBase(player);
	const base = new Instance("Folder");
	base.Name = tostring(player.UserId);
	base.Parent = Workspace;
	baseData.set(player.UserId, base);
	LoadString.split(";").forEach((block) => {
		const block1 = block.split(":");
		const Block = ReplicatedStorage.Blocks.FindFirstChild(block1[0])?.Clone() as Part;
		if (!Block) return;
		Block.Parent = base;
		Block.Position = new Vector3(tonumber(block1[1]), tonumber(block1[2]), tonumber(block1[3]));
	});
}

function SaveBase(player: Player) {
	const data = baseData.get(player.UserId);
	if (!data) return;
	const saveString: Array<string> = [];
	data.GetChildren().forEach((child) => {
		if (!child.IsA("Part")) return;
		saveString.push(`${child.Name}:${child.Position.X}:${child.Position.Y}:${child.Position.Z}`);
	});
	BaseDataStore.SetAsync(tostring(player.UserId), saveString.join(";"));
}

function SaveData(player: Player) {
	const data = userData.get(player.UserId) as Map<string, string>;
	if (!data) return;
	const saveString: Array<string> = [];
	data.forEach((value, key) => {
		saveString.push(`${key}:${value}`);
	});
	PlayerDataStore.SetAsync(tostring(player.UserId), saveString.join(";"));
}

function LoadData(player: Player) {
	const PlayerData = NewData();
	const LoadString = PlayerDataStore.GetAsync(tostring(player.UserId))[0] as string;
	if (!LoadString) return userData.set(player.UserId, PlayerData);
	LoadString.split(";").forEach((value) => {
		PlayerData.set(value.split(":")[0], value.split(":")[1]);
	});
	userData.set(player.UserId, PlayerData);
}

Players.PlayerAdded.Connect((player) => {
	LoadBase(player);
	LoadData(player);
	ReplicatedStorage.Events.DataTunnel.FireClient(player, "SET", userData.get(player.UserId));
});

Players.PlayerRemoving.Connect((player) => {
	SaveBase(player);
	SaveData(player);
});

function UpdateData(player: Player, key: string, value: string) {
	const data = userData.get(player.UserId) as Map<string, string>;
	data.set(key, value);
	ReplicatedStorage.Events.DataTunnel.FireClient(player, "UPDATE", key, data.get(key));
}

ReplicatedStorage.Events.DataTunnel.OnServerEvent.Connect((player, IO, key, value) => {
	const data = userData.get(player.UserId) as Map<string, string>;
	if (IO === "SET") {
		if (tostring(key).split("/")[0] === "Keybinds") data.set(tostring(key), tostring(value));
	}
	if (IO === "GET") {
		ReplicatedStorage.Events.DataTunnel.FireClient(player, "UPDATE", tostring(key), data.get(tostring(key)));
	}
});

// ee
ReplicatedStorage.Events.EventTunnel.OnServerEvent.Connect((player, Event, Equiped, Target, TargetSurface) => {
	if (!Equiped) return;
	if (Event === "ITEM-USE") {
		if (!TargetSurface || !Target) return;
		const data = userData.get(player.UserId) as Map<string, string>;
		if (!data) return;
		const item = tonumber(data.get(`Inventory/${Equiped}`));
		const base = baseData.get(player.UserId);
		if (!base || !item || item < 1) return;
		const block = ReplicatedStorage.Blocks.FindFirstChild(tostring(Equiped));
		if (!block) return;
		const Block = block.Clone() as Part;
		const target = Target as Part;
		switch (TargetSurface) {
			case Enum.NormalId.Top:
				Block.Position = target.Position.add(new Vector3(0, 4, 0));
				break;
			case Enum.NormalId.Bottom:
				Block.Position = target.Position.add(new Vector3(0, -4, 0));
				break;
			case Enum.NormalId.Left:
				Block.Position = target.Position.add(new Vector3(-4, 0, 0));
				break;
			case Enum.NormalId.Right:
				Block.Position = target.Position.add(new Vector3(4, 0, 0));
				break;
			case Enum.NormalId.Front:
				Block.Position = target.Position.add(new Vector3(0, 0, -4));
				break;
			case Enum.NormalId.Back:
				Block.Position = target.Position.add(new Vector3(0, 0, 4));
				break;
			default:
				Block.Destroy();
				return;
		}
		Block.Parent = base;
		UpdateData(player, `Inventory/${Equiped}`, `${item - 1}`);
	}
	if (Event === "TOOL-ACTIVATED") {
		const Target1 = Target as Part;
		if (!Target1) return;
		const data = userData.get(player.UserId) as Map<string, string>;
		if (player.DistanceFromCharacter(Target1.Position) > 20) return;
		if (Equiped === "Pickaxe") {
			const HP = Target1.GetAttribute("HP") as number;
			if (!HP) return;
			if (HP <= 10) {
				const item = tonumber(data.get(`Inventory/${Target1.Name}`)) as number;
				data.set(`Inventory/${Target1.Name}`, `${item + 1}`);
				UpdateData(player, `Inventory/${Target1.Name}`, `${item + 1}`);
				Target1.Destroy();
			} else {
				Target1.SetAttribute("HP", HP - 10);
			}
		}
	}
});
