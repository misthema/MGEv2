Strict

Import mgev2

Import mojo.graphics

Class CollisionSystem Extends System<CollisionComponent> Implements IRenderable
    
    Method New()
        Super.New()
        
        _quadtree = New Quadtree<CollisionComponent>(0, New AABB(0, 0, 800, 600))
        _returnObjects = New List<CollisionComponent>()
    End
    
    Method OnRender:Void()
        SetColor(64, 128, 64)
        RenderNode(_quadtree)
        SetColor(255, 255, 255)
        DrawText("Rendering Quadtree Nodes", 2, 588)
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

            Local tmpColor2:IColorable = IColorable(area.Owner.GetComponent("DisplayObject"))

            If tmpColor2 <> Null Then tmpColor2.Colorize(255, 255, 255)
        Next
        
        
        For area = EachIn ComponentList()
            _returnObjects.Clear()
            _quadtree.Retrieve(_returnObjects, area)
            
            For Local obj:CollisionComponent = EachIn _returnObjects
                If obj = area Then Continue
                
                #REM
                Local tmpColor1:IColorable = IColorable(obj.Owner.GetComponent("DisplayObject"))
                Local tmpColor2:IColorable = IColorable(area.Owner.GetComponent("DisplayObject"))

                If tmpColor1 <> Null Then tmpColor1.Colorize(255, 255, 255)
                If tmpColor2 <> Null Then tmpColor2.Colorize(255, 255, 255)
                #END
                                
                If obj.IntersectAABB(area) Then
                    'If tmpColor1 <> Null Then tmpColor1.Colorize(255, 0, 0)
                    'If tmpColor2 <> Null Then tmpColor2.Colorize(255, 0, 0)
                    If area.CollisionResponseCallback <> Null Then
                        area.CollisionResponseCallback.onCallback(area.Owner, obj.Owner)
                    End
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