import { Players } from "@rbxts/services";

interface PlayerGui extends BasePlayerGui {
	ScreenGui: ScreenGui & {
		menu: Frame & {
			background: Frame & {
				UICorner: UICorner;
				UIStroke: UIStroke;
				UIGradient: UIGradient;
			};
			console: Frame & {
				input: TextBox;
				output: ScrollingFrame;
			};
			menus: Frame & {
				UICorner: UICorner;
			};
		};
	};
	ItemGui: BillboardGui & {
		ItemName: TextLabel;
	};
}
const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
wait(1);
do {
    let keypoints = playerGui.ScreenGui.menu.background.UIGradient.Transparency as NumberSequence;
    let newKeypoints = [];
    let c = 1;
    for (let keypoint of keypoints.Keypoints) {
        if (c === 1) {
            newKeypoints.push(new NumberSequenceKeypoint(0, 1));
        } else if (c === 20) {
            newKeypoints.push(new NumberSequenceKeypoint(1, 1));
        } else if (keypoint.Time + 0.05 > 1) {
            newKeypoints.insert(1, new NumberSequenceKeypoint(0.01, math.random(60, 100) * 0.01));
        } else {
            newKeypoints.push(new NumberSequenceKeypoint(keypoint.Time + 0.05, keypoint.Value));
        };
        c++
    };
    print(keypoints);
    print(newKeypoints);
    playerGui.ScreenGui.menu.background.UIGradient.Transparency = new NumberSequence(newKeypoints);
    wait(0.03);
} while (true);