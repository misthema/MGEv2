Strict

' Monkey Config
#MOJO_AUTO_SUSPEND_ENABLED=false


' Engine
Import mgev2.src.kernel.engine

' Systems
Import mgev2.src.system.system
Import mgev2.src.system.collisionsystem
Import mgev2.src.system.movementsystem
Import mgev2.src.system.rendersystem
Import mgev2.src.system.inputsystem

' Components
Import mgev2.src.component.positioncomponent
Import mgev2.src.component.gravitycomponent
Import mgev2.src.component.movementcomponent
Import mgev2.src.component.physicscomponent
Import mgev2.src.component.rendercomponent
Import mgev2.src.component.collision.aabb
Import mgev2.src.component.collision.quadtree
Import mgev2.src.component.collision.collisioncheck
Import mgev2.src.component.collision.collisionresponse
Import mgev2.src.component.entity
Import mgev2.src.component.component
Import mgev2.src.component.inputcomponent
Import mgev2.src.component.sizecomponent



' Utilities
Import mgev2.src.utils.deltatiming
Import mgev2.src.utils.functions

' Math
Import mgev2.src.utils.math.vector
Import mgev2.src.utils.math.math

' Geometry
'Import mgev2.src.utils.geom.circle
'Import mgev2.src.utils.geom.rectangle
'Import mgev2.src.utils.geom.segment
Import mgev2.src.utils.geom.shape
