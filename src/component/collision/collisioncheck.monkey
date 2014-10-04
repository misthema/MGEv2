Strict

Import mgev2.component.entity

Interface ICollisionCheck
    Method onCallback:Void(ent1:IEntity, ent2:IEntity)
End

Class RectToRectCollision Implements ICollisionCheck
    
End

Class CircleToCircleCollision Implements ICollisionCheck
    
End

Class CircleToRectCollision Implements ICollisionCheck
    
End

Class PointToRectCollision Implements ICollisionCheck
    
End

Class PointToCircleCollision Implements ICollisionCheck
    
End
