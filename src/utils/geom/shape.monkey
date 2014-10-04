Strict

Import mgev2

Interface IShape
    
End

Class Shape Extends Component Implements IShape
    
    Method New()
        pointsDirty = True
    End
    
    Method CreatePoints:Void() Abstract
    
    Method Rotate:Void(toAngle:Float) Abstract
    
    Method GetX:Float()
        Return center.x
    End
    
    Method SetX:Void(x:Float)
        If x <> center.x Then
            Local dx:Float = x - center.x
            
            If points[0] = Null or center = Null Then
                CheckPoints()
            End
            
            For Local i:= 0 Until points.Length
                points[i].x += dx
            Next
            
            center.x += dx
            'min.x += dx
            'max.x += dx
        End
    End
    
    Method GetY:Float()
        Return center.y
    End
    
    Method SetY:Void(y:Float)
        If y <> center.y Then
            Local dy:Float = y - center.y
            
            If points[0] = Null or center = Null Then
                CheckPoints()
            End
            
            For Local i:= 0 Until points.Length
                points[i].y += dy
            Next
            
            center.y += dy
            'min.y += dy
            'max.y += dy
        End
    End
    
    Method GetLocation:Vector()
        Return center
    End
    
    Method SetLocation:Void(location:Vector)
        SetX(location.x)
        SetY(location.y)
    End
    
    Method GetCenterX:Float()
        CheckPoints()
        
        Return center.x
    End
    
    Method SetCenterX:Void(centerX:Float)
        If points[0] = Null or center = Null
            CheckPoints()
        End
        
        Local diff:Float = centerX - center.x
        SetX(center.x + diff)
    End
    
    Method GetCenterY:Float()
        CheckPoints()
        
        Return center.y
    End
    
    Method SetCenterY:Void(centerY:Float)
        If points[0] = Null or center = Null
            CheckPoints()
        End
        
        Local diff:Float = centerY - center.y
        SetX(center.y + diff)
    End
    
    Method GetMaxX:Float()
        CheckPoints()
        Return max.x
    End
    
    Method GetMaxY:Float()
        CheckPoints()
        Return max.y
    End
    
    Method GetMinX:Float()
        CheckPoints()
        Return min.x
    End
    
    Method GetMinY:Float()
        CheckPoints()
        Return min.y
    End
    
    Method GetPoints:Vector[] ()
        Return points
    End
    
    Method GetNormal:Vector(index:Int)
        If index < 0 Then index += points.Length()
        If index > points.Length Then index -= points.Length()
        
        Return points[index].Normalize()
    End
    
    Method CheckPoints:Void()
        If pointsDirty Then
            CreatePoints()
            FindCenter()
            'CalculateRadius()
            
            If points.Length() > 0 Then
                min.Set(points[0])
                max.Set(min)
                
                For Local i:= 0 Until points.Length()
                    max.x = Max(points[i].x, max.x)
                    max.y = Max(points[i].y, max.y)
                    min.x = Min(points[i].x, min.x)
                    min.y = Min(points[i].y, min.y)
                Next
            End
            
            pointsDirty = False
        End
    End
    
    Method FindCenter:Void()
        If center = Null Then center = New Vector()
        
        #REM
        Local length:Int = points.Length
        
        For Local i:= 0 Until length
            center.x += points[i].x
            center.y += points[i].y
        Next
        
        center.x /= length
        center.y /= length
        #END
        
        center.x = min.x + (max.x - min.x) / 2
        center.y = min.y + (max.y - min.y) / 2
    End
    
    Method Intersects:Bool(other:Shape)
        CheckPoints()
        
        Local result:Bool = False
        Local unknownA:Float, unknownB:Float
        Local nextI:Int, nextJ:Int
        
        #REM
            If Not closed() Then 
        #END
        
        For Local i:= 0 Until points.Length()
            nextI = i + 1
            If nextI >= points.Length() Then nextI = 0
            
            For Local j:= 0 Until other.points.Length()
                nextJ = j + 1
                If nextJ >= other.points.Length() Then nextJ = 0
                
                unknownA = ( ( (points[nextI].x - points[i].x) * (other.points[j].y - points[i].y)) - ( (points[nextI].y - points[i].y) * (other.points[j].x - points[i].x))) / ( ( (points[nextI].y - points[i].y) * (other.points[nextJ].x - other.points[j].x)) - ( (points[nextI].x - points[i].x) * (other.points[nextJ].y - other.points[j].y)))
                unknownB = ( ( (other.points[nextJ].x - other.points[j].x) * (other.points[j].y - points[i].y)) - ( (other.points[nextJ].y - other.points[j].y) * (other.points[j].x - points[i].x))) / ( ( (points[nextI].y - points[i].y) * (other.points[nextJ].x - other.points[j].x)) - ( (points[nextI].x - points[i].x) * (other.points[nextJ].y - other.points[j].y)))
                
                If unknownA >= 0 And unknownA <= 1 And unknownB >= 0 And unknownB <= 1 Then
                    result = True
                    Exit
                End
            Next
            
            If result Then
                Exit
            End
        Next
        
        Return result
    End
    
    Method GetWidth:Float()
        Return max.x - min.x
    End
    
    Method GetHeight:Float()
        Return max.y - min.y
    End
    
    Method Closed:Bool()
        Return True
    End
    
    Method Draw:Void()
        CheckPoints()
        
        Local iNext:Int
        For Local i:= 0 Until points.Length()
            iNext = i + 1
            If iNext >= points.Length() Then iNext = 0
            
            DrawLine(points[i].x, points[i].y, points[iNext].x, points[iNext].y)
        Next
        
        DrawCircle(center.x, center.y, 2)
    End

    Private
        Field points:Vector[]
        Field center:= New Vector()
        Field min:= New Vector(), max:= New Vector()
        Field pointsDirty:Bool
        Field rotation:Float = 0
        
End

Class Line Extends Shape

    Field intersection:Vector = New Vector()

    Method New(x1:Float, y1:Float, x2:Float, y2:Float)
        Super.New()
        p1 = New Vector(x1, y1)
        p2 = New Vector(x2, y2)
        intersection = New Vector()
    End
    
    Method New(v1:Vector, v2:Vector)
        Super.New()
        p1 = New Vector(v1)
        p2 = New Vector(v2)
        intersection = New Vector()
    End
    
    Method New(seg:Line)
        Super.New()
        p1 = New Vector(seg.p1)
        p2 = New Vector(seg.p2)
        intersection = New Vector()
    End
    
    Method Rotate:Void(toAngle:Float)
        rotation = toAngle
    End
    
    Method GetP1:Vector()
        Return p1
    End
    
    Method GetP2:Vector()
        Return p2
    End
    
    Method Length:Float()
        Return vec.Length
    End
    
    Method GetDX:Float()
        Return p2.x - p1.x
    End
    
    Method GetDY:Float()
        Return p2.y - p1.y
    End
    
    Method GetX1:Float() Return p1.x End
    Method GetY1:Float() Return p1.y End
    Method GetX2:Float() Return p2.x End
    Method GetY2:Float() Return p2.y End
    
    
    
    Method Set:Void(x1:Float, y1:Float, x2:Float, y2:Float)
        p1.Set(x1, y1)
        p2.Set(x2, y2)
    End
    
    Method Set:Void(v1:Vector, v2:Vector)
        p1.Set(v1.x, v1.y)
        p2.Set(v2.x, v2.y)
    End
    
    Method Set:Void(seg:Line)
        Self.Set(seg.p1, seg.p2)
    End
    
    Method GetLength:Float()
        Local len:Float
        
        len = (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)
        
        Return Sqrt(len)
    End
    
    Method GetAngle:Float()
        Return p1.AngleTo(p2)
    End
    
    Method GetClosestPoint:Void(point:Vector, result:Vector)
        loc = Vector.MakeBetween(point, p1)
        vec = Vector.MakeBetween(p2, p1)
        
        Local amt:Float = vec.ProjectionAmount(localTemp)
        
        amt = Min(1.0, Max(0.0, amt))
        
        result.Set(p1.Add(vec.Multiply(amt)))
    End
    
    Method DistanceTo:Float(point:Vector)
        GetClosestPoint(point, closest)
        
        Return point.DistanceTo(closest)
    End

    #REM    
    Method DistanceTo:Float(other:Segment)
        Local closest1:Vector = New Vector()
        Local closest2:Vector = New Vector()
        
        GetClosestPoint(other.p1, closest1)
        GetClosestPoint(other.p2, closest2)
        
        Local dist1:Float = other.DistanceTo(closest1)
        Local dist2:Float = other.DistanceTo(closest2)
        
        If dist1 > dist2 Then Return dist2
        If dist1 < dist2 Then Return dist1
        
        Return Min(dist1, dist2)
    End
    #END
    
    Method Intersects:Bool(shape:Shape)
        If Line(shape)
            Return IntersectLine(Line(shape))
        Else If Circle(shape)
            Return Circle(shape).Intersects(Self)
        End
    
        Return Super.Intersects(shape)
    End
    
    Method IntersectLine:Bool(other:Line)
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
    
    Method CreatePoints:Void()
        points = New Vector[2]
        points[0] = GetP1()
        points[1] = GetP2()
    End
    
    Method Closed:Bool()
        Return False
    End
    
    Private
        Field p1:Vector, p2:Vector
        Field vec:Vector = New Vector()
        Field lenSquared:Float
        
        ' Temps
        Field loc:Vector = New Vector()
        Field v:Vector = New Vector()
        Field v2:Vector = New Vector()
        Field proj:Vector = New Vector()
        Field closest:Vector = New Vector()
        Field other:Vector = New Vector()
End

Class Rectangle Extends Shape

    Method New(x:Float, y:Float, width:Float, height:Float)
        Super.New()
        Self.center.Set(x, y)
        Self.x = x
        Self.y = y
        Self.width = width
        Self.height = height
    End
    
    Method Rotate:Void(toAngle:Float)
        rotation = toAngle
        CreatePoints()
    End
    
    Method ContainsPoint:Bool(xp:Float, yp:Float)
        If xp <= x Then Return False
        If yp <= y Then Return False
        If xp >= x + width Then Return False
        If yp >= y + height Then Return False
        Return True
    End
    
    Method Intersects:Bool(other:Shape)
        #REM
        If Rectangle(other) Then
            Local rect:Rectangle = Rectangle(other)
            
            If x > rect.x + rect.width or x + width < rect.x Then Return False
            If y > rect.y + rect.height or y + height < rect.y Then Return False
            Return True
        Else If Circle(other) Then
            Circle(other).Intersects(Self)
        End
        #END
        
        Return Super.Intersects(other)
    End
    
    Method CreatePoints:Void()
        If points.Length() = 0 Then
            points = New Vector[4]
        
            points[0] = New Vector() ' Top-left
            points[1] = New Vector() ' Top-right
            points[2] = New Vector() ' Bottom-right
            points[3] = New Vector() ' Bottom-left
        End

        Local halfWidth:Float = width / 2
        Local halfHeight:Float = height / 2
        Local theCos:Float = Cos(rotation)
        Local theSin:Float = -Sin(rotation)
        
        points[0].Set(center.x + halfWidth * theCos - halfHeight * theSin, center.y + halfHeight * theCos + halfWidth * theSin) ' Top-left
        points[1].Set(center.x - halfWidth * theCos - halfHeight * theSin, center.y + halfHeight * theCos - halfWidth * theSin) ' Top-right
        points[2].Set(center.x - halfWidth * theCos + halfHeight * theSin, center.y - halfHeight * theCos - halfWidth * theSin) ' Bottom-right
        points[3].Set(center.x + halfWidth * theCos + halfHeight * theSin, center.y - halfHeight * theCos + halfWidth * theSin) ' Bottom-left
        
        min.Set(9999, 9999)
        max.Set(-9999, -9999)
        
        For Local i:= 0 Until 4
            min.x = Min(points[i].x, min.x)
            min.y = Min(points[i].y, min.y)
            max.x = Max(points[i].x, max.x)
            max.y = Max(points[i].y, max.y)
        Next
        
        FindCenter()
        
        #REM
            TL  =  x + ( Width / 2 ) * cos A - ( Height / 2 ) * sin A ,  y + ( Height / 2 ) * cos A  + ( Width / 2 ) * sin A
            TR  =  x - ( Width / 2 ) * cos A - ( Height / 2 ) * sin A ,  y + ( Height / 2 ) * cos A  - ( Width / 2 ) * sin A
            BL =   x + ( Width / 2 ) * cos A + ( Height / 2 ) * sin A ,  y - ( Height / 2 ) * cos A  + ( Width / 2 ) * sin A
            BR  =  x - ( Width / 2 ) * cos A + ( Height / 2 ) * sin A ,  y - ( Height / 2 ) * cos A  - ( Width / 2 ) * sin A
        #END
    End
    
    Private
        Field x:Float, y:Float
        Field width:Float, height:Float
        
End

Class Circle Extends Shape
    Const DEFAULT_SEGMENT_COUNT:Int = 16
    
    Field radius:Float
    Field segments:Int
    
    
    Method New(x:Float, y:Float, radius:Float, segment_count:Int = DEFAULT_SEGMENT_COUNT)
        Super.New()
        Self.center.x = x
        Self.center.y = y
        Self.radius = radius
        Self.segments = segment_count
    End
    
    Method Rotate:Void(toAngle:Float)
        rotation = toAngle
        CreatePoints()
    End
    
    Method Intersects:Bool(other:Shape)
        If Circle(other) Then
            Local circle:Circle = Circle(other)
            
            Local totalRad:Float = Self.radius + circle.radius
            
            If Abs(other.center.x - center.x) > totalRad Then Return False
            If Abs(other.center.y - center.y) > totalRad Then Return False
            
            totalRad *= totalRad
            
            Local dx:Float = Abs(other.center.x - center.x)
            Local dy:Float = Abs(other.center.y - center.y)
            
            Return totalRad >= ( (dx * dx) + (dy * dy))
        Else If Rectangle(other)
            Return IntersectRectangle(Rectangle(other))
        Else If Line(other)
            Return IntersectLine(Line(other))
        Else
            Return Super.Intersects(other)
        End
    End
    
    Method ContainsPoint:Bool(x:Float, y:Float)
        Local dx:Float = x - (center.x - radius)
        Local dy:Float = y - (center.y - radius)
        Local rad:Float = radius * radius
        
        Return (dx * dx) + (dy * dy) < rad
    End
    
    Method ContainsLine:Bool(line:Line)
        Return ContainsPoint(line.GetX1(), line.GetY1()) And ContainsPoint(line.GetX2(), line.GetY2())
    End
    
    'Method FindCenter:Void()
        
    'End
    
    Method IntersectRectangle:Bool(rect:Rectangle)
        If rect.ContainsPoint(center.x, center.y) Then Return True
        
        Local rectPoints:Vector[] = rect.GetPoints()
        
        If rectLines[0] = Null Then
            rectLines = New Line[4]
            
            rectLines[0] = New Line(0, 0, 0, 0) ' TOP
            rectLines[1] = New Line(0, 0, 0, 0) ' RIGHT
            rectLines[2] = New Line(0, 0, 0, 0) ' BOTTOM
            rectLines[3] = New Line(0, 0, 0, 0) ' LEFT
        End
        
        If rectPoints.Length() = 0 Then Return False
        If rectPoints[0] = Null Then Return False
        
        rectLines[0].Set(rectPoints[0], rectPoints[1]) ' 0 -> 1
        rectLines[1].Set(rectPoints[1], rectPoints[2]) ' 1 -> 2
        rectLines[2].Set(rectPoints[2], rectPoints[3]) ' 2 -> 3
        rectLines[3].Set(rectPoints[3], rectPoints[0]) ' 3 -> 0
        
        Local result:Bool = False
        For Local i:= 0 Until 4
            result = IntersectLine(rectLines[i])
            If result Then Exit
        Next
        
        Return result
    End
    
    Method IntersectLine:Bool(line:Line)
        Local circleToLine:Vector = Vector.MakeBetween(center, line.p1)
        Local lineVec:Vector = Vector.MakeBetween(line.p2, line.p1)
        
        Local amt:Float = lineVec.ProjectionAmount(circleToLine)
        
        amt = Min(1.0, Max(0.0, amt))
        
        projection.Set(line.p1.Add(lineVec.Multiply(amt)))
        
        Local distance:Float = projection.DistanceTo(center)
        
        Return distance <= radius
    End
    
    Method CreatePoints:Void()
        Local tempPoints:= New List<Vector>()
        
        min.Set(9999, 9999)
        max.Set(-9999, -9999)
        
        Local start:Float = 0.0
        Local stop:Float = 359.0
        
        Local lstep:Int = 360 / segments
        
        Local ang:Float, a:Float = start, newX:Float, newY:Float
        
        While a <= stop + lstep
            ang = a
            If ang > stop Then ang = stop
            
            newX = center.x + Cos(ang + rotation) * radius
            newY = center.y - Sin(ang + rotation) * radius
            
            If newX < min.x Then min.x = newX
            If newY < min.y Then min.y = newY
            If newX > max.x Then max.x = newX
            If newY > max.y Then max.y = newY
            
            tempPoints.AddLast(New Vector(newX, newY))
            a += lstep
        Wend
        
        points = tempPoints.ToArray()
    End
    
    Private
        Field projection:Vector = New Vector()
        Field rectLines:Line[4]
End