Strict

Import mgev2.system.system
Import mgev2.component.physicscomponent
Import mgev2.component.entity
Import mgev2.utils.functions


Class PhysicsSystem Extends System<IPhysics>
    
    Method OnUpdate:Void(delta:Float)
        For Local phys:IPhysics = EachIn ComponentList()
            ComputeVelocities(phys, delta)
            ApplyGravity(phys, delta)
            ApplyVelocity(phys, delta)
        Next
    End
    
    Method ComputeVelocities:Void(phys:IPhysics, delta:Float)
        If phys.Movement = Null Then Return
        
        
        
        phys.Movement.Velocity.x = ComputeVelocity(phys.Movement.Velocity.x, phys.Movement.Acceleration.x, phys.Movement.Friction.x, phys.Movement.MaxVelocity.x, delta)
        phys.Movement.Velocity.y = ComputeVelocity(phys.Movement.Velocity.y, phys.Movement.Acceleration.y, phys.Movement.Friction.y, phys.Movement.MaxVelocity.y, delta)
    End
    
    Method ApplyGravity:Void(phys:IPhysics, delta:Float)
        If phys.Gravity = Null Then Return
        
        phys.Movement.Acceleration.x = ComputeVelocity(phys.Movement.Acceleration.x, phys.Gravity.Force.x, phys.Movement.Friction.x, 10000, delta)
        phys.Movement.Acceleration.y = ComputeVelocity(phys.Movement.Acceleration.y, phys.Gravity.Force.y, phys.Movement.Friction.y, 10000, delta)
    End
    
    Method ApplyVelocity:Void(phys:IPhysics, delta:Float)
        If phys.Movement = Null Then Return
        
        phys.Position.ToVector().x += phys.Movement.Velocity.x * delta
        phys.Position.ToVector().y += phys.Movement.Velocity.y * delta
    End
End