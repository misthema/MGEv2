Strict

Import mojo.app

Import mgev2


Class Engine

    
    Function Initialize:Void()
        If _initialized Then Return
        _engine = New _Engine
        _initialized = True
    End
    
    Function AddSystem:Void(system:ISystem)
        _engine.systems.AddLast(system)
    End
    
    Function RemoveSystem:Void(system:ISystem)
        _engine.systems.RemoveEach(system)
    End
    
    Function AddEntity:Void(entity:IEntity)
        entity.Initialize()
        
        _engine.compCount += entity.Components.Count()
        
        For Local sys:ISystem = EachIn _engine.systems
            For Local comp:IComponent = EachIn entity.Components()
                If sys.IsSystemType(comp) Then
                    sys.AddComponent(comp)
                    
                    _engine.updatedComps += 1
                End
            Next
        Next
    End
    
    Function RemoveEntity:Void(entity:IEntity)
        For Local sys:ISystem = EachIn _engine.systems
            For Local comp:IComponent = EachIn entity.Components()
                If sys.IsSystemType(comp) Then
                    sys.RemoveComponent(comp)
                End
            Next
        Next
        
        entity.Finalize()
    End
    
    Function Test:Void(runs:Int)
        For Local i:= 0 Until runs
            _engine.OnUpdate()
        Next
    End
    
    Private
        Global _initialized:Bool = False
        Global _engine:_Engine
End

Class _Engine Extends App
    Field clock:DeltaTimer
    
    Field compCount:Int, updatedComps:Int
    Field sysCount:Int
    
    Field updates:Int, maxUpdates:Int = 60
    Field avrUpdateTime:Float, avrUpdateTimes:Int, avrMin:Float = 9999, avrMax:Float = 0
    
    Field systems:List<ISystem>

    Method New()
        clock = New DeltaTimer(60)
        systems = New List<ISystem>
    End
    
    Method OnCreate:Int()
        SetUpdateRate(60)
        
        clock.Play()
        
        Return 0
    End
    
    Method OnRender:Int()
        Cls()
        
        For _system = EachIn systems
            If IRenderable(_system) Then IRenderable(_system).OnRender()
        Next
        
        DrawText("Average update time: " + String(avrUpdateTime)[ .. 5] + "ms", 2, 2)
        DrawText("Min: " + String(avrMin)[ .. 5] + "ms", 2, 14)
        DrawText("Max: " + String(avrMax)[ .. 5] + "ms", 2, 26)
        
        DrawText("Total components: " + compCount, 320, 2)
        DrawText("Bundles for systems: " + updatedComps, 320, 14)
        DrawText("Systems: " + sysCount, 320, 26)
        
    
        Return 0
    End
    
    Method OnUpdate:Int()
        clock.OnUpdate()
        
        Local elapsed:Int = Millisecs()
        
        For _system = EachIn systems
            _system.OnUpdate(clock.delta)
        Next
        
        avrUpdateTimes += Millisecs() -elapsed
        
        If updates >= maxUpdates Then
            avrUpdateTime = Float(avrUpdateTimes) / Float(maxUpdates)
            avrUpdateTimes = 0
            updates = 0
            
            If avrUpdateTime > avrMax Then avrMax = avrUpdateTime
            If avrUpdateTime < avrMin Then avrMin = avrUpdateTime
        Else
            updates += 1
        End
        
        sysCount = systems.Count()
    
        Return 0
    End
    
    Private
        Field _system:ISystem
End

