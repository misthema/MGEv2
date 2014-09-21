Strict

Import mgev2.component.entity

Interface IComponent
    Method Name:String() Property
    Method Name:Void(value:String) Property
    Method Owner:IEntity() Property
    Method Initialize:Void(owner:IEntity)
    Method Finalize:Void()
End

Class Component Implements IComponent
    
    Method Name:String() Property Return _name End
    Method Name:Void(value:String) Property _name = value End
    
    Method Owner:IEntity() Property Return _owner End
    
    Method Initialize:Void(owner:IEntity)
        _owner = owner
    End
    
    Method Finalize:Void()
        
    End
    
    Private
        Field _owner:IEntity
        Field _name:String
End