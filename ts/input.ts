class Input
{
    public forward = false;
    public backwards = false;
    public right = false;
    public left = false;

    constructor()
    {
        document.onkeydown = this.on_down.bind(this);
        document.onkeyup = this.on_up.bind(this);
    }

    private on_down(e:KeyboardEvent):void
    {
        switch (e.which)
        {
            case 37:
                this.left = true;
                break;
            case 38:
                this.forward = true;
                break;
            case 39:
                this.right = true;
                break;
            case 40:
                this.backwards = true;
                break;
            default:
                return;
        }

        e.preventDefault();
    }

    private on_up(e:KeyboardEvent):void
    {
        switch (e.which)
        {
            case 37:
                this.left = false;
                break;
            case 38:
                this.forward = false;
                break;
            case 39:
                this.right = false;
                break;
            case 40:
                this.backwards = false;
                break;
            default:
                return;
        }

        e.preventDefault();
    }
}

var g_input:Input;
