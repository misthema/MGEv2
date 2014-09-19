Strict

Import mgev2.component.component
Import mgev2.utils.vector


Interface IGravity
    Method Force:Vector() Property
End

Class GravityComponent Extends Component Implements IGravity
    Method Force:Vector() Property Return _force End
    
    Method New(gravityX:Float, gravityY:Float)
        _force = New Vector(gravityX, gravityY)
    End
    
    Method Finalize:Void()
        _force = Null
    End

    Private
        Field _force:Vector
End
