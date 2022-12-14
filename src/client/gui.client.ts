import { Players } from "@rbxts/services";


interface PlayerGui extends BasePlayerGui {
	ScreenGui: ScreenGui & {
		Menu: Frame & {
			menus: Folder & {
				Inventory: Frame & {
					Items: ScrollingFrame & {
						UICorner: UICorner;
						UIStroke: UIStroke;
						UIPadding: UIPadding;
						UIGridLayout: UIGridLayout;
					};
					ItemTemplate: ImageButton & {
						UICorner: UICorner;
						Quantity: TextLabel;
						UIPadding: UIPadding;
					};
					UIPadding: UIPadding;
				};
				Help: Frame & {
					UIPadding: UIPadding;
					ItemPage: Frame & {
						Image: ImageLabel & {
							UICorner: UICorner;
						};
						UIPadding: UIPadding;
						UICorner: UICorner;
						UIStroke: UIStroke;
						Info: TextLabel;
						Stats: TextLabel;
					};
					Pages: ScrollingFrame & {
						UICorner: UICorner;
						UIStroke: UIStroke;
						UIPadding: UIPadding;
						UIListLayout: UIListLayout;
					};
					PageButtonTemp: TextButton & {
						UICorner: UICorner;
						UIPadding: UIPadding;
					};
				};
				Settings: Frame & {
					UIPadding: UIPadding;
					Items: ScrollingFrame & {
						UICorner: UICorner;
						UIStroke: UIStroke;
						UIPadding: UIPadding;
						UIListLayout: UIListLayout;
					};
				};
			};
			UIPadding: UIPadding;
			active: StringValue;
			UICorner: UICorner;
			["static"]: Folder & {
				line: Frame;
			};
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			name: TextLabel;
			UIStroke: UIStroke;
			menuButtons: Folder & {
				Inventory: ImageButton & {
					UICorner: UICorner;
				};
				Calculator: ImageButton & {
					UICorner: UICorner;
				};
				Help: ImageButton & {
					UICorner: UICorner;
				};
				Settings: ImageButton & {
					UICorner: UICorner;
				};
			};
			UISizeConstraint: UISizeConstraint;
		};
		UIPadding: UIPadding;
		UIScale: UIScale;
	};
	ItemGui: BillboardGui & {
		ItemName: TextLabel;
	};
}