Strict

Import mgev2

Interface IPosition
    Method X:Void(value:Float) Property
    Method X:Float() Property
    Method Y:Void(value:Float) Property
    Method Y:Float() Property
    Method Set:Void(x:Float, y:Float)
    Method Set:Void(vector:Vector)
    Method ToVector:Vector()
    
    Method DistanceTo:Float(x:Float, y:Float)
    Method DistanceTo:Float(other:IPosition)
    Method DistanceTo:Float(vector:Vector)
    
    Method AngleTo:Float(x:Float, y:Float)
    Method AngleTo:Float(other:IPosition)
    Method AngleTo:Float(vector:Vector)
End


Class PositionComponent Extends Component Implements IPosition
    Method X:Void(value:Float) Property _vector.x = value End
    Method X:Float() Property Return _vector.x End
    
    Method Y:Void(value:Float) Property _vector.y = value End
    Method Y:Float() Property Return _vector.y End
    
    Method Set:Void(x:Float, y:Float)
        _vector.Set(x, y)
    End
    
    Method Set:Void(vector:Vector)
        _vector.Set(vector)
    End
    
    Method ToVector:Vector()
        Return _vector
    End
    
    Method DistanceTo:Float(x:Float, y:Float)
        Return _vector.DistanceTo(x, y)
    End
    
    Method DistanceTo:Float(other:IPosition)
        Return _vector.DistanceTo(other.ToVector())
    End
    
    Method DistanceTo:Float(vector:Vector)
        Return _vector.DistanceTo(vector)
    End
    
    Method AngleTo:Float(x:Float, y:Float)
        _tmpVector.Set(x, y)
        Return _vector.AngleTo(_tmpVector)
    End
    
    Method AngleTo:Float(other:IPosition)
        Return _vector.AngleTo(other.ToVector())
    End
    
    Method AngleTo:Float(vector:Vector)
        Return _vector.AngleTo(vector)
    End
    
    Method New(x:Float, y:Float)
        _vector = New Vector(x, y)
        _tmpVector = New Vector()
        
        Name = "PositionComponent"
    End
    
    Method Finalize:Void()
        _vector = Null
        _tmpVector = Null
    End
    
    Private
        Field _vector:Vector
        Field _tmpVector:Vector
End

#REM
Class PositionComponent Extends Component Implements IPosition
    Method X:Void(value:Float) Property _position.X = value End
    Method X:Float() Property Return _position.X End
    Method Y:Void(value:Float) Property _position.Y = value End
    Method Y:Float() Property Return _position.Y End
    Method Set:Void(x:Float, y:Float) _position.Set(x, y) End
    Method Set:Void(vector:Vector) _position.Set(vector) End
    Method ToVector:Vector() Return _position.ToVector() End
    
    Method DistanceTo:Float(x:Float, y:Float) Return _position.DistanceTo(x, y) End
    Method DistanceTo:Float(other:Position) Return _position.DistanceTo(other) End
    Method DistanceTo:Float(vector:Vector) Return _position.DistanceTo(vector) End
    
    Method AngleTo:Float(x:Float, y:Float) Return _position.AngleTo(x, y) End
    Method AngleTo:Float(other:Position) Return _position.AngleTo(other) End
    Method AngleTo:Float(vector:Vector) Return _position.AngleTo(vector) End
    
    Method New()
        _position = New Position()
    End

    Method Initialize:Void(owner:IEntity)
        Super.Initialize(owner)
    End
    
    Method Finalize:Void()
        _position = Null
    End
    
    
    Private
        Field _position:IPosition
    
End

#END