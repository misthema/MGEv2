Strict
Import mojo
Import mgev2

Function Main:Int()
    New Game()
    Return 0
End

Class Game Extends App

    Field mouse:Vector
    Field segment:Segment
    Field result:Vector

    'summary:The OnCreate Method is called when mojo has been initialized and the application has been successfully created.
    Method OnCreate:Int()
        'Set how many times per second the game should update and render itself
        SetUpdateRate(60)

        mouse = New Vector()
        segment = New Segment(200, 200, 400, 300)
        result = New Vector()
        
        Return 0
    End
	
    'summary: This method is automatically called when the application's update timer ticks.
    Method OnUpdate:Int()
    
        mouse.Set(MouseX(), MouseY())
        segment.GetClosestPoint(mouse, result)

        Return 0
    End
	
    'summary: This method is automatically called when the application should render itself, such as when the application first starts, or following an OnUpdate call.
    Method OnRender:Int()
        Cls()
        
        SetColor(0, 255, 0)
        DrawLine(segment.p1.x, segment.p1.y, segment.p2.x, segment.p2.y)
        
        SetColor(255,255,255)
        DrawCircle(result.x, result.y, 3)
        DrawCircle(mouse.x, mouse.y, 3)
        
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