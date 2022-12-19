/* eslint-disable roblox-ts/lua-truthiness */
import { Players, DataStoreService, ReplicatedStorage } from "@rbxts/services";
import { t } from "@rbxts/t";
import { PlayerData } from "types";

const userData = new Map<number, PlayerData>();

const PlayerDataStore = DataStoreService.GetDataStore("PlayerDataStore");

function NewData() {
	const PlayerData = {
		Inventory: new Map<string, number>(),
		Keybinds: new Map<string, string>(),
	} as PlayerData;
	// ITEMS
	PlayerData.Inventory.set("Stone", 10);
	PlayerData.Inventory.set("Power Cube", 5);
	PlayerData.Inventory.set("Wood", 15);
	// KEYBINDS
	PlayerData.Keybinds.set("Sprint", "LeftShift");
	PlayerData.Keybinds.set("Inventory", "E");
	PlayerData.Keybinds.set("Settings", "RightShift");
	PlayerData.Keybinds.set("Help", "H");
	PlayerData.Keybinds.set("DropItem", "Q");
	PlayerData.Keybinds.set("PickupItem", "F");
	return PlayerData;
}

function SaveData(userID: number) {
	const data = userData.get(userID);
	if (!data) return;
	let dataString: Array<string> = [];
	data.Inventory.forEach((value, key) => {
		dataString.push(`${key}:${value}`);
	});
	PlayerDataStore.SetAsync(`TYPE=inventory/USER=${userID}/SLOT=1`, dataString.join(";"));
	dataString = [];
	data.Keybinds.forEach((value, key) => {
		dataString.push(`${key}:${value}`);
	});
	PlayerDataStore.SetAsync(`TYPE=keybinds/USER=${userID}`, dataString.join(";"));
}

function LoadData(userID: number) {
	const PlayerData: PlayerData = NewData();
	let data = PlayerDataStore.GetAsync(`TYPE=inventory/USER=${userID}/SLOT=1`)[0] as string;
	if (!data) return userData.set(userID, PlayerData);
	data.split(";").forEach((sector) => {
		const ee = tonumber(sector.split(":")[1]);
		if (!ee) return;
		PlayerData.Inventory.set(sector.split(":")[0], ee);
	});
	data = PlayerDataStore.GetAsync(`TYPE=keybinds/USER=${userID}`)[0] as string;
	data.split(";").forEach((sector) => {
		PlayerData.Keybinds.set(sector.split(":")[0], sector.split(":")[1]);
	});
	userData.set(userID, PlayerData);
}

Players.PlayerAdded.Connect((player) => {
	LoadData(player.UserId);
	ReplicatedStorage.Events.DataTunnel.FireClient(player, userData.get(player.UserId));
});

Players.PlayerRemoving.Connect((player) => {
	SaveData(player.UserId);
});

ReplicatedStorage.Events.DataTunnel.OnServerEvent.Connect((player, RequestType, Sector, Key, TO) => {
	if (RequestType === "UPDATE" && Sector === "KEYBINDS") {
		if (t.string(Key) && t.string(TO)) userData.get(player.UserId)?.Keybinds.set(Key, TO);
	}
});
