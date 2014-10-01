Strict


Class Math
    ' ==========================
    ' WRAP ANGLE
    ' ==========================
    Function WrapAngle:Float(angle:Float)
        While (angle > 360)
            angle -= 360
        Wend
        While (angle < 0)
            angle += 360
        Wend
            
        Return angle
    End
    
    Function Lerp:Float(a:Float, b:Float, c:Float)
        Return a + c * (b - a)
    End
End