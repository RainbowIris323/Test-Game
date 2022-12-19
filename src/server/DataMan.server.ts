import { ReplicatedStorage, Players } from "@rbxts/services";

Players.PlayerAdded.Connect((player) => {
	const playerInventory = ReplicatedStorage.GameData.Templates.Inventory.Clone();
	const playerSettings = ReplicatedStorage.GameData.Templates.Settings.Clone();
	playerInventory.Name = `${player.UserId}`;
	playerSettings.Name = `${player.UserId}`;
	playerInventory.Parent = ReplicatedStorage.GameData.Inventory;
	playerSettings.Parent = ReplicatedStorage.GameData.Settings;
});

Players.PlayerRemoving.Connect((player) => {
	ReplicatedStorage.GameData.Inventory.FindFirstChild(`${player.UserId}`)?.Destroy();
	ReplicatedStorage.GameData.Settings.FindFirstChild(`${player.UserId}`)?.Destroy();
});
