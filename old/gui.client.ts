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
				["static"]: TextBox;
				run: TextButton & {
					UICorner: UICorner;
				};
				output: ScrollingFrame & {
					line: TextBox;
				};
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
wait(2);
const inputBox = playerGui.ScreenGui.menu.console.input;

function consoleOut(text: string) {
    const output = playerGui.ScreenGui.menu.console.output.line.Clone();
    output.Text = text;
    output.Position = new UDim2(0.01, 0,0, 0)
    playerGui.ScreenGui.menu.console.output.GetChildren().forEach(child => {
        assert(child.IsA('TextBox'));
        child.Position = child.Position.add(new UDim2(0,0,0.03,0));
        if (child.Position.Y.Scale >= 0.95) child.Destroy();
    });
    output.Parent = playerGui.ScreenGui.menu.console.output;
}

playerGui.ScreenGui.menu.console.run.Activated.Connect(() => {
    const toRun = inputBox.Text;
    inputBox.Text = '';
    consoleOut(`running "${toRun}"`);
    wait(0.5)
    switch (toRun.split(' ')[0]) {
        case 'give':
            consoleOut(`no my ${toRun.split(' ')[1]}`);
            break;
        case 'check':
            if (toRun.split(' ')[1] === 'brain') {
                consoleOut(`${toRun.split(' ')[1]} has 1 cell(s)`);
            } else {
                consoleOut(`${toRun.split(' ')[1]} is OK`);
            }
            break;
    }
})

async function start() {
    wait(1);
    consoleOut('starting system functions...');
    wait(1);
    consoleOut('system functions operational');
    wait(0.5);
    consoleOut('welcome to Raynbo OS v1.9.2');
    wait(0.1);
    consoleOut('checking vitals...');
    wait(1);
    consoleOut('client vitals OK');
    wait(0.1);
    consoleOut('type a command to continue!');
}
start()
do {
    do {
        let keypoints = playerGui.ScreenGui.menu.background.UIGradient.Transparency as NumberSequence;
        let newKeypoints = [];
        let c = 1;
        for (let keypoint of keypoints.Keypoints) {
            if (c === 1) {
                newKeypoints.push(new NumberSequenceKeypoint(0, 1));
            } else if (c === 20) {
                newKeypoints.push(new NumberSequenceKeypoint(1, 1));
            } else if (keypoint.Time + 0.1 > 1) {
                newKeypoints.insert(1, new NumberSequenceKeypoint(0.01, math.random(60, 100) * 0.01));
            } else {
                newKeypoints.push(new NumberSequenceKeypoint(keypoint.Time + 0.1, keypoint.Value));
            };
            c++
        };
        playerGui.ScreenGui.menu.background.UIGradient.Transparency = new NumberSequence(newKeypoints);
        wait(0.06);
    } while (playerGui.ScreenGui.menu.Visible);
    wait(1)
} while (true);