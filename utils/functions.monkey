Function ComputeVelocity:Float(Velocity:Float, Acceleration:Float = 0, Drag:Float = 0, Max:Float = 10000, delta:Float)
    If (Acceleration <> 0)
        Velocity += Acceleration * delta
    Else If (Drag <> 0)
        Local d:Float = Drag * delta
        If (Velocity - d > 0)
            Velocity = Velocity - d
        Else If (Velocity + d < 0)
            Velocity += d
        Else
            Velocity = 0
        End
    End
            
    If ( (Velocity <> 0) And (Max <> 10000))
        If (Velocity > Max)
            Velocity = Max
        Else If (Velocity < - Max)
            Velocity = -Max
        End
    End
        
    Return Velocity
End