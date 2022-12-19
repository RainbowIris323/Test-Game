/* eslint-disable roblox-ts/lua-truthiness */
import { Players, DataStoreService, ReplicatedStorage } from "@rbxts/services";
import { t } from "@rbxts/t";
import { User } from "types";

const userData = new Map<number, Map<string, string>>();

const PlayerDataStore = DataStoreService.GetDataStore("PlayerDataStore");

function NewData() {
	const UserData = new Map<string, string>();
	ReplicatedStorage.Blocks.GetChildren().forEach((child) => {
		UserData.set(`Inventory/${child.Name}`, "0");
	});
	UserData.set(`Keybinds/Inventory`, "E");
	UserData.set(`Keybinds/Settings`, "P");
	UserData.set(`Keybinds/Help`, "H");
	UserData.set(`Keybinds/DropItem`, "Q");
	UserData.set(`Keybinds/PickupItem`, "F");
	UserData.set(`Keybinds/Sprint`, "LeftShift");
	UserData.set(`Character/Health`, "100");
	return UserData;
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
	LoadData(player);
	print(userData.get(player.UserId));
	ReplicatedStorage.Events.DataTunnel.FireClient(player, "SET", userData.get(player.UserId));
});

Players.PlayerRemoving.Connect((player) => {
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
