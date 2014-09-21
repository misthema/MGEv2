Strict

Import mojo.input

Import mgev2.system.system
Import mgev2.component.inputcomponent

Class InputSystem Extends System<IInput>
    
    Method New()
        _dirty = True
        Reset()
    End
    
    Method OnUpdate:Void(delta:Float)
        UpdateKeystates()
        DispatchKeyEvents()
    End
    
    Method UpdateKeystates:Void()
        For Local i:= 0 Until _keystates.Length()
            If _keystates[i] = OFF Then
                If KeyHit(i) Then _keystates[i] = DOWN | HIT
            Else If _keystates[i] & HIT Then
                If KeyDown(i) Then
                    _keystates[i] = DOWN
                Else
                    _keystates[i] = UP
                End
            Else
                If _keystates[i] & UP
                    _keystates[i] = OFF
                Else
                    If Not KeyDown(i) Then _keystates[i] = UP
                End
            End
        Next
    End
    
    Method DispatchKeyEvents:Void()
        For Local i:= 0 Until _keystates.Length()
            If _keystates[i] = OFF Then Continue
            
            For Local comp:IInput = EachIn ComponentList()
                If _keystates[i] = HIT Then comp.KeyHit(i)
                If _keystates[i] = DOWN Then comp.KeyDown(i)
                If _keystates[i] = UP Then comp.KeyUp(i)
            Next
        Next
    End
    
    Method Reset:Void()
        If Not _dirty Then Return
        _dirty = False
        
        For Local i:= 0 Until _keystates.Length()
            _keystates[i] = OFF
        Next
    End

    Private
        Field _keystates:Int[256]
        Field _dirty:Bool
        
        Const OFF:Int = $000
        Const DOWN:Int = $001
        Const HIT:Int = $010
        Const UP:Int = $100
End