Strict

Import mgev2.component.collision.aabb

Interface IQuadtree
    Method New(level:Int, bounds:IAABB)
    Method Split:Void()
    Method Insert:Void(area:IAABB)
    Method GetIndex:Int(area:IAABB)
    Method Retrieve:Void(returnObjects:List<IAABB>, area:IAABB)
    Method Clear:Void()
End

Class Quadtree<T> Implements IQuadtree
    
    Method New(level:Int, bounds:IAABB)
        _level = level
        _objects = New List<T>
        _bounds = bounds
        _nodes = New Quadtree[4]
    End
    
    Method Clear:Void()
        _objects.Clear()
        
        Local i:Int = 0
        For i = 0 Until _nodes.Length()
            If _nodes[i] <> Null Then
                _nodes[i].Clear()
                _nodes[i] = Null
            End
        Next
    End
    
    Method Split:Void()
        Local subWidth:Int = Int(_bounds.Width / 2)
        Local subHeight:Int = Int(_bounds.Height / 2)
        Local x:Int = Int(_bounds.MinX)
        Local y:Int = Int(_bounds.MinY)
        
        Local newLevel:Int = _level + 1
        'North-East
        _nodes[0] = New Quadtree<T>(newLevel, New AABB(x + subWidth, y, subWidth, subHeight))
        'North-West
        _nodes[1] = New Quadtree<T>(newLevel, New AABB(x, y, subWidth, subHeight))
        'South-West
        _nodes[2] = New Quadtree<T>(newLevel, New AABB(x, y + subHeight, subWidth, subHeight))
        'South-East
        _nodes[3] = New Quadtree<T>(newLevel, New AABB(x + subWidth, y + subHeight, subWidth, subHeight))
    End
    
    Method GetIndex:Int(area:IAABB)
        Local index:Int = -1
        Local verticalMidpoint:Float = _bounds.MinX + (_bounds.Width / 2)'_bounds.GetCenterX()
        Local horizontalMidpoint:Float = _bounds.MinY + (_bounds.Height / 2)'_bounds.GetCenterY()

        ' Area fits within top quadrants        
        Local topQuadrant:Bool = (area.MinY < horizontalMidpoint And area.MaxY < horizontalMidpoint)
        ' Area fits within bottom quadrants
        Local bottomQuadrant:Bool = (area.MinY > horizontalMidpoint)
        
        ' Area fits within left quadrants
        If area.MinX < verticalMidpoint And area.MaxX < verticalMidpoint Then
            If topQuadrant Then
                index = 1
            Else If bottomQuadrant Then
                index = 2
            End
        ' Area fits within right quadrants
        Else If area.MinX > verticalMidpoint Then
            If topQuadrant Then
                index = 0
            Else If bottomQuadrant
                index = 3
            End
        End
        
        Return index
    End
    
    Method Retrieve:Void(returnObjects:List<T>, area:T)
        Local index:Int = GetIndex(area)
        
        If index <> - 1 And _nodes[0] <> Null Then
            _nodes[index].Retrieve(returnObjects, area)
        End
        
        MergeLists(returnObjects, _objects)
    End
    
    Method MergeLists:Void(toThis:List<T>, fromThis:List<T>)
        For Local area:T = EachIn fromThis
            toThis.AddLast(area)
        Next
    End
    
    Method Insert:Void(area:T)
        If _nodes[0] <> Null Then
            Local index:Int = GetIndex(area)
            
            If index <> - 1 Then
                _nodes[index].Insert(area)
                
                Return
            End
        End
        
        _objects.AddLast(area)
        
        If _objects.Count() > _maxObjects And _level < _maxLevels Then
            If _nodes[0] = Null Then
                Split()
            End
            
            Local i:Int = 0, index:Int, obj:T
            While i < _objects.Count()
                obj = _objects.ToArray()[i]
                index = GetIndex(area)
                
                If index <> - 1 Then
                    _nodes[index].Insert(obj)
                    _objects.Remove(obj)
                Else
                    i += 1
                End
            Wend
        End
    End
    
    Method GetNodes:Quadtree<T>[] ()
        Return _nodes
    End
    
    Method CountNodes:Int()
        Local count:Int = 0
        For Local i:= 0 Until 4
            If _nodes[i] <> Null Then
                count += 1
                count += _nodes[i].CountNodes()
            End
        Next
        
        Return count
    End
    
    Method GetBounds:IAABB()
        Return _bounds
    End
    
    
    Private
        Field _maxObjects:Int = 4, _maxLevels:Int = 5
        Field _level:Int
        Field _objects:List<T>
        Field _bounds:IAABB
        Field _nodes:Quadtree<T>[]
End