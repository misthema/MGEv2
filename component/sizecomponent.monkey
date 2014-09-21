Strict

Import mgev2.component.component
Import mgev2.component.rendercomponent
Import mgev2.utils.vector

Interface ISize
    Method Width:Void(value:Int) Property
    Method Width:Int() Property
    Method Height:Void(value:Int) Property
    Method Height:Int() Property
End

Class Size Implements ISize

    Method Width:Void(value:Int) Property _width = value End
    Method Width:Int() Property Return _width End
    Method Height:Void(value:Int) Property _height = value End
    Method Height:Int() Property Return _height End
    
    Method New(width:Int, height:Int)
        _width = width
        _height = height
    End

    Private
        Field _width:Int, _height:Int
End

Class SizeComponent Extends Component Implements ISize
    Method Width:Void(value:Int) Property _size.Width = value End
    Method Width:Int() Property Return _size.Width End
    Method Height:Void(value:Int) Property _size.Height = value End
    Method Height:Int() Property Return _size.Height End
    
    Method New(width:Int, height:Int)
        _size = New Size(width, height)
        Name = "SizeComponent"
    End
    
    Method Finalize:Void()
        _size = Null
    End

    Private
        Field _size:Size
End