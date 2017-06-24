goog.provide('test.frame4');


goog.require('lime');
goog.require('lime.Circle');
goog.require('lime.Director');
goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('lime.fill.Frame');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.animation.MoveBy');
goog.require('lime.SpriteSheet');
goog.require('lime.ASSETS.monster.plist')



test.WIDTH = 6000;
test.HEIGHT = 4000;


test.start = function() {

	//director
	test.director = new lime.Director(document.body, test.WIDTH, test.HEIGHT);
	test.director.makeMobileWebAppCapable();

	var gamescene = new lime.Scene;
	
    layer = new lime.Layer();
	gamescene.appendChild(layer);
	
	goog.events.listen(gamescene,['mousedown','touchstart'],function(e){
	    test.moveToPosition(test.selectedMonster,gamescene.localToNode(e.position,layer));
	})
	
	// load the spritesheet
	test.ss = new lime.SpriteSheet('assets/monster.png',lime.ASSETS.monster.plist);
	
	
    var sprite = test.makeMonster().setPosition(1000,1000);
    layer.appendChild(sprite);
	
	test.selectedMonster = sprite;
	sprite.select();

    sprite = test.makeMonster().setPosition(5000,1000);
    layer.appendChild(sprite);

    sprite = test.makeMonster().setPosition(3000,2000);
    layer.appendChild(sprite);

    sprite = test.makeMonster().setPosition(2000,3000);
    layer.appendChild(sprite);

    sprite = test.makeMonster().setPosition(4000,3000);
    layer.appendChild(sprite);

	
    // set active scene
    test.director.replaceScene(gamescene);
};

test.makeMonster = function(){
    var sprite = new lime.Sprite().setPosition(2000,2000)
        .setFill(test.ss.getFrame('angle10020.png'));
	//layer.appendChild(sprite);
	
	// show if monster is selected
	var light = new lime.Circle().setSize(6,6).setFill('#f90').setPosition(0,-40).setHidden(true);
	sprite.appendChild(light);
	
	sprite.select = function(){
	    if(test.selectedMonster)
	        test.selectedMonster.deselect();
	    light.setHidden(false);
	    test.selectedMonster = this;
	}
	sprite.deselect = function(){
	    light.setHidden(true);
	}
	
	// other element for hit area because original images have edges and I didn't crop
	var hitarea = new lime.Sprite().setSize(50,80);
	sprite.appendChild(hitarea);
	
	goog.events.listen(hitarea,['mousedown','touchstart'],function(e){
	    this.select();
	    e.event.stopPropagation();
	},false,sprite)
	
	return sprite;
}

test.moveToPosition = function(monster,pos){
    
    var delta = goog.math.Coordinate.difference(pos,monster.getPosition()),
        angle = Math.atan2(-delta.y,delta.x);
    
    //determine the direction    
    var dir = Math.round(angle/(Math.PI*2)*8);
    var dirs = ['1','2','3','4','5','6','7','8'];
    if(dir<0) dir=8+dir;
    dir = dirs[dir];
    
    //move
    var move =new lime.animation.MoveBy(delta).setEasing(lime.animation.Easing.LINEAR).setSpeed(3);
    monster.runAction(move);
	
	// show animation
	var anim = new lime.animation.KeyframeAnimation();
	anim.delay= 1/24;
	for(var i=20;i<=70;i++){
	    anim.addFrame(test.ss.getFrame('angle'+dir+'00'+i+'.png'));
	}
    monster.runAction(anim);
    
    // on stop show front facing
    goog.events.listen(move,lime.animation.Event.STOP,function(){
        anim.stop();
        monster.setFill(test.ss.getFrame('angle10020.png'));
    })
    
}


goog.exportSymbol('test.start', test.start);
