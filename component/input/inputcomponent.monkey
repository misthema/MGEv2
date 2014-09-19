Strict

Import mgev2.component.component

Interface IInput
    Method KeyDown:Bool(key:Int)
    Method KeyHit:Bool(key:Int)
    Method KeyUp:Bool(key:Int)
End

Class InputComponent Extends Component Implements IInput
    
    Method KeyDown:Bool(key:Int)
        
    End
    
    Method KeyHit:Bool(key:Int)
    
    End
    
    Method KeyUp:Bool(key:Int)
    
    End

    Private
        Field _keystates:Int[256]
        Field _dirty:Bool
        
End