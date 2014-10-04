Strict

Import mgev2

Class Circle
    Field position:Vector
    Field radius:Float
    Field projection:Vector
    
    Method New(x:Float, y:Float, r:Float)
        position = New Vector(x, y)
        radius = r
        projection = position
    End
    
    Method New(vec:Vector, r:Float)
        position = New Vector(vec)
        radius = r
        projection = position
    End
    
    Method New(other:Circle)
        position = New Vector(other.position)
        radius = other.radius
        projection = position
    End
    
    Method GetX:Float()
        Return position.x
    End
    
    Method GetY:Float()
        Return position.y
    End
    
    Method GetRadius:Float()
        Return radius
    End
    
    Method GetDiameter:Float()
        Return radius * 2.0
    End
    
    Method Intersects:Bool(shape:Object)
        If Rectangle(shape) Then
            Return IntersectRectangle(Rectangle(shape))
        Else If Circle(shape) Then
            Return IntersectCircle(Circle(shape))
        Else If Segment(shape)
            Return IntersectSegment(Segment(shape))
        End
    
        Return False
    End
    
    Method IntersectCircle:Bool(circle:Circle)
        Local distance:Float = position.DistanceTo(circle.position)
        Local r2:Float = GetRadius() +circle.GetRadius()
        
        Return distance <= r2
    End
    
    Method IntersectRectangle:Bool(rect:Rectangle)
        Return False
    End
    
    Method IntersectSegment:Bool(segment:Segment)
        Local circleToLine:Vector = Vector.MakeBetween(position, segment.p1)
        Local line:Vector = Vector.MakeBetween(segment.p2, segment.p1)
        
        Local amt:Float = line.ProjectionAmount(circleToLine)
        
        amt = Min(1.0, Max(0.0, amt))
        
        projection = New Vector(segment.p1.Add(line.Multiply(amt)))
        
        Local distance:Float = projection.DistanceTo(position)
        
        Return distance <= radius
    End
    
    
    
End