Strict

Import mojo
Import mgev2.utils.math.vector

Function Main:Int()
    
    New Test()

    Return 0
End

Class Test Extends App
    Field p1:Vector = New Vector(100, 250)
    Field p2:Vector = New Vector(350, 100)
    Field line:Vector = New Vector()
    
    Field mouse:Vector = New Vector()
    Field mouseToLine:Vector = New Vector()
    
    Field dot:Float
    Field dist:Float, dotOnLine:Vector = New Vector()
    
    Field projection:Vector = New Vector()
    
    Field angle:Float
    
    Method OnCreate:Int()
        SetUpdateRate(60)
        
        Return 0
    End
    
    Method OnRender:Int()
        Cls()
    
        ' Piirretään taso
        SetColor(255, 255, 255)
        DrawLine(p1.x, p1.y, p2.x, p2.y)
        DrawLine(p1.x, p1.y, mouse.x, mouse.y)
        
        
        SetColor(255, 0, 0)
        DrawLine(mouse.x, mouse.y, p1.x + projection.x, p1.y + projection.y)
        
        ' Pallo tasolla
        SetColor(0, 255, 0)
        DrawLine(p1.x, p1.y, p1.x + projection.x, p1.y + projection.y)
        SetColor(255, 0, 255)
        DrawCircle(p1.x + projection.x, p1.y + projection.y, 3)
        
        SetColor(0, 255, 0)
        DrawText("Mouse and line DotProduct: " + String(dot)[ .. 6], 2, 2)

        SetColor(255, 0, 0)
        DrawText("Mouse's distance to line: " + String(dist)[ .. 6], 2, 14)
        
        SetColor(255, 255, 255)
        DrawText("Angle to mouse: " + String(angle)[ .. 6], p1.x + 16, p1.y + 8)
        
        DrawText("Projection.Length: " + String(projection.Length)[ .. 6], 2, 468)
        DrawText("Line.Length: " + String(line.Length)[ .. 6], 2, 456)

        Return 0
    End
    
    Method OnUpdate:Int()
        mouse.Set(MouseX(), MouseY())
        mouseToLine = Vector.MakeBetween(mouse, p1)
        line = Vector.MakeBetween(p2, p1)
        
        projection = mouseToLine.Project(line)
        projection.Limit(line.Length)
        
        dot = mouseToLine.Dot(line) / line.Dot(line)
        dot = Min(1.0, Max(0.0, dot))
        
        dotOnLine = p1.Add(projection) 'p1.Add(line.Multiply(dot))
        dist = mouse.DistanceTo(dotOnLine)
        
        angle = p1.AngleTo(mouse)
    
        Return 0
    End
    
    
End