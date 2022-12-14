import { Players, UserInputService } from "@rbxts/services";
import { t } from "@rbxts/t";

const player = Players.LocalPlayer;


function get_input( input: InputObject ) {
    /* walk <-> run */
    if ( input.KeyCode === Enum.KeyCode.LeftShift || input.KeyCode === Enum.KeyCode.RightShift) return 1;
    /* open inventory */
    if ( input.KeyCode === Enum.KeyCode.E ) return 2;
    /* open menu */
    if ( input.KeyCode === Enum.KeyCode.M ) return 3;
    /* other */
    return 0;
};

let Humanoid: Humanoid;

player.CharacterAdded.Connect(character => {
    Humanoid = character.WaitForChild('Humanoid') as Humanoid;
});

UserInputService.InputBegan.Connect(input => {
    const key: number = get_input( input );
    print(key)
    switch ( key ) {
        case 1:
            if ( Humanoid.WalkSpeed === 32 ) Humanoid.WalkSpeed = 16;
            else if ( Humanoid.WalkSpeed === 16 ) Humanoid.WalkSpeed = 32;
            break;
        case 0:
            break;
    };
});