Strict

Import mgev2.component.component
Import mgev2.component.positioncomponent
Import mgev2.component.sizecomponent

Import mojo.graphics

Const DEFAULT_LAYER:Int = 10

Interface IRenderable
    Method OnRender:Void()
End

Interface IRender Extends IRenderable, ISize
    Method Position:IPosition() Property
    
    Method Rotation:Void(value:Float) Property
    Method Rotation:Float() Property
    
    Method Visible:Void(value:Bool) Property
    Method Visible:Bool() Property

    Method Alpha:Void(value:Float) Property
    Method Alpha:Float() Property
    
    Method Layer:Void(value:Int) Property
    Method Layer:Int() Property
End

Interface IColorable
    Method Colorize:Void(r:Int, g:Int, b:Int)
    Method GetColor:Color()
End

Class Color
    Field r:Int, g:Int, b:Int
    Method New(r:Int, g:Int, b:Int)
        Self.r = r
        Self.g = g
        Self.b = b
    End
End

Class BasicDisplayObject Extends Component Implements IRender, IColorable

    '#Region IColorable
    Method Colorize:Void(r:Int, g:Int, b:Int)
        _color.r = r
        _color.g = g
        _color.b = b
    End
    Method GetColor:Color()
        Return _color
    End
    '#End Region

    '#Region ISize
    Method Width:Void(value:Int) Property _size.Width = value End
    Method Width:Int() Property Return _size.Width End
    Method Height:Void(value:Int) Property _size.Height = value End
    Method Height:Int() Property Return _size.Height End
    '#End Region

    
    '#Region IRender
    Method Position:IPosition() Property Return _position End
    
    Method Rotation:Void(value:Float) Property _rotation = value End
    Method Rotation:Float() Property Return _rotation End
    
    Method Visible:Void(value:Bool) Property _visible = value End
    Method Visible:Bool() Property Return _visible End

    Method Alpha:Void(value:Float) Property _alpha = value End
    Method Alpha:Float() Property Return _alpha End
    
    Method Layer:Void(value:Int) Property _layer = value End
    Method Layer:Int() Property Return _layer End
    '#End Region    
    
    
    Method OnRender:Void()
        Translate(Position.X, Position.Y)
        Rotate(Rotation)
        SetAlpha(_alpha)
        SetColor(_color.r, _color.g, _color.b)
        
        Render()
        
        SetColor(255, 255, 255)
        SetAlpha(1.0)
        Rotate(-Rotation)
        Translate(-Position.X, -Position.Y)
    End
    
    Method Initialize:Void(owner:IEntity)
        Super.Initialize(owner)
        
        For Local comp:IComponent = EachIn owner.Components()
            If IPosition(comp) Then _position = IPosition(comp)
        Next
        
        _rotation = 0.0
        _visible = True
        _alpha = 1.0
        _layer = DEFAULT_LAYER
        _size = New SizeComponent(8, 8)
        _color = New Color(255, 255, 255)
    End
    
    Method Finalize:Void()
        Super.Finalize()
        _position = Null
        _visible = False
    End
    
    Method New()
        Name = "DisplayObject"
    End
    
    Private
        Field _position:IPosition
        Field _rotation:Float
        Field _visible:Bool
        Field _alpha:Float
        Field _layer:Int
        Field _size:ISize
        Field _color:Color
        
        Method Render:Void()
            DrawRect(0, 0, _size.Width, _size.Height)
        End
End


Class Sprite Extends BasicDisplayObject
    
    Method New(image:Image)
        Super.New()
        _image = image
    End
    
    Method New(path:String)
        Super.New()
        _path = path
    End
    
    Method Initialize:Void(owner:IEntity)
        Super.Initialize(owner)
        
        If _image = Null And _path.Length > 0 Then
            _image = LoadImage(_path)
            
            If _image = Null Then Error("Unable to load image: '" + _path + "'!")
        Else If _image = Null And _path.Length = 0 Then
            Error("Image path or source not set!")
        End
        
        _size.Width = _image.Width()
        _size.Height = _image.Height()
    End
    
    Method Finalize:Void()
        Super.Finalize()
        _image = Null
    End
    
    
    Private
        Field _image:Image
        Field _path:String
       
        Method Render:Void()
            DrawImage(_image, 0, 0)
        End
End