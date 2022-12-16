import { ReplicatedStorage, Players } from "@rbxts/services";

const inventorys = ReplicatedStorage.GameData.Inventory;
const templates = ReplicatedStorage.GameData.Templates;

Players.PlayerAdded.Connect((player) => {
	const playerInv = templates.Inventory.Clone();
	playerInv.Name = `${player.UserId}`;
	playerInv.Parent = inventorys;
});

Players.PlayerRemoving.Connect((player) => {
	const playerInv = inventorys.FindFirstChild(`${player.UserId}`);
	assert(playerInv?.IsA("Folder"));
	playerInv.Destroy();
});
