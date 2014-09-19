Strict

Import mgev2.component.entity

Interface IComponent
    Method Owner:IEntity() Property
    Method Initialize:Void(owner:IEntity)
    Method Finalize:Void()
End

Class Component Implements IComponent
    
    Method Owner:IEntity() Property Return _owner End
    
    Method Initialize:Void(owner:IEntity)
        _owner = owner
    End
    
    Method Finalize:Void()
        
    End
    
    Private
        Field _owner:IEntity
End