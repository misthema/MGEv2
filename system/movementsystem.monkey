Strict

Import mgev2.system.system
Import mgev2.component.physicscomponent
Import mgev2.component.entity
Import mgev2.utils.functions


Class PhysicsSystem Extends System<IPhysics>
    
    Method OnUpdate:Void(delta:Float)
        For Local phys:IPhysics = EachIn ComponentList()
            If phys.Position.Y > DeviceHeight() Then
                phys.Position.Y = 100
                phys.Position.X = 16 + (Rnd() * DeviceWidth() -32)
                phys.Movement.Reset()
            End
            
            ComputeVelocities(phys, delta)
            ApplyGravity(phys, delta)
            ApplyVelocity(phys, delta)
        Next
    End
    
    Method ComputeVelocities:Void(phys:IPhysics, delta:Float)
        phys.Movement.Velocity.x = ComputeVelocity(phys.Movement.Velocity.x, phys.Movement.Acceleration.x, phys.Movement.Friction.x, phys.Movement.MaxVelocity.x, delta)
        phys.Movement.Velocity.y = ComputeVelocity(phys.Movement.Velocity.y, phys.Movement.Acceleration.y, phys.Movement.Friction.y, phys.Movement.MaxVelocity.y, delta)
    End
    
    Method ApplyGravity:Void(phys:IPhysics, delta:Float)
        phys.Movement.Acceleration.x = ComputeVelocity(phys.Movement.Acceleration.x, phys.Gravity.Force.x, phys.Movement.Friction.x, 10000, delta)
        phys.Movement.Acceleration.y = ComputeVelocity(phys.Movement.Acceleration.y, phys.Gravity.Force.y, phys.Movement.Friction.y, 10000, delta)
    End
    
    Method ApplyVelocity:Void(phys:IPhysics, delta:Float)
        phys.Position.ToVector().Add(phys.Movement.Velocity)
    End
End