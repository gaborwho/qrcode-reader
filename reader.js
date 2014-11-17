(function() {

var vcam = document.getElementById('vcam'),
	qrc = document.getElementById('qr-canvas'),
	result = document.getElementById('result'),
	qrctx = qrc.getContext('2d'),
	maxsize = 400;

function resultProcess(data)
{
	document.body.style.backgroundColor='green';
	result.innerHTML = data;
}
qrcode.callback = resultProcess;

function processor()
{
	console.log('process');
	if (!vcam.paused && !vcam.ended)
	{
		document.body.style.backgroundColor='gray';

		vw = vcam.videoWidth;
		vh = vcam.videoHeight;

		vcamsize = vw > vh ? vw : vh;

		if (vcamsize > maxsize)
		{
			vcamsize = maxsize;
		}

		if (vh > vw)
		{
			qrh = vcamsize;
			qrw = vcamsize * vw / vh;
		}
		else
		{
			qrw = vcamsize;
			qrh = vcamsize * vh / vw;
		}

		qrc.setAttribute('width', qrw);
		qrc.setAttribute('height', qrh);

		qrctx.drawImage(vcam, 0, 0, qrw, qrh);

		try {
			qrcode.decode();
		}
		catch (e) { console.log('error'); }
	}

	setTimeout(function(){processor()}, 50);
}

vcam.addEventListener('play', function() {
	processor();
}, false);

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
if (navigator.getUserMedia) {
	navigator.getUserMedia(
		{
			// try to restrict video resolution
			'video': { 'mandatory' : { 'maxWidth': maxsize, 'maxHeight': maxsize } },
			'audio': false
		},		
		function(stream) {

			// Cross browser checks
			if (window.URL) {
				vcam.src = window.URL.createObjectURL(stream);
			}
			else {
				vcam.src = stream;
			}

			// Set the video to play
			vcam.play();
		},
		function(error) {
			alert('Something went wrong. Error code: ' + error.code);
			return;
		}
	);
}
else {
	alert('Your browser does not support camera video');
	return;
}

})();
