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