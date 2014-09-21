Strict

Import mgev2.component.component
Import mgev2.component.sizecomponent

Interface IAABB
    Method MinX:Float() Property
    Method MinX:Void(value:Float) Property
    Method MinY:Float() Property
    Method MinY:Void(value:Float) Property
    
    Method MaxX:Float() Property
    Method MaxX:Void(value:Float) Property
    Method MaxY:Float() Property
    Method MaxY:Void(value:Float) Property
    
    Method Width:Float() Property
    Method Height:Float() Property
    
    Method GetCenterX:Float()
    Method GetCenterY:Float()
    
    Method GetDistanceX:Float(other:IAABB)
    Method GetDistanceY:Float(other:IAABB)
    
    Method IntersectAABB:Bool(other:IAABB)
    Method IntersectRect:Bool(x:Float, y:Float, width:Float, height:Float)
End

Class AABB Implements IAABB
    
    Method MinX:Float() Property Return _minX End
    Method MinX:Void(value:Float) Property _minX = value End
    Method MinY:Float() Property Return _minY End
    Method MinY:Void(value:Float) Property _minY = value End
    
    Method MaxX:Float() Property Return _maxX End
    Method MaxX:Void(value:Float) Property _maxX = value End
    Method MaxY:Float() Property Return _maxY End
    Method MaxY:Void(value:Float) Property _maxY = value End
    
    Method GetCenterX:Float()
        Return Float(MaxX - MinX) / 2.0
    End
    Method GetCenterY:Float()
        Return Float(MaxY - MinY) / 2.0
    End
    
    Method Width:Float() Property
        Return MaxX - MinX
    End
    Method Height:Float() Property
        Return MaxY - MinY
    End
    
    Method GetDistanceX:Float(other:IAABB)
        Local distance1:Float = other.MinX - MaxX
        Local distance2:Float = MinX - other.MaxX
        
        If distance1 > distance2 Then Return distance1
        Return distance2
    End
    Method GetDistanceY:Float(other:IAABB)
        Local distance1:Float = other.MinY - MaxY
        Local distance2:Float = MinY - other.MaxY
        
        If distance1 > distance2 Then Return distance1
        Return distance2
    End
    
    Method IntersectAABB:Bool(other:IAABB)
        Return IntersectRect(other.MinX, other.MinY, other.MaxX, other.MaxY)
    End
    Method IntersectRect:Bool(minX:Float, minY:Float, maxX:Float, maxY:Float)
        Return (Self.MinX < maxX) And (Self.MinY < maxY) And (Self.MaxX > minX) And (Self.MaxY > minY)
    End
    
    Method New(x:Float, y:Float, width:Float, height:Float)
        _minX = x
        _minY = y
        _maxX = x + width
        _maxY = y + height
    End
    
    Private
        Field _minX:Float, _minY:Float, _maxX:Float, _maxY:Float
End


Class CollisionComponent Extends Component Implements IAABB

    Method MinX:Float() Property Return _position.X End
    Method MinX:Void(value:Float) Property _position.X = value End
    Method MinY:Float() Property Return _position.Y End
    Method MinY:Void(value:Float) Property _position.Y = value End
    
    Method MaxX:Float() Property Return _position.X + _size.Width End
    Method MaxX:Void(value:Float) Property _position.X = value - _size.Width End
    Method MaxY:Float() Property Return _position.Y + _size.Height End
    Method MaxY:Void(value:Float) Property _position.Y = value - _size.Height End
    
    Method GetCenterX:Float()
        Return Float(MaxX - MinX) / 2.0
    End
    Method GetCenterY:Float()
        Return Float(MaxY - MinY) / 2.0
    End
    
    Method Width:Float() Property
        Return _size.Width
    End
    Method Height:Float() Property
        Return _size.Height
    End
    
    Method GetDistanceX:Float(other:IAABB)
        Local distance1:Float = other.MinX - MaxX
        Local distance2:Float = MinX - other.MaxX
        
        If distance1 > distance2 Then Return distance1
        Return distance2
    End
    Method GetDistanceY:Float(other:IAABB)
        Local distance1:Float = other.MinY - MaxY
        Local distance2:Float = MinY - other.MaxY
        
        If distance1 > distance2 Then Return distance1
        Return distance2
    End
    
    Method IntersectAABB:Bool(other:IAABB)
        Return IntersectRect(other.MinX, other.MinY, other.MaxX, other.MaxY)
    End
    Method IntersectRect:Bool(minX:Float, minY:Float, maxX:Float, maxY:Float)
        Return (Self.MinX < maxX) And (Self.MinY < maxY) And (Self.MaxX > minX) And (Self.MaxY > minY)
    End

    Method Initialize:Void(owner:IEntity)
        Super.Initialize(owner)
        
        For Local comp:IComponent = EachIn owner.Components()
            If IPosition(comp) Then _position = IPosition(comp)
            If ISize(comp) Then _size = ISize(comp)
        Next
        
        If _position <> Null and _size <> Null Then
            _area = New AABB(_position.X, _position.Y, _size.Width, _size.Height)
        End
    End
    
    
    Private
        Field _position:IPosition
        Field _size:ISize
        Field _area:IAABB
End