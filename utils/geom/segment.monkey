Strict

Import mgev2.utils.math.vector
Import mgev2.utils.geom.circle
Import mgev2.utils.geom.rectangle

Class Segment
    Field p1:Vector, p2:Vector
    Field intersection:Vector
    
    Method New(x1:Float, y1:Float, x2:Float, y2:Float)
        p1 = New Vector(x1, y1)
        p2 = New Vector(x2, y2)
        intersection = New Vector()
    End
    
    Method New(v1:Vector, v2:Vector)
        p1 = New Vector(v1)
        p2 = New Vector(v2)
        intersection = New Vector()
    End
    
    Method New(seg:Segment)
        p1 = New Vector(seg.p1)
        p2 = New Vector(seg.p2)
        intersection = New Vector()
    End
    
    Method Set:Segment(x1:Float, y1:Float, x2:Float, y2:Float)
        p1.Set(x1, y1)
        p2.Set(x2, y2)
        Return Self
    End
    
    Method Set:Segment(v1:Vector, v2:Vector)
        p1.Set(v1)
        p2.Set(v2)
        Return Self
    End
    
    Method Set:Segment(seg:Segment)
        Self.Set(seg.p1, seg.p2)
        Return Self
    End
    
    Method GetPoint1:Vector()
        Return p1
    End
    
    Method GetPoint2:Vector()
        Return p2
    End
    
    Method GetLength:Float()
        Local len:Float
        
        len = (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)
        
        Return Sqrt(len)
    End
    
    Method GetAngle:Float()
        Return p1.AngleTo(p2)
    End
    
    Method Intersects:Bool(shape:Object)
        If Rectangle(shape) Then
            Return Rectangle(shape).IntersectSegment(Self)
        Else If Circle(shape) Then
            Return Circle(shape).IntersectSegment(Self)
        Else If Segment(shape)
            Return IntersectSegment(Segment(shape))
        End
    
        Return False
    End
    
    Method IntersectSegment:Bool(other:Segment)
        Local rn:Float = (p1.y - other.p1.y) * (other.p2.x - other.p1.x) - (p1.x - other.p1.x) * (other.p2.y - other.p1.y)
        Local rd:Float = (p2.x - p1.x) * (other.p2.y - other.p1.y) - (p2.y - p1.y) * (other.p2.x - other.p1.x)
        
        If rd = 0 Then
            Return False
        Else
            Local sn:Float = (p1.y - other.p1.y) * (p2.x - p1.x) - (p1.x - other.p1.x) * (p2.y - p1.y)
            Local intersection_AB:Float = rn / rd
            Local intersection_CD:Float = sn / rd
            
            If intersection_AB > 1 or intersection_CD > 1 or intersection_AB < 0 or intersection_CD < 0 Then Return False
            
            intersection.x = p1.x + intersection_AB * (p2.x - p1.x)
            intersection.y = p1.y + intersection_AB * (p2.y - p1.y)
            
            Return True
        End
        
        Return False
    End
    
    Method GetIntersection:Vector()
        Return intersection
    End
    
    Method GetIntersectionX:Float()
        Return intersection.x
    End
    
    Method GetIntersectionY:Float()
        Return intersection.y
    End
End