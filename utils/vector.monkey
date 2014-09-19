Strict

' A vector class with a lot of handy functionality for game-programming!

' In simplicy a vector is an Arrow. It has an length
' and a direction. you can use these properties to
' make the vector model a Position, a Velocity, a
' Line, a Distance and many other things that can be
' measured using a length and a direction or anything
' that uses two float pair-values!

' Wikipedia: A vector is what is needed to "carry" the
' point A to the point B; the Latin word vector means "one who carries"
Class Vector
    Public
    Field x:Float
    Field y:Float

    Const Zero:Vector = New Vector(0,0)
	
    Method New(x:Float=0,y:Float=0)
        Self.x = x
        Self.y = y
    End
	
    '	    S E T
    '----------------------------------------------
    Method Set:Vector( vector:Vector )
        x = vector.x
        y = vector.y
        Return Self
    End
    Method Set:Vector(x:Float,y:Float )
        Self.x = x
        Self.y = y
        Return Self
    End
		
    '		A D D
    '----------------------------------------------
    Method Add:Vector( vector:Vector )
        x += vector.x
        y += vector.y
        Return Self
    End
	
    '		S U B T R A C T
    '----------------------------------------------
    Method Subtract:Vector( vector:Vector )
        x = x - vector.x
        y = y - vector.y
        Return Self
    End
	
    '		 D O T  P R O D U C T
    '---------------------------------------------------
    ' Dot Product which is x*x2 + y*y2
    '
    '---------------------------------------------------
    Method Dot:Float( Vector:Vector )
        Return ( x * Vector.x + y * Vector.y)
    End
	
    '		M U L T I P L y   V E C T O R
    '----------------------------------------------
    Method Multiply:Vector( Value:Float )
        x*=Value
        y*=Value
        Return Self
    End
		
    ' M I R R O R
    '----------------------------------------------------------
    ' if the mirrorImage vector is a unit-vector this will
    ' make this vector flip 180 degrees around it
    ' So that this vector now points in the exact opppisite
    ' direction To the mirrorImage vector
    ' Returns Self, which will be opposite to mirrorImage.
    Method Mirror:Vector( mirrorImage:Vector )
        Local dotprod:Float = -x * mirrorImage.x - y * mirrorImage.y
        x=x+2 * mirrorImage.x * dotprod
        y=y+2 * mirrorImage.y * dotprod
        Return Self
    End
	
    ' Set the vector to a direction and a length x,y
    ' returns Self, which is now pointin the directio
    ' provided, with the length provided
    Method MakeField:Vector( direction:Float, length:Float )
        x = Cos( -direction )*length
        y = Sin( -direction )*length
        Return Self
    End
	
    '----------------------------------------------
    ' Create a copy --> depending on situation you might
    ' want to use the VectorPool to do this instead for
    ' when extrenme performance is required
    '-----------------------------------------------
    Method Copy:Vector() Property
        Local vector:Vector = New Vector
        vector.x = x
        vector.y = y
        Return vector
    End
	
    '	 C R E A T E   L E F T   N O R M A L
    '----------------------------------------------
    ' Make this an Perpendicular Vector
    ' As if you would rotate it 90 degrees Counter Clockwise
    ' return ( y, -x )
    Method LeftNormal:Vector( )
        Local tempx:Float = y
        y = -x
        x = tempx
        Return Self
    End

		
    '	 C R E A T E   R I G H T   N O R M A L
    '----------------------------------------------
    ' Make this a Perpendicular Vector
    ' Same as rotating it 90 degrees ClockWise
    ' return ( -y, x )
    Method RightNormal:Vector( )
        Local tempy:Float = y
        y = x
        x = -tempy
        Return Self
    End
	
    '		N O R M A L I Z E
    '----------------------------------------------
    ' Purpose: Sets Vector length To ONE but keeps it's direction
    ' Returns Self as a UnitVector
    Method Normalize:Vector()
        Local Length:Float = Self.Length()
        If Length = 0
            Return Self ' Don't divide by zero,
            'we do not normalize a zero-vector
            'since this vector's direction is in
            ' mathematical terms all directions!
        Endif
        Set( x / Length, y / Length ) 'Make length = 1
        Return Self
    End
	
    '   G E T   L E N G T H
    '-----------------------------
    ' Get current Length of vector, uses a single sqr operation
    Method Length:Float() Property
        Return Sqrt( x*x + y*y )'
    End
	
    '	S E T	L E N G T H
    '-------------------------------------
    Method Length:Void( length:Float ) Property
        'If we want to set vector to zero
        If length = 0
            x=0
            y=0
            Return
        Endif

        If x = 0 And y = 0
            x = length
        Endif
		
        Normalize()
        Multiply( length )
    End
	
    Method ReduceLength:Vector( amount:Float )
        Local currentAngle:Float = Direction
        Local currentLength:Float = Length
        Local newLength:Float = currentLength - amount
        If newLength > 0
            MakeField( currentAngle, currentLength - amount  )
        Else
            Set 0,0
        Endif
        Return Self
    End
	
    ' G E T  D I R E C T I O N
    '----------------------------------------------------
    ' Calculates the current direction in degrees
    ' in the 0 To < 360 range
    Method Direction:Float() Property
        Local angle:Float = ATan2(-y , x)
        'If angle < 0 Then angle =+ 360
        Return angle
    End
	
    ' S E T  D I R E C T I O N
    '----------------------------------------------
    '
    ' Set the angle of this vector without changing the length,
    ' has no effect if vector length is 0
    ' uses a single sqr operation
    Method Direction:Void( direction:Float ) Property
        MakeField( direction, Length )
    End Method
	
    ' D I S T A N C E
    '----------------------------------------------
    ' The Distance between the two points
    ' This is NOT related to the vectors Length#
    Method DistanceTo:Float(Other:Vector)
        Return DistanceTo(Other.x, Other.y)
    End
    Method DistanceTo:Float(x:Float, y:Float)
        Local dx:Float = x - x
        Local dy:Float = y - y
        Return Sqrt( dx*dx + dy*dy )
    End
		
    '		G E T  A N G L E   B E T W E E N
    '----------------------------------------------
    ' If you have two vectors that start at the same position
    ' the angle-distance between two vectors Result is from 0
    ' to 180 degrees, because two vectors can not be more than 180
    ' degrees apart, check AngleClockwise & AngleAntiClockwise
    ' to get a 0-360 result instead
    ' even tough it is counted as they are on the same position,
    ' that is not a requirement at all for this to be correct
    Method AngleTo:Float( target:Vector )
        Local dot:Float = Self.Dot( target )
		
        Local combinedLength:Float = Self.Length()*target.Length()
        If combinedLength = 0 Then Return 0
		
        Local quaski:Float = dot/combinedLength
		
        Local angle:Float = ACos( quaski )
        Return angle
    End
	
	
    ' If you have two vectors so they both start at the same position
    ' returns the angle from this vector to target vector (in degrees)
    ' if you where to go Clockwise to it, result is 0 to 360
    Method AngleToClockwise:Float( target:Vector )
        Local angle:Float = ATan2(-y , x)  - ATan2(-target.y , target.x)
        If angle < 0 Then angle += 360
        If angle >= 360 Then angle -= 360
        Return angle
    End
	
    ' If you have two vectors so they both start at the same position
    ' returns the angle fromt this vector to target vector (in degrees)
    ' if you where to go AntiClockwise to it, result is 0 to 360
    Method AngleToAntiClockwise:Float( target:Vector )
        Local angle:Float =  AngleToClockwise(target)-360
        Return -angle
    End
	
    '		V E C T O R    B E T W E E N
    '----------------------------------------------
    ' Change the vector into a vector from Position1 to Position2
    ' Return Self, as a vector that goes from first
    ' parameter's position to the second
    Method MakeBetween:Vector( PositionFrom:Vector , PositionToo:Vector)
        If PositionFrom = Null Or PositionToo = Null Then Return Self
        x = ( PositionToo.x - PositionFrom.x )
        y = ( PositionToo.y - PositionFrom.y )
        Return Self
    End

End