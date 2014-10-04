Strict

Import mgev2

Class Vector
    Field x:Float, y:Float
    
    Method New(x:Float = 0, y:Float = 0)
        Self.Set(x, y)
    End
    
    Method New(other:Vector)
        Self.Set(other)
    End
    
    ' ==========================
    ' SET
    ' ==========================
    Method Set:Vector(x:Float, y:Float)
        Self.x = x
        Self.y = y
        Return Self
    End
    
    Method Set:Vector(other:Vector)
        Return Self.Set(other.x, other.y)
    End
    
    
    ' ==========================
    ' ADD
    ' ==========================
    Method Add:Vector(x:Float, y:Float)
        tmpVec = New Vector(Self)
        tmpVec.x += x
        tmpVec.y += y
        Return tmpVec
    End
    
    Method Add:Vector(other:Vector)
        tmpVec = New Vector(Self)
        tmpVec.x += other.x
        tmpVec.y += other.y
        Return tmpVec
    End
    
    ' ==========================
    ' SUBSTRACT
    ' ==========================
    Method Substract:Vector(x:Float, y:Float)
        tmpVec = New Vector(Self)
        tmpVec.x -= x
        tmpVec.y -= y
        Return tmpVec
    End
    
    Method Substract:Vector(other:Vector)
        tmpVec = New Vector(Self)
        tmpVec.x += other.x
        tmpVec.y += other.y
        Return tmpVec
    End
    
    ' ==========================
    ' MULTIPLY
    ' ==========================
    Method Multiply:Vector(x:Float, y:Float)
        tmpVec = New Vector(Self)
        tmpVec.x *= x
        tmpVec.y *= y
        Return tmpVec
    End
    
    Method Multiply:Vector(amount:Float)
        tmpVec = New Vector(Self)
        tmpVec.x *= amount
        tmpVec.y *= amount
        Return tmpVec
    End
    
    Method Multiply:Vector(other:Vector)
        tmpVec = New Vector(Self)
        tmpVec.x *= other.x
        tmpVec.y *= other.y
        Return tmpVec
    End
    
    ' ==========================
    ' DIVIDE
    ' ==========================
    Method Divide:Vector(x:Float, y:Float)
        tmpVec = New Vector(Self)
        tmpVec.x /= x
        tmpVec.y /= y
        Return tmpVec
    End
    
    Method Divide:Vector(amount:Float)
        tmpVec = New Vector(Self)
        tmpVec.x /= amount
        tmpVec.y /= amount
        Return tmpVec
    End
    
    Method Divide:Vector(other:Vector)
        tmpVec = New Vector(Self)
        tmpVec.x /= other.x
        tmpVec.y /= other.y
        Return tmpVec
    End
    
    ' ==========================
    ' ROTATE
    ' ==========================
    Method Rotate:Vector(angle:Float)
        Local curMag:Float = Self.Length
        tmpVec = New Vector(Self)
        tmpVec.x = curMag * Cos(angle)
        tmpVec.y = curMag * Sin(angle)
        Return tmpVec
    End
    
    ' ==========================
    ' ANGLE
    ' ==========================
    Method Angle:Float() Property
        Return 180 - ATan2(-Self.y, -Self.x)
    End
    
    Method Angle:Void(value:Float) Property
        Local len:Float = Self.Length
        value = Math.WrapAngle(value)
        Self.x = Cos(value) * len
        Self.y = -Sin(value) * len
    End
    
    ' ==========================
    ' INVERT
    ' ==========================
    Method Invert:Vector()
        tmpVec = New Vector(Self)
        tmpVec.x *= -1
        tmpVec.y *= -1
        Return tmpVec
    End
    
    ' ==========================
    ' LENGTH
    ' ==========================
    Method Length:Float() Property
        Return Sqrt(x * x + y * y)
    End
    
    Method Length:Void(value:Float) Property
        If value = 0 Then
            Self.x = 0
            Self.y = 0
            Return
        End
        
        If Length > 0 Then
            Self.Set(Multiply(value / Length))
        Else
            y = 0
            x = value
        End
    End
    
    ' ==========================
    ' NORMALIZE
    ' ==========================
    Method Normalize:Vector()
        If Self.Length = 0 Then
            Return Self ' Cannot normalize
        End
        
        tmpVec = New Vector(Self)
        
        tmpVec.x /= Self.Length
        tmpVec.y /= Self.Length
        Return tmpVec
    End
    
    ' ==========================
    ' DOT-PRODUCT
    ' ==========================
    Method Dot:Float(other:Vector)
        Return (Self.x * other.x + Self.y * other.y)
    End
    
    ' ==========================
    ' CROSS-PRODUCT
    ' ==========================
    Method Cross:Float(other:Vector)
        Return (Self.x * other.y - Self.y * other.x)
    End
    
    ' ==========================
    ' PROJECT
    ' ==========================
    Method Project:Vector(other:Vector)
        Local scalar:Float = Self.Dot(other) / (other.Length * other.Length)
        tmpVec = New Vector(Self)
        tmpVec.Set(other)
        tmpVec.Multiply(scalar)
        
        Return tmpVec
    End
    
    ' ==========================
    ' PROJECTION AMOUNT
    ' ==========================
    Method ProjectionAmount:Float(other:Vector)
        Return Self.Normalize().Dot(other) / Self.Length
    End
    
    ' ==========================
    ' REFLECT
    ' ==========================
    Method Reflect:Vector(other:Vector)
        Local norm:Vector = other.Normalize()
        Local dot:Float = Self.Dot(norm)
        
        tmpVec = New Vector(Self)
        tmpVec.x = x - 2 * dot * norm.x
        tmpVec.y = y - 2 * dot * norm.y
        Return tmpVec
    End
    
    ' ==========================
    ' ANGLE BETWEEN
    ' ==========================
    Method AngleBetween:Float(other:Vector)
        Return ACos(Self.Dot(other) / (Self.Length * other.Length))
    End
    
    ' ==========================
    ' ANGLE BETWEEN SIN
    ' ==========================
    Method AngleBetweenSin:Float(other:Vector)
        Return Self.Cross(other) / (Self.Length * other.Length)
    End
    
    ' ==========================
    ' ANGLE BETWEEN COS
    ' ==========================
    Method AngleBetweenCos:Float(other:Vector)
        Return Self.Dot(other) / (Self.Length * other.Length)
    End
    
    ' ==========================
    ' SWAP
    ' ==========================
    Method Swap:Vector(other:Vector)
        Local tX:Float = Self.x
        Local tY:Float = Self.y
        
        Self.x = other.x
        Self.y = other.y
        
        other.x = tX
        other.y = tY
        
        Return Self
    End
    
    ' ==========================
    ' RIGHT NORMAL
    ' ==========================
    Method RightNormal:Vector()
        Return New Vector(Self.y, -Self.x)
    End
    
    ' ==========================
    ' LEFT NORMAL
    ' ==========================
    Method LeftNormal:Vector()
        Return New Vector(-Self.y, Self.x)
    End
    
    ' ==========================
    ' IS NORMAL TO
    ' ==========================
    Method IsNormalTo:Bool(other:Vector)
        Return (Self.Dot(other) = 0)
    End
    
    ' ==========================
    ' IS EQUAL TO
    ' ==========================
    Method IsEqualTo:Bool(other:Vector)
        Return (Self.x = other.x And Self.y = other.y)
    End
    
    ' ==========================
    ' DISTANCE TO
    ' ==========================
    Method DistanceTo:Float(other:Vector)
        Local dx:Float = Self.x - other.x
        Local dy:Float = Self.y - other.y
        Return Sqrt(dx * dx + dy * dy)
    End
    
    ' ==========================
    ' ANGLE TO
    ' ==========================
    Method AngleTo:Float(other:Vector)
        Return 180 - ATan2(Self.y - other.y, Self.x - other.x)
    End
    
    ' ==========================
    ' MAKE BETWEEN
    ' ==========================
    Function MakeBetween:Vector(vecFrom:Vector, vecTo:Vector)
        tmpVec = New Vector()
        If vecFrom = Null or vecTo = Null Then Return tmpVec
        tmpVec.x = vecFrom.x - vecTo.x
        tmpVec.y = vecFrom.y - vecTo.y
        Return tmpVec
    End
    

    
    ' ==========================
    ' LIMIT
    ' ==========================
    Method Limit:Void(max:Float)
        tmpVec = New Vector(Self)
        If tmpVec.Length > max Then
            tmpVec.Normalize()
            tmpVec.Multiply(max)
        End
        
        Self.Set(tmpVec)
    End
    
    ' ==========================
    ' TO STRING
    ' ==========================
    Method ToString:String()
        Return "[" + Self.x + ", " + Self.y + "]"
    End

        
    
    Private
        Global tmpVec:Vector = New Vector()
End
