Strict

Import mgev2.component.positioncomponent
Import mgev2.component.movementcomponent
Import mgev2.component.physicscomponent
Import mgev2.component.sizecomponent

Import mgev2.component.entity

Interface ICollisionResponse
    Method onCallback:Void(ent1:IEntity, ent2:IEntity)
End

Class CollisionSeparate Implements ICollisionResponse
    Method onCallback:Void(ent1:IEntity, ent2:IEntity)
        SeparateX(ent1, ent2)
        SeparateY(ent1, ent2)
    End
    
    Method SeparateX:Void(ent1:IEntity, ent2:IEntity)
        Local pos1:IPosition = IPosition(ent1.GetComponent("PositionComponent"))
        Local pos2:IPosition = IPosition(ent2.GetComponent("PositionComponent"))
        
        Local size1:Float = BasicDisplayObject(ent1.GetComponent("DisplayObject")).Width
        Local size2:Float = BasicDisplayObject(ent2.GetComponent("DisplayObject")).Width
        
        Local vel1:MovementComponent = MovementComponent(ent1.GetComponent("MovementComponent"))
        Local vel2:MovementComponent = MovementComponent(ent2.GetComponent("MovementComponent"))
        
        If pos1 = Null or pos2 = Null or size1 = 0 or size2 = 0 Then Return
    
        Local overlap1:Float = pos1.X - pos2.X ' If positive, ent2 is on ent1's right side
        'Local overlap2:Float = pos2.X - pos1.X ' If positive, ent1 is on ent2's right side
        
        If overlap1 < 0 Then
            pos1.X = pos2.X - size1
            vel1.Velocity.x = -vel1.Velocity.x
            vel2.Velocity.x = -vel2.Velocity.x
        Else
            pos1.X = pos2.X + size2
            vel1.Velocity.x = -vel1.Velocity.x
            vel2.Velocity.x = -vel2.Velocity.x
        End
    End
    
    Method SeparateY:Void(ent1:IEntity, ent2:IEntity)
        Local pos1:IPosition = IPosition(ent1.GetComponent("PositionComponent"))
        Local pos2:IPosition = IPosition(ent2.GetComponent("PositionComponent"))
        
        Local size1:Float = BasicDisplayObject(ent1.GetComponent("DisplayObject")).Height
        Local size2:Float = BasicDisplayObject(ent2.GetComponent("DisplayObject")).Height
        
        Local vel1:MovementComponent = MovementComponent(ent1.GetComponent("MovementComponent"))
        Local vel2:MovementComponent = MovementComponent(ent2.GetComponent("MovementComponent"))
        
        If pos1 = Null or pos2 = Null or size1 = 0 or size2 = 0 Then Return
        
        Local overlap1:Float = pos1.Y - pos2.Y ' If positive, ent2 is on ent1's right side
        'Local overlap2:Float = pos2.X - pos1.X ' If positive, ent1 is on ent2's right side
        
        If overlap1 < 0 Then
            pos1.Y = pos2.Y - size1
            vel1.Velocity.y = -vel1.Velocity.y
            vel2.Velocity.y = -vel2.Velocity.y
        Else
            pos1.Y = pos2.Y + size2
            vel1.Velocity.y = -vel1.Velocity.y
            vel2.Velocity.y = -vel2.Velocity.y
        End
    End
End