Strict

Import mgev2.system.system
Import mgev2.component.physicscomponent
Import mgev2.component.entity
Import mgev2.utils.functions


Class PhysicsSystem Extends System<IPhysics>
    
    Method OnUpdate:Void(delta:Float)
        For Local phys:IPhysics = EachIn ComponentList()
            If phys.Position.X > DeviceWidth() Then
                phys.Position.X = 0
            End
            If phys.Position.Y > DeviceHeight() Then
                phys.Position.Y = 0
            End
            If phys.Position.X < 0 Then
                phys.Position.X = DeviceWidth()
            End
            If phys.Position.Y < 0 Then
                phys.Position.Y = DeviceHeight()
            End
            
            ComputeVelocities(phys, delta)
            ApplyGravity(phys, delta)
            ApplyVelocity(phys, delta)
        Next
    End
    
    Method ComputeVelocities:Void(phys:IPhysics, delta:Float)
        If phys.Movement = Null Then Return
        
        If phys.Movement.Acceleration.Length = 0 Then Return
        
        phys.Movement.Velocity.x = ComputeVelocity(phys.Movement.Velocity.x, phys.Movement.Acceleration.x, phys.Movement.Friction.x, phys.Movement.MaxVelocity.x, delta)
        phys.Movement.Velocity.y = ComputeVelocity(phys.Movement.Velocity.y, phys.Movement.Acceleration.y, phys.Movement.Friction.y, phys.Movement.MaxVelocity.y, delta)
    End
    
    Method ApplyGravity:Void(phys:IPhysics, delta:Float)
        If phys.Gravity = Null Then Return
        
        If phys.Gravity.Force.Length = 0 Then Return
        
        phys.Movement.Velocity.x = ComputeVelocity(phys.Movement.Velocity.x, phys.Gravity.Force.x, phys.Movement.Friction.x, phys.Movement.MaxVelocity.x, delta)
        phys.Movement.Velocity.y = ComputeVelocity(phys.Movement.Velocity.y, phys.Gravity.Force.y, phys.Movement.Friction.y, phys.Movement.MaxVelocity.y, delta)
    End
    
    Method ApplyVelocity:Void(phys:IPhysics, delta:Float)
        If phys.Movement = Null Then Return
        
        if phys.Movement.Velocity.Length = 0 Then Return
        
        phys.Position.ToVector().x += phys.Movement.Velocity.x * delta
        phys.Position.ToVector().y += phys.Movement.Velocity.y * delta
    End
End