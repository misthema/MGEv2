Strict

Import mgev2


Interface IGravity
    Method Force:Vector() Property
End

Class GravityComponent Extends Component Implements IGravity
    Method Force:Vector() Property Return _force End
    
    Method New(gravityX:Float, gravityY:Float)
        _force = New Vector(gravityX, gravityY)
        Name = "GravityComponent"
    End
    
    Method Finalize:Void()
        _force = Null
    End

    Private
        Field _force:Vector
End

