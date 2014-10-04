Strict

Import mgev2

Import mojo.data

Class RendererSystem Extends System<IRender> Implements IRenderable

    Method New()
        Super.New()
        
        _layerList = New IntList()
        _layers = New IntMap<List<IRender>>()
        
    End

    Method AddComponent:Void(comp:Object)
        Super.AddComponent(comp)
        
        Local renderable:IRender = IRender(comp)
        Local list:List<IRender>
        
        If _layerList.Contains(renderable.Layer) Then
            list = _layers.Get(renderable.Layer)
        Else
            list = New List<IRender>()
            
            _layers.Set(renderable.Layer, list)
            _layerList.AddLast(renderable.Layer)
            _layerList.Sort(False)
        End
        
        list.AddLast(renderable)
    End
    
    Method RemoveComponent:Void(comp:Object)
        Super.RemoveComponent(comp)
        
        Local renderable:IRender = IRender(comp)
        Local list:List<IRender>
        
        If _layerList.Contains(renderable.Layer) Then
            list = _layers.Get(renderable.Layer)
            
            list.RemoveEach(renderable)
            
            If list.Count() = 0 Then
                _layers.Remove(renderable.Layer)
                _layerList.Remove(renderable.Layer)
            End
        End
    End
    
    Method OnRender:Void()
        If _layerList.Count() = 0 Then Return

        For _layer = EachIn _layerList
            If not _layers.Contains(_layer) Then Continue
                
            For _obj = EachIn _layers.Get(_layer)
                If _obj.Visible Then _obj.OnRender()
            Next
        Next
    End
    
    Method OnUpdate:Void(delta:Float)
        If _layerList.Count() = 0 Then Return

        For _layer = EachIn _layerList
        
            ' Layer doesn't exist? Remove
            If not _layers.Contains(_layer) Then
                _layerList.Remove(_layer)
                Continue
            End
                
            ' See if components have changed layer
            For _obj = EachIn _layers.Get(_layer)
                If _obj.Layer = _layer Then Continue

                RemoveComponent(_obj)
                AddComponent(_obj)
            Next
        Next
    End
    
    Private
        Field _layerList:IntList
        Field _layers:IntMap<List<IRender>>
        Field _layer:Int, _obj:IRender
End