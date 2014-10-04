Strict
Import mojo
Import mgev2

Function Main:Int()
	New Game()
	Return 0
End

Class Game Extends App
    Field a:Segment, b:Segment
    Field intersects:Bool
    
    Field bVec:Vector, constVec:Vector, mouse:Vector
    
    Field distance:Float

	'summary:The OnCreate Method is called when mojo has been initialized and the application has been successfully created.
	Method OnCreate:Int()	
		'Set how many times per second the game should update and render itself
		SetUpdateRate(60)
		
        a = New Segment(New Vector(100, 100), New Vector(300, 200))
        
        mouse = New Vector(MouseX(), MouseY())
        constVec = New Vector(100, -50)
        bVec = constVec.Add(mouse)
        b = New Segment(mouse, bVec)
        
        
		Return 0
	End
	
	'summary: This method is automatically called when the application's update timer ticks. 
	Method OnUpdate:Int()
        mouse.Set(MouseX(), MouseY())
        bVec = constVec.Add(mouse)
        
        If KeyDown(KEY_LMB) Then constVec.Angle += 1
        If KeyDown(KEY_RMB) Then constVec.Angle -= 1
        
        b.Set(mouse, bVec)
    
        intersects = a.Intersects(b)
        
        distance = a.DistanceTo(b)
    
		Return 0
	End
	
	'summary: This method is automatically called when the application should render itself, such as when the application first starts, or following an OnUpdate call. 
	Method OnRender:Int()
		Cls()
		
        Select intersects
            Case True
                SetColor(255, 0, 0)
                DrawText("Intersection (" + String(a.intersection.x)[..5] + ", " + String(a.intersection.y)[..5] + ")", 2, 468)
            Case False
                SetColor(0, 255, 0)
                DrawText("No intersection", 2, 468)
        End
        DrawLine(a.p1.x, a.p1.y, a.p2.x, a.p2.y)
        DrawLine(b.p1.x, b.p1.y, b.p2.x, b.p2.y)
        
        
        
        SetColor(255, 255, 255)
        If intersects Then DrawCircle(a.intersection.x, a.intersection.y, 3)
        DrawText("LMB: rotate to counter-clockwise", 2, 2)
        DrawText("RMB: rotate to clockwise", 2, 14)
        DrawText("Distance: " + distance, 2, 26)
        
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