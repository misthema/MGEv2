Strict

Import mgev2

Interface IMovement
    Method Velocity:Vector() Property
    Method Acceleration:Vector() Property
    Method Friction:Vector() Property
    Method MaxVelocity:Vector() Property
    Method Reset:Void()
End

Class MovementComponent Extends Component Implements IMovement
    Method Velocity:Vector() Property Return _velocity End
    Method Acceleration:Vector() Property Return _acceleration End
    Method Friction:Vector() Property Return _friction End
    Method MaxVelocity:Vector() Property Return _maxVelocity End
    
    Method Reset:Void()
        Velocity.Set(0, 0)
        Acceleration.Set(0, 0)
    End
    
    Method New(frictionX:Float = 0, frictionY:Float = 0, maxVelX:Float = 10000, maxVelY:Float = 10000)
        _velocity = New Vector()
        _acceleration = New Vector()
        _friction = New Vector(frictionX, frictionY)
        _maxVelocity = New Vector(maxVelX, maxVelY)
        
        Name = "MovementComponent"
    End
    
    Method Finalize:Void()
        _velocity = Null
        _acceleration = Null
        _friction = Null
        _maxVelocity = Null
    End

    Private
        Field _velocity:Vector
        Field _acceleration:Vector
        Field _friction:Vector
        Field _maxVelocity:Vector
End