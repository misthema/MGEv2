Strict

Import mgev2.component.component

Interface IInput
    Method KeyDown:Bool(key:Int)
    Method KeyHit:Bool(key:Int)
    Method KeyUp:Bool(key:Int)
End

Class InputComponent Extends Component Implements IInput

    Method New()
        Name = "InputComponent"
    End
    
    Method KeyDown:Bool(key:Int)
        Return False
    End
    
    Method KeyHit:Bool(key:Int)
        Return False
    End
    
    Method KeyUp:Bool(key:Int)
        Return False
    End
End