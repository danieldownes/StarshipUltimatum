import Player from '../Player.ts';
import { UiController } from './UiController.ts';

export default class PlayerUiInteractor {
    private player: Player;
    private uiController: UiController;

    constructor(player: Player, uiController: UiController) {
        this.player = player;
        this.uiController = uiController;

        this.player.OnScoreChanged.subscribe(this.handleScoreChanged);
    }

    private handleScoreChanged = (score: number) => {
        this.uiController.setScore(score);
    }
}