Strict

' Monkey Config
#MOJO_AUTO_SUSPEND_ENABLED=false


' Engine
Import mgev2.kernel.engine

' Systems
Import mgev2.system.collisionsystem
Import mgev2.system.movementsystem
Import mgev2.system.rendersystem
Import mgev2.system.inputsystem

' Components
Import mgev2.component.positioncomponent
Import mgev2.component.gravitycomponent
Import mgev2.component.movementcomponent
Import mgev2.component.physicscomponent
Import mgev2.component.rendercomponent
Import mgev2.component.collision.aabb
Import mgev2.component.collision.quadtree
Import mgev2.component.entity

' Utilities
Import mgev2.utils.deltatiming
Import mgev2.utils.functions
Import mgev2.utils.vector