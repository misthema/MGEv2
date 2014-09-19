Strict

Import mgev2.kernel.engine
Import mgev2.component.component


Interface ISystem
    Method AddComponent:Void(comp:Object)
    Method RemoveComponent:Void(comp:Object)
    Method OnUpdate:Void(delta:Float)
    Method IsSystemType:Bool(component:IComponent)
    Method ComponentCount:Int()
End

Class System<T> Implements ISystem

    Method New()
        Engine.AddSystem(Self)
    End

    Method AddComponent:Void(comp:Object)
        _components.AddLast(T(comp))
    End
    
    Method RemoveComponent:Void(comp:Object)
        _components.RemoveEach(T(comp))
    End
    
    Method IsSystemType:Bool(component:IComponent)
        If T(component) Then Return True
        Return False
    End
    
    Method ConvertToType:T(component:IComponent)
        Return T(component)
    End
    
    Method OnUpdate:Void(delta:Float)

    End
    
    Method ComponentList:List<T>()
        Return _components
    End
    
    Method ComponentCount:Int()
        Return _components.Count()
    End

    Private
        Field _components:= New List<T>
End

