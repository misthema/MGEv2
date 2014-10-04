Strict
Import mojo
Import mgev2.utils.math.vector
Import mgev2.utils.geom.segment

Function Main:Int()
    New Game()
    Return 0
End

Class Line
    Field seg:Segment
    Field velocity1:Vector
    Field velocity2:Vector
    Field colliding:Bool = False
    
    Method New(x1:Float, y1:Float, x2:Float, y2:Float)
        seg = New Segment(x1, y1, x2, y2)
        velocity1 = New Vector(-3 + Rnd() * 6, -3 + Rnd() * 6)
        velocity2 = New Vector(-3 + Rnd() * 6, -3 + Rnd() * 6)
    End
    
    Method Update:Void()
        seg.p1 = seg.p1.Add(velocity1)
        seg.p2 = seg.p2.Add(velocity1)
        
        If seg.p1.x < 0 or seg.p1.x > 640 Then velocity1.x *= -1
        If seg.p1.y < 0 or seg.p1.y > 480 Then velocity1.y *= -1
        
        If seg.p2.x < 0 or seg.p2.x > 640 Then velocity1.x *= -1
        If seg.p2.y < 0 or seg.p2.y > 480 Then velocity1.y *= -1
        
        colliding = False
    End
    
    Method Draw:Void()
        Select colliding
            Case True
                SetColor(255, 255, 255)
                DrawCircle(seg.GetIntersectionX(), seg.GetIntersectionY(), 2)
                SetColor(255, 0, 0)
            Case False
                SetColor(0, 255, 0)
        End
        DrawLine(seg.p1.x, seg.p1.y, seg.p2.x, seg.p2.y)
    End
End

Class Game Extends App
    Field lines:List<Line>
    Field renders:Int, updates:Int, FPS:Int, UPS:Int
    Field fpsTimer:Int, upsTimer:Int

    'summary:The OnCreate Method is called when mojo has been initialized and the application has been successfully created.
    Method OnCreate:Int()
        'Set how many times per second the game should update and render itself
        SetUpdateRate(60)
		
        lines = New List<Line>()
        Local x:Float, y:Float
        For Local i:= 0 Until 200
            x = Rnd() * 640
            y = Rnd() * 480
            lines.AddLast(New Line(x, y, x - 64 + Rnd() * 128, y - 64 + Rnd() * 128))
        Next
        
        
        Return 0
    End
	
    'summary: This method is automatically called when the application's update timer ticks.
    Method OnUpdate:Int()
        
        For Local line:Line = EachIn lines
            line.Update()
            
            For Local line2:Line = EachIn lines
                If line.seg.Intersects(line2.seg) Then
                    line.colliding = True
                End
            Next
        Next
        
        If upsTimer < Millisecs() Then
            UPS = updates
            updates = 0
            upsTimer = Millisecs() +1000
        Else
            updates += 1
        End
    
        Return 0
    End
	
    'summary: This method is automatically called when the application should render itself, such as when the application first starts, or following an OnUpdate call.
    Method OnRender:Int()
        Cls()
		
        For Local line:Line = EachIn lines
            line.Draw()
        Next
        
        SetColor(255, 255, 255)
        DrawText("FPS: " + FPS, 2, 2)
        DrawText("UPS: " + UPS, 2, 14)
        
        If fpsTimer < Millisecs() Then
            FPS = renders
            renders = 0
            fpsTimer = Millisecs() +1000
        Else
            renders += 1
        End
        
        Return 0
    End

    'summary: This method is called instead of OnRender when the application should render itself, but there are still resources such as images or sounds in the process of being loaded.
    Method OnLoading:Int()
		
        Return 0
    End
	
    'summary: This method is called when the application's device window size changes.
    Method OnResize:Int()
		
        Return 0
    End
	
    '#REGION Code to handle susped status of the game goes here
	
    'summary: OnSuspend is called when your application is about to be suspended.
    Method OnSuspend:Int()
	
        Return 0
    End
	
    'summary: OnResume is called when your application is made active again after having been in a suspended state.
    Method OnResume:Int()
		
        Return 0
    End
    '#END REGION
	
    '#REGION Code to handle game closing goes here:
	
    'summary: This method is called when the application's 'close' button is pressed.
    Method OnClose:Int()
				
        Return Super.OnClose()
    End

    'summary:This method is called when the application's 'back' button is pressed.
    Method OnBack:Int()

        Return Super.OnBack()
    End
	
    '#END REGION

End