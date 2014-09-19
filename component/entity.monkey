Strict

Import mgev2.component.component

Interface IEntity
    Method Parent:IEntity() Property 'Read-only
    Method Components:List<IComponent>() Property 'Read-only
    Method Children:List<IEntity>() Property 'Read-only
    Method Initialize:Void(parent:IEntity = Null)
    Method Finalize:Void()
    Method AddComponent:Void(comp:IComponent)
    Method RemoveComponent:Void(comp:IComponent)
End

Class Entity Implements IEntity
    
    Method Parent:IEntity() Property Return _parent End
    Method Components:List<IComponent>() Property Return _components End
    Method Children:List<IEntity>() Property Return _children End
    
    Method Initialize:Void(parent:IEntity = Null)
        _parent = parent
        
        ' Components
        For Local comp:IComponent = EachIn _components
            comp.Initialize(Self)
        Next
        
        ' Children
        For Local child:IEntity = EachIn _children
            child.Initialize(Self)
        Next
    End
    
    Method Finalize:Void()
        _parent = Null
        
        ' Components
        For Local comp:IComponent = EachIn _components
            comp.Finalize()
        Next
        
        ' Children
        For Local child:IEntity = EachIn _children
            child.Finalize()
        Next
    End
    
    Method AddComponent:Void(comp:IComponent)
        _components.AddLast(comp)
    End
    
    Method RemoveComponent:Void(comp:IComponent)
        _components.RemoveEach(comp)
    End
    
    Private
        Field _components:= New List<IComponent>
        Field _children:= New List<IEntity>
        Field _parent:IEntity
End

