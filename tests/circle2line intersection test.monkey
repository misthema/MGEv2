Strict
Import mojo
Import mgev2

Function Main:Int()
	New Game()
	Return 0
End

Class Game Extends App

    Field circle:Circle
    Field line:Line
    Field constVec:Vector, p2:Vector
    Field circleAngle:Float
    
    Field rect:Rectangle
    Field rectAngle:Float
    
    Field tri:Circle
    Field triAngle:Float
    
    Field mouseObject:Int = 0
    Field mouse:Vector
    
    
    
    Field intersectsCircle:Bool = False
    Field intersectsRect:Bool = False
    Field intersectsLine:Bool = False
    Field intersectsTri:Bool = False

	'summary:The OnCreate Method is called when mojo has been initialized and the application has been successfully created.
	Method OnCreate:Int()	
		'Set how many times per second the game should update and render itself
		SetUpdateRate(60)
		
        circle = New Circle(200, 200, 96)
        
        constVec = New Vector(150, 0)
        mouse = New Vector(MouseX(), MouseY())
        p2 = New Vector()
        line = New Line(mouse, constVec)
        
        rect = New Rectangle(300, 400, 128, 32)
        
        tri = New Circle(400, 200, 64, 3)
        
		Return 0
	End
	
	'summary: This method is automatically called when the application's update timer ticks. 
	Method OnUpdate:Int()
    
        If KeyDown(KEY_LMB) Then
            Select mouseObject
                Case 0
                    constVec.Angle += 1
                Case 1
                    rectAngle += 1
                Case 2
                    circleAngle += 1
                Case 3
                    triAngle += 1
            End
        End
        If KeyDown(KEY_RMB) Then
            Select mouseObject
                Case 0
                    constVec.Angle -= 1
                Case 1
                    rectAngle -= 1
                Case 2
                    circleAngle -= 1
                Case 3
                    triAngle -= 1
            End
        End
        
        If KeyHit(KEY_SPACE) Then
            mouseObject += 1
            If mouseObject >= 4 Then mouseObject = 0
        End
    
        mouse.Set(MouseX(), MouseY())
        
        Select mouseObject
            Case 0
                line.Set(mouse, mouse.Add(constVec))
            Case 1
                rect.SetLocation(mouse)
                rect.Rotate(rectAngle)
            Case 2
                circle.SetLocation(mouse)
                circle.Rotate(circleAngle)
            Case 3
                tri.SetLocation(mouse)
                tri.Rotate(triAngle)
        End
        
        
        intersectsCircle = circle.Intersects(line) or circle.Intersects(rect) or circle.Intersects(tri)
        intersectsRect = rect.Intersects(line) or rect.Intersects(circle) or rect.Intersects(tri)
        intersectsLine = line.Intersects(circle) or line.Intersects(rect) or line.Intersects(tri)
        intersectsTri = tri.Intersects(circle) or tri.Intersects(rect) or tri.Intersects(line)

		Return 0
	End
	
	'summary: This method is automatically called when the application should render itself, such as when the application first starts, or following an OnUpdate call. 
	Method OnRender:Int()
		Cls()
        
        Select intersectsCircle
            Case True
                SetColor(255, 0, 0)
            Case False
                SetColor(0, 255, 0)
        End
        
        circle.Draw()
        'DrawCircle(circle.GetCenterX(), circle.GetCenterY(), circle.radius)
        
        'SetColor(0, 0, 0)
        'DrawCircle(circle.GetCenterX(), circle.GetCenterY(), circle.radius - 1)
        
        Select intersectsRect
            Case True
                SetColor(255, 0, 0)
            Case False
                SetColor(0, 255, 0)
        End
        
        rect.Draw()
        'DrawLine(segment.GetX1(), segment.GetY1(), segment.GetX2(), segment.GetY2())
        
        
        Select intersectsLine
            Case True
                SetColor(255, 0, 0)
            Case False
                SetColor(0, 255, 0)
        End
        line.Draw()
        
        
        Select intersectsTri
            Case True
                SetColor(255, 0, 0)
            Case False
                SetColor(0, 255, 0)
        End
        tri.Draw()
        
        #REM
        Select intersects
            Case True
                SetColor(255, 255, 255)
                DrawCircle(circle.projection.x, circle.projection.y, 2)
            Case False
                SetColor(255, 255, 255)
                DrawLine(circle.projection.x, circle.projection.y, circle.center.x, circle.center.y)
        End
        #END
        
        SetColor(255, 255, 255)
        Select mouseObject
            Case 0
                DrawText("Shape: Line (SPACE to change)", 2, 2)
            Case 1
                DrawText("Shape: Rectangle (SPACE to change)", 2, 2)
            Case 2
                DrawText("Shape: Circle (SPACE to change)", 2, 2)
        End
        
        DrawText("LMB: rotate to counter-clockwise", 2, 14)
        DrawText("RMB: rotate to clockwise", 2, 26)
        
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