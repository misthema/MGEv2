Strict

Import mgev2.system.system
Import mgev2.component.positioncomponent
Import mgev2.component.collision.aabb
Import mgev2.component.collision.quadtree
Import mgev2.component.entity
Import mgev2.utils.functions

Import mojo.graphics

Class CollisionSystem Extends System<CollisionComponent> Implements IRenderable
    
    Method New()
        Super.New()
        
        _quadtree = New Quadtree<CollisionComponent>(0, New AABB(0, 0, 640, 480))
        _returnObjects = New List<CollisionComponent>()
    End
    
    Method OnRender:Void()
        DrawText("Rendering Quadtree Nodes",2,468)
        SetColor(96, 96, 96)
        RenderNode(_quadtree)
        SetColor(255, 255, 255)
    End
    
    Method RenderNode:Void(quad:Quadtree<CollisionComponent>)
        Local nodes:Quadtree<CollisionComponent>[] = quad.GetNodes()
        Local bounds:IAABB
        
        If nodes[0] = Null Then Return
        
        For Local i:= 0 Until nodes.Length()
            RenderNode(nodes[i])
            
            bounds = nodes[i].GetBounds()
            If bounds <> Null Then DrawRectOutlined2(bounds.MinX, bounds.MinY, bounds.MaxX, bounds.MaxY)
        Next
    End

    Method OnUpdate:Void(delta:Float)
        _quadtree.Clear()
        
        Local area:CollisionComponent
        
        For area = EachIn ComponentList()
            _quadtree.Insert(area)
        Next
        
        
        For area = EachIn ComponentList()
            _returnObjects.Clear()
            _quadtree.Retrieve(_returnObjects, area)
            
            For Local obj:CollisionComponent = EachIn _returnObjects
                If obj = area Then Continue
                
                Local tmpColor1:IColorable = IColorable(obj.Owner.GetComponent("DisplayObject"))
                Local tmpColor2:IColorable = IColorable(area.Owner.GetComponent("DisplayObject"))
                
                If obj.IntersectAABB(area) Then
                    If tmpColor1 <> Null Then tmpColor1.Colorize(255, 0, 0)
                    If tmpColor2 <> Null Then tmpColor2.Colorize(255, 0, 0)
                Else
                    If tmpColor1 <> Null Then tmpColor1.Colorize(255, 255, 255)
                    If tmpColor2 <> Null Then tmpColor2.Colorize(255, 255, 255)
                End
            Next
        Next
    End
    
    Private
        Field _quadtree:Quadtree<CollisionComponent>
        Field _returnObjects:List<CollisionComponent>
End

Function DrawRectOutlined:Void(x:Float, y:Float, w:Float, h:Float)
    DrawLine(x, y, x + w, y) 'Top
    DrawLine(x, y + h, x + w, y + h) 'Bot
    DrawLine(x, y, x, y + h) 'Left
    DrawLine(x + w, y, x + w, y + h) 'Right
End

Function DrawRectOutlined2:Void(x:Float, y:Float, x2:Float, y2:Float)
    DrawLine(x, y, x2, y) 'Top
    DrawLine(x, y2, x2, y2) 'Bot
    DrawLine(x, y, x, y2) 'Left
    DrawLine(x2, y, x2, y2) 'Right
End