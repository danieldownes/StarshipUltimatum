import { SimpleEventDispatcher } from "strongly-typed-events";

export default class InputKeys
{
    private keyDownDispatcher = new SimpleEventDispatcher<string>();
    private keyUpDispatcher = new SimpleEventDispatcher<string>();

	public readonly KeyIsDown = new Set<string>()

    constructor()
	{
        document.addEventListener('keydown', this.handleKeyDown)
		document.addEventListener('keyup', this.handleKeyUp)
    }

    private handleKeyDown = (event: KeyboardEvent) => {
		this.KeyIsDown.add(event.key.toLowerCase())
        this.keyDownDispatcher.dispatch(event.key.toLowerCase())
	}

    private handleKeyUp = (event: KeyboardEvent) => {
		this.KeyIsDown.delete(event.key.toLowerCase())
        this.keyUpDispatcher.dispatch(event.key.toLowerCase())
	}

    public get OnKeyUp() {
        return this.keyUpDispatcher.asEvent();
      }
    
      public get OnKeyDown() {
        return this.keyDownDispatcher.asEvent();
      }
}