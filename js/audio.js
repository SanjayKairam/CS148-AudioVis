var context;
var source, sourceJs;
var analyser;
var buffer;
//var url = "../../music/cufool_you_in_my_world_instrumental.ogg";
var url = "../../music/Naked.mp3"
var array = new Array();
var boost = 0;

var interval = window.setInterval(function() {
	if($('#loading_dots').text().length < 3) {
		$('#loading_dots').text($('#loading_dots').text() + '.');
	}
	else {
		$('#loading_dots').text('');
	}
}, 500);

try {
	if(typeof webkitAudioContext === 'function') {
		context = new webkitAudioContext();
	}
	else {
		context = new AudioContext();
	}
}
catch(e) {
	$('#info').text('Web Audio API is not supported in this browser');
}
var request = new XMLHttpRequest();
request.open("GET", url, true);
request.responseType = "arraybuffer";

//slider stuff:

/*
 * Interface Control Setup
 */

var sliderValue = 5000;

$("#controls")
	.on("click", function (e) { e.stopPropagation(); })
	.on("mousemove", function (e) { e.stopPropagation(); });

$('#Slider').slider({
	step: 1, 
	min: 100, 
	max: 5000,
	start: function (e, ui) {
		e.stopPropagation();
	},
	slide: function (e, ui) {
		e.stopPropagation();
	},
	change: function(e, ui) {
		e.stopPropagation();
		console.log(ui.value);
		sliderValue = $('#Slider').slider('option', 'value')
		//apply($('input[name=filter]:checked').val());
		updateAudio(sliderValue);
		updateMoonTexture(sliderValue);
	}
});

request.onload = function() {
	context.decodeAudioData(
		request.response,
		function(buffer) {
			if(!buffer) {
				$('#info').text('Error decoding file data');
				return;
			}
			
			sourceJs = context.createScriptProcessor(2048, 1, 1);
			sourceJs.buffer = buffer;
			sourceJs.connect(context.destination);
			analyser = context.createAnalyser();
			analyser.smoothingTimeConstant = 0.6;
			analyser.fftSize = 512;
			
			source = context.createBufferSource();
			source.buffer = buffer;
			source.loop = true;

			var filter = context.createBiquadFilter();
			filter.type = 0; //LOWPASS
			filter.frequency.value = sliderValue;
			source.connect(filter);
			filter.connect(context.destination);
			
			source.connect(analyser);
			analyser.connect(sourceJs);

			this.source = source;
			this.filter = filter;
			//source.connect(context.destination);
			
			sourceJs.onaudioprocess = function(e) {
				array = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(array);
				boost = 0;
				for (var i = 0; i < array.length; i++) {
		            boost += array[i];
		        }
		        boost = boost / array.length;
		        //console.log(array);
			};
			
			$('#info')
				.fadeOut('normal', function() {
					$(this).html('<div id="artist"><a class="name" href="http://www.looperman.com/users/profile/345547" target="_blank">Cufool</a><br /><a class="song" href="http://www.looperman.com/tracks/detail/70506" target="_blank">You in my world instrumental</a><br /></div><div><img src="data/cufool.jpg" width="58" height="58" /></div>');
				})
				.fadeIn();
			
			clearInterval(interval);
			
			// popup
			$('body').append($('<div onclick="play();" id="play" style="width: ' + $(window).width() + 'px; height: ' + $(window).height() + 'px;"><div id="play_link"></div></div>'));
			$('#play_link').css('top', ($(window).height() / 2 - $('#play_link').height() / 2) + 'px');
			$('#play_link').css('left', ($(window).width() / 2 - $('#play_link').width() / 2) + 'px');
			$('#play').fadeIn();
		},
		function(error) {
			$('#info').text('Decoding error:' + error);
		}
	);
};

request.onerror = function() {
	$('#info').text('buffer: XHR error');
};

request.send();

function displayTime(time) {
	if(time < 60) {
		return '0:' + (time < 10 ? '0' + time : time);
	}
	else {
		var minutes = Math.floor(time / 60);
		time -= minutes * 60;
		return minutes + ':' + (time < 10 ? '0' + time : time);
	}
}

function play() {
	$('#play').fadeOut('normal', function() {
		$(this).remove();
	});
	source.start(0);
	//source.noteOn(0);
}

function updateAudio(sliderValue) {
	this.filter.frequency.value= sliderValue;
	//source.connect(filter);
	//filter.connect(context.destination);
}


$(window).resize(function() {
	if($('#play').length === 1) {
		$('#play').width($(window).width());
		$('#play').height($(window).height());
		
		if($('#play_link').length === 1) {
			$('#play_link').css('top', ($(window).height() / 2 - $('#play_link').height() / 2) + 'px');
			$('#play_link').css('left', ($(window).width() / 2 - $('#play_link').width() / 2) + 'px');
		}
	}
});
