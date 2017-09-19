	
var flag=0;
var eyes = {}
var pupils = {}
var arms = {}
var avatars = {}

var client = deepstream('wss://154.deepstreamhub.com?apiKey=4f3d4540-afe5-429e-ae68-160212e376a7')
console.log('starting')
client.login({}, function (success,data) {
	console.log("logged in", success)
	if(success){
		startApp(data)
	}else{
		console.error("deepstream Login Failed")
	}

})

function startApp(data){
	//var myScene = document.getElementById("scene");
	//var newBox = document.createElement("a-box");
	//<a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
	/*newBox.setAttribute("position","-1 0.5 -3")
	newBox.setAttribute("rotation","0 45 0")
	newBox.setAttribute("color","#4CC3D9")
	console.log("creating box")
	myScene.appendChild(newBox)*/
	
	var x = Math.random() * (5 - (1)) + (1);
	var y = 0; // Math.random() * (5 - (1)) + (1);
	var z = 0; // Math.random() * (5 - (1)) + (1);
  var initialPosition = {x: x, y: y, z: z};
  console.log('init pos', initialPosition);
	
	//var myBoxColor = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16)
    var myBoxColor = '#222'
    var currentUser = client.record.getRecord('user/'+ data.id);
    currentUser.whenReady(function() {
    	currentUser.set({
    		type: 'a-box',
    		attr: {
    			position: initialPosition,
    			rotation: "0 0 0",
    			color: myBoxColor,
    			id: data.id,
    			depth: "1",
    			height: "1",
    			width: "1"
    		}
    	})
      var camera = document.getElementById('user-cam');
      var networkTick = function() {
        var latestPosition = camera.getAttribute('position');
        var latestRotation = camera.getAttribute('rotation');
        currentUser.set({
          attr: {
            position: latestPosition,
            rotation: latestRotation
          }
        });
      };
      setInterval(networkTick, 100);
    })

    
	client.presence.getAll(function(ids) {
		ids.forEach(subscribeToAvatarChanges)
	});

	client.presence.subscribe((userId, isOnline) => {
    console.log('user presence id', userId, 'online?', isOnline);
		if( isOnline ) {
      subscribeToAvatarChanges(userId)
		} else{
			removeModel(userId)
		}
	});
    
	
   
}

function removeModel(id){
   var scene = document.getElementById('scene');
   scene.removeChild(avatars[id]);
   client.record.getRecord('user/'+id).delete();
  
// 	console.log("box id being deleted is ", id)
// 	//elements[id].setAttribute("color","cyan")
// 	//elements[id].setAttribute("opacity",0)
// 	document.getElementById('scene').removeChild(avatars[id]);
//   client.record.getRecord('user/'+id).delete();
//   document.getElementById('scene').removeChild(document.getElementById('leye'+id));
//   console.log("removing eye with id", 'leye'+id)

//     var parent = document.getElementById("scene");
//     //parent.removeChild(elements[id]);
//     //elements[id].parentNode.removeChild(elements[id]);
//     console.log(avatars[id].nodeName)
//     //elements[id].setAttribute("material","opacity",0);
//     console.log("boxId is "+id)
//     //document.querySelector('#'+id).setAttribute("color","green")
//     console.log("elements attr is "+elements[id].getAttribute("color"))
//     console.log("Removing box with id", id)
}

function createAvatar (id, rec) {
	console.log("rendering avatar for userId", id)
		
	var attr = rec.get('attr')
	console.log("Inside createAvatar attr is "+attr);
	var type = rec.get('type')
	
	var newBox = document.createElement(type);
  console.log("CREATED BOX OF TYPE ",newBox);
	for( var name in attr ) {
    console.log('im here')
		console.log(name, attr[name])
		newBox.setAttribute( name, attr[ name ] );
	}
  
	var leye = document.createElement('a-entity')
	leye.setAttribute('mixin','eye')
	var reye = document.createElement('a-entity')
	reye.setAttribute('mixin','eye')
	

	var lpupil = document.createElement('a-entity')
	lpupil.setAttribute('mixin','pupil')
	var rpupil = document.createElement('a-entity')
	rpupil.setAttribute('mixin','pupil')

	var larm = document.createElement('a-entity')
	larm.setAttribute('mixin','arm')
	var rarm = document.createElement('a-entity')
	rarm.setAttribute('mixin','arm')

	var x= attr.position.x;
	var y= 0;
	var z= 0;

	var leyex = x+0.25
	var leyey = y+0.20
	var leyez = z-0.6

	var reyex = x-0.25
	var reyey = y+0.20
	var reyez = z-0.6


	var lpx = x+0.25
	var lpy = y+0.20
	var lpz = z-0.8

	var rpx = x-0.25
	var rpy = y+0.20
	var rpz = z-0.8

	leye.setAttribute('position', leyex + " "+ leyey + " " + leyez)
	leye.setAttribute('id','leye'+id)
	reye.setAttribute('position', reyex + " "+ reyey + " " + reyez)
	reye.setAttribute('id','reye'+id)

	lpupil.setAttribute('position', lpx + " "+ lpy + " " + lpz)
	lpupil.setAttribute('id','lpupil'+id)
	rpupil.setAttribute('position', rpx + " "+ rpy + " " + rpz)
	rpupil.setAttribute('id','rpupil'+id)

	var larmx = x-0.5
	var larmy = y-1.8
	var larmz = z

	var rarmx = x+0.5
	var rarmy = y-1.8
	var rarmz = z



	larm.setAttribute('position', larmx + " "+ larmy + " " + larmz)
	larm.setAttribute('id','larm'+id)
	larm.setAttribute('rotation','0 0 -10')
	
	
	rarm.setAttribute('position', rarmx + " "+ rarmy + " " + rarmz)
	rarm.setAttribute('id','rarm'+id)
	rarm.setAttribute('rotation','0 0 10')

  var avatarRoot = document.createElement('a-entity');
	avatarRoot.appendChild(newBox);
	avatarRoot.appendChild(leye);
	avatarRoot.appendChild(reye);
	avatarRoot.appendChild(lpupil);
	avatarRoot.appendChild(rpupil);
	avatarRoot.appendChild(larm);
	avatarRoot.appendChild(rarm);
  
  var scene = document.getElementById('scene');
  scene.appendChild(avatarRoot);
  
  avatars[id] = avatarRoot;


	arms['larm'+id] = document.getElementById('larm'+id)
	arms['rarm'+id] = document.getElementById('rarm'+id)
	console.log("adding arm ", 'larm'+id)
	//newBox.setAttribute('camera','')
	//newBox.setAttribute('look-controls','')
	//newBox.setAttribute('wasd-controls','')
	//rec.subscribe('attr', (attr) => {
	//	for (var name in attr){
	//		newBox.setAttribute(name,attr[name])
	//	}
	//	
	//});

	eyes['leye'+id] = document.getElementById('leye')
	eyes['reye'+id] = document.getElementById('reye')
	console.log("adding eye ", 'leye'+id)
	pupils['lpupil'+id] = document.getElementById('lpupil')
	pupils['rpupil'+id] = document.getElementById('rpupil')

//4.145 1.260 2.169


	//window.addEventListener('touchstart', raiseHands(larm, rarm, larmx, larmy, larmz, rarmx, rarmy, rarmz))
	//window.addEventListener('touchend', dropHands(larm, rarm, larmx, larmy, larmz, rarmx, rarmy, rarmz))
	//window.addEventListener('mousedown', raiseHands(larm, rarm, larmx, larmy, larmz, rarmx, rarmy, rarmz))
	//window.addEventListener('mouseup', dropHands(larm, rarm, larmx, larmy, larmz, rarmx, rarmy, rarmz))
	// $(function(){
 //   	 $('body').on('touchstarddt', function(larmx, larmy, larmz){
 //   	 	console.log("touchstart called")
 //   	 	console.log(id)
 //       // larmy+=1.5
	// 	//$('#larm'+id).attr('position', larmx + " "+ larmy+" "+larmz)
	// 	//$('#larm'+id).attr('rotation', "0 0 10")
	// 	$('#larm'+id).attr('color', "blue")
 //    });
 //   	 })



/*
	$('#larm'+id).onclick(function(larmx, larmy, larmz, rarmx, rarmy, rarmz){
	larmy+=1.5
		$('#larm'+id).attr('position', larmx + " "+ larmy+" "+larmz)
		$('#larm'+id).attr('rotation', "0 0 10")
	})
	$('#rarm'+id).onclick(function(larmx, larmy, larmz, rarmx, rarmy, rarmz){
	rarmy+=1.5
		$('#rarm'+id).attr('position', rarmx + " "+ rarmy+" "+rarmz)
		$('#rarm'+id).attre('rotation', "0 0 -10")
	})
	$('#larm'+id).mousedown(function(larmx, larmy, larmz, rarmx, rarmy, rarmz){
		$('#larm'+id).attr('position', larmx + " "+ larmy + " " + larmz)
		$('#larm'+id).attr('rotation','0 0 -10')		
	})
	$('#rarm'+id).mousedown(function(larmx, larmy, larmz, rarmx, rarmy, rarmz){	
		$('#rarm'+id).attr('position', rarmx + " "+ rarmy + " " + rarmz)
		$('#larm'+id).attr('rotation','0 0 10')
	})*/

} 


function subscribeToAvatarChanges(id){
	var newUser = client.record.getRecord('user/'+id);
  newUser.whenReady(function() {
    console.log("Inside subscribeToAvatarChanges1 newUser id is "+ newUser.get('attr.id'));
    newUser.subscribe('attr', (attr) => {
      console.log("Inside subscribeToAvatarChanges2 newUser id is "+ newUser.get('attr.id'));
      if (avatarExists(id)) {
        updateAvatar(id, newUser);
      }
      else {
        createAvatar(id, newUser);	
      }
    })
	})
}

function avatarExists(id) {
  return avatars.hasOwnProperty(id);
}

function updateAvatar(id, userRecord) {
  var avatar = avatars[id];
  var position = userRecord.get('attr.position');
  var rotation = userRecord.get('attr.rotation');
  
  avatar.setAttribute('position', position);
  avatar.setAttribute('rotation', rotation);
}

// function subscribeToAvatarChanges(id){
// 	var newUser = client.record.getRecord('user/'+id);
//   newUser.whenReady(function() {
//     console.log("Inside subscribeToAvatarChanges1 newUser id is "+ newUser.get('attr.id'));
//     var attr = newUser.get('attr');
//     if(!attr) {
//       console.log("attr not available yet")
//       newUser.subscribe('attr', (attr) => {
//         if (attr) {
//           console.log("Inside subscribeToAvatarChanges2 newUser id is "+ newUser.get('id'));
//           createAvatar(id, newUser);	
//         }
//       })
//       return
//     }
//     console.log("Attribues present")
//     createAvatar(id, newUser)
// 	})
// }
    //     window.onbeforeunload = function(e){
    // 	client.record.delete('user/'+id)\
    // 	newElement.remove();
    // }





		  /*newUser.subscribe(function updateScene(recordName,recordData){
    	var newBox = document.createElement(recordData.type);
	    for( var name in recordData.attr ) {
			newBox.setAttribute( name, recordData.attr[ name ] );
		}
	    myScene.appendChild(newBox);
    });*/
    //myScene.appendChild(newUser);
		
		
            



