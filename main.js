

/**
 * Box2d web defs
 *
 */

var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

/*****
* Objects for Destruction
*/
var destroylist = []; // Empty List at start

/*
* Define Canvas and World
*/
var WIDTH=800;
var HEIGHT=600;
var SCALE=30;

var world = new b2World(
        new b2Vec2(0,9.81),
        true
    );

    var canJump = false;

/* World Objects */

//static
var ground = defineNewStatic(1.0,0.5,0.2,(WIDTH/2),HEIGHT,(WIDTH/2),5,"ground",0);

var LWall = defineNewStatic(1.0,0.5,0.2,0,(HEIGHT/2),5,(WIDTH/2),"LWall",0);

var RWall = defineNewStatic(1.0,0.5,0.2,WIDTH,(HEIGHT/2),5,(WIDTH/2),"RWall",0);

var plat1 = defineNewStatic(1.0,0.5,0.2,100,150,5,250,"plat1",-1.2);
var plat2 = defineNewStatic(1.0,0.5,0.2,600,250,5,250,"plat2",1.2);
var plat3 = defineNewStatic(1.0,0.5,0.2,100,400,5,600,"plat3",-1.4);
var plat4 = defineNewStatic(1.0,0.5,0.2,400,120,5,100,"plat4",1.6);
var platWin = defineNewStatic(1.0,0.5,0.2,800,80,5,150,"platWin",1.6);

//dynamic
//var mybox = defineNewDynamic(1.0,1.0,0.1,200,200,50,50,"abox");


// setInterval(function() {
//     defineNewDynamicCircle(1.0,0.2,0.1,200,100,30,"barrel");
// }, 10000);

//Hero
var hero = defineNewDynamicCircle(1.0, 0.5, 0.1, 30, 585, 15, "hero");
hero.GetBody().SetFixedRotation(true);

/*
Debug Draw
*/
var debugDraw = new b2DebugDraw();
debugDraw.SetSprite(document.getElementById("b2dcan").getContext("2d")
);
debugDraw.SetDrawScale(SCALE);
debugDraw.SetFillAlpha(0.3);
debugDraw.SetLineThickness(1.0);
debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
world.SetDebugDraw(debugDraw);



// Update World Loop
function update() {
    world.Step(
    1/60, // framerate
    10, // velocity iterations
    10 // position iterations
    );
    world.DrawDebugData();
    world.ClearForces();
    for (var i in destroylist) {
        world.DestroyBody(destroylist[i]);
        }
    destroylist.length = 0; 
    window.requestAnimationFrame(update);
    }
    window.requestAnimationFrame(update);
    


/*****
* Listeners
*/
var listener = new Box2D.Dynamics.b2ContactListener;
listener.BeginContact = function(contact) {
//console.log("Begin Contact:"+contact.GetFixtureA().GetBody().GetUserData());
    var fixa=contact.GetFixtureA().GetBody().GetUserData().id;
    var fixb=contact.GetFixtureB().GetBody().GetUserData().id;
    if(fixa == "barrel" && fixb == "ground") {
        destroylist.push(contact.GetFixtureA().GetBody());
    } 
    if (fixa == "ground" && fixb == "barrel") {
        destroylist.push(contact.GetFixtureB().GetBody());
    }
    if(fixa == "hero" && fixb == "ground") {
        console.log("got here 1");
        canJump = true;
        ///return canJump;
    } 
    if (fixa == "ground" && fixb == "hero") {
        console.log("got here 2");
        canJump = true;
        // return canJump;
    }
}
listener.EndContact = function(contact) {
//console.log("End Contact:"+contact.GetFixtureA().GetBody().GetUserData());
}
listener.PostSolve = function(contact, impulse) {
    var fixa=contact.GetFixtureA().GetBody().GetUserData().id;
    var fixb=contact.GetFixtureB().GetBody().GetUserData().id;
    console.log(fixa+" hits "+fixb+" with imp:"+impulse.normalImpulses[0]);
    // console.log(fixa+" hits "+fixb+" with imp:"+impulse.normalImpulses[0]);
        
    }
listener.PreSolve = function(contact, oldManifold) {
}
this.world.SetContactListener(listener);

//***** Controls*/



$(document).keydown(function(e) {
    var keyCode = e.keyCode ? e.keyCode : e.which;
    console.log(keyCode);
    if (keyCode == 65 || keyCode == 37) {
        console.log("left pressed");
        goleft();
    }

    if (keyCode == 68 || keyCode == 39) {
        goright();
    }
    console.log("b4 keypress canJump"+canJump);
    if (keyCode == 87 || keyCode == 32) {
        // console.log("b4 jump command canJump"+canJump);
        dojump();
        
        // console.log("b4 dojump canJump"+canJump)
        
        //up
    }

    if (keyCode == 83 || keyCode == 40) {
        //down
    }
})

$(document).keyup(function(e) {
    if (e.keycode == 65 || e.keycode == 37) {
        console.log("left up");
        goleft();
    }

    if (e.keycode == 68 || e.keycode == 39) {
        goright();
    }

    if (e.keycode == 87 || e.keycode == 38) {
        //up
        
    }

    if (e.keycode == 83 || e.keycode == 40) {
        //down
    }
})

/*****
* Utility Functions & Objects
*/
function dojump() {
    //console.log("Canjump" + canJump);
    if (canJump == true) {
        hero.GetBody().ApplyImpulse(new b2Vec2(0,-3), hero.GetBody().GetWorldCenter());
        canJump = false;
        console.log("afterjump command canJump"+canJump);
    }
    

                
}

function goleft() {
    hero.GetBody().ApplyImpulse(new b2Vec2(-5,0), hero.GetBody().GetWorldCenter());
    if(hero.GetBody().GetLinearVelocity().x < -10) {
        hero.GetBody().SetLinearVelocity(new b2Vec2(-10, hero.GetBody().GetLinearVelocity().y));
    }
}

function goright() {
    hero.GetBody().ApplyImpulse(new b2Vec2(5,0), hero.GetBody().GetWorldCenter());
    if(hero.GetBody().GetLinearVelocity().x > 10) {
        hero.GetBody().SetLinearVelocity(new b2Vec2(10, hero.GetBody().GetLinearVelocity().y));
    }
}



function defineNewStatic(density, friction, restitution, x, y, width, height, objid, angle) {
    var fixDef = new b2FixtureDef;
    fixDef.density = density;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;
    bodyDef.angle = angle;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(width/SCALE, height/SCALE);
    var thisobj = world.CreateBody(bodyDef).CreateFixture(fixDef);
    thisobj.GetBody().SetUserData({id:objid})
    return thisobj;
    }
    
    
function defineNewDynamic(density, friction, restitution, x, y, width, height, objid) {
    var fixDef = new b2FixtureDef;
    fixDef.density = density;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(width/SCALE, height/SCALE);
    var thisobj = world.CreateBody(bodyDef).CreateFixture(fixDef);
    thisobj.GetBody().SetUserData({id:objid})
    return thisobj;
    }

function defineNewDynamicCircle(density, friction, restitution, x, y, r, objid) {
    var fixDef = new b2FixtureDef;
    fixDef.density = density;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;
    fixDef.shape = new b2CircleShape(r/SCALE);
    var thisobj = world.CreateBody(bodyDef).CreateFixture(fixDef);
    thisobj.GetBody().SetUserData({id:objid})
    return thisobj;
    }
    