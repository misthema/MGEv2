Strict

Import mgev2.component.positioncomponent
Import mgev2.component.movementcomponent
Import mgev2.component.gravitycomponent

Interface IPhysics
    Method Position:IPosition() Property
    Method Movement:IMovement() Property
    Method Gravity:IGravity() Property
End

Class PhysicsComponent Extends Component Implements IPhysics
    
    Method Position:IPosition() Property Return _position End
    Method Movement:IMovement() Property Return _movement End
    Method Gravity:IGravity() Property Return _gravity End
    
    Method New()
        Name = "PhysicsComponent"
    End
    
    Method Initialize:Void(owner:IEntity)
        Super.Initialize(owner)
        
        For Local comp:IComponent = EachIn owner.Components()
            If IPosition(comp) Then _position = IPosition(comp)
            If IMovement(comp) Then _movement = IMovement(comp)
            If IGravity(comp) Then _gravity = IGravity(comp)
        Next
    End
    
    Method Finalize:Void()
        _position = Null
        _movement = Null
        _gravity = Null
    End

    Private
        Field _position:IPosition
        Field _movement:IMovement
        Field _gravity:IGravity
        
End

