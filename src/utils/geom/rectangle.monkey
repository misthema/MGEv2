Strict

Import mgev2.utils.math.vector
Import circle
Import segment

Class Rectangle
    Field position:Vector
    Field size:Vector
    
    Method New(x:Float, y:Float, w:Float, h:Float)
        position = New Vector(x, y)
        size = New Vector(w, h)
    End
    
    Method New(rect:Rectangle)
        position = New Vector(rect.position)
        size = New Vector(rect.size)
    End
    
    Method GetX:Float()
        Return position.x
    End
    
    Method GetY:Float()
        Return position.y
    End
    
    Method GetWidth:Float()
        Return size.x
    End
    
    Method GetHeight:Float()
        Return size.y
    End
    
    Method GetHalfWidth:Float()
        Return size.x / 2
    End
    
    Method GetHalfHeight:Float()
        Return size.y / 2
    End

    Method MoveTo:Void(x:Float, y:Float)
        position.Set(x, y)
    End
    
    Method MoveTo:Void(vec:Vector)
        position.Set(vec)
    End
    
    Method Resize:Void(w:Float, h:Float)
        size.Set(w, h)
    End
    
    Method Resize:Void(vec:Vector)
        size.Set(vec)
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
    
    Method IntersectRectangle:Bool(other:Rectangle)
        Local minX1:Float = Self.GetX() -Self.GetHalfWidth()
        Local minY1:Float = Self.GetY() -Self.GetHalfHeight()
        Local maxX1:Float = minX1 + Self.GetWidth()
        Local maxY1:Float = minY1 + Self.GetHeight()
        
        Local minX2:Float = other.GetX() -other.GetHalfWidth()
        Local minY2:Float = other.GetY() -other.GetHalfHeight()
        Local maxX2:Float = minX2 + other.GetWidth()
        Local maxY2:Float = minY2 + other.GetHeight()
        
        Return (minX1 < maxX2) And (minY1 < maxY2) And (maxX1 > minX2) And (maxY1 > minY2)
    End
    
    Method IntersectCircle:Bool(circle:Circle)
        Return circle.IntersectRectangle(Self)
    End
    
    Method IntersectSegment:Bool(segment:Segment)
        Return False
    End
    
End