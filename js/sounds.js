sounds = {"select":"select.mp3", 
		"menu_change":"menu_change.wav",
		"expand":"expand.wav",
		"back":"back.wav",
		"break": "break.wav",
		"lose-sound": "lose.wav",
		"paddle": "paddle.mp3",
		"win-sound": "win.mp3"}

for (let [key, src] of Object.entries(sounds)){
	boink = document.createElement("audio")
	boink.src = "../assets/sound/" + src 
	boink.style.display = "none";
	boink.setAttribute("id",key)
	document.body.appendChild(boink)
}


// Play sound
function playSound(key){
  doink = document.getElementById(key)
  console.log(doink)
  doink.currentTime = 0;
  doink.play()
}
