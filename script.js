    var buttons;    
    var canvas; //handles information about the dimensions of our display area
	var canvasContext; //handles underlying graphical information like we can draw rectangles/circles or images to inside of a window or function
	var ballX = 50;
	var ballY = 50;
	var ballSpeedX = 10;
	var ballSpeedY = 4;

	var paddle1Y = 250;
	var paddle2Y = 250;
	const paddleHeight = 100;
	const paddleThickness = 10;

	var player1Score = 0;
	var player2Score = 0;
	const winningScore = 3;

	var showingWinScreen = false;
	var showGameScreen = true;

	var paddleBallDetect = 8;
	var paddleBallMovement = 35;

	window.onload = function () {
		buttons = document.getElementById('buttons');
		canvas = document.getElementById('gameCanvas');
		canvasContext = canvas.getContext('2d');

        var framesPerSecond = 30;
        setInterval(function() {
        	           moveEverything();
		               drawEverything();
		               gameStart();
	                   }, 1000/framesPerSecond);
		
	    canvas.addEventListener('mousedown',handleMouseClick);

	    canvas.addEventListener('mousemove',
            function(evt) {
            	var mousePos = calculateMousePos(evt);
            	paddle1Y = mousePos.y - (paddleHeight/2);
            });

	    canvas.addEventListener('keydown', reloader);

	}

	function gameStart() {
		if (showGameScreen) {
			//code that executes at the beginning of the game
		}
	}

	function drawEverything() {

 		//Blanks out the screen with black
		colorRect(0,0,canvas.width,canvas.height,'black');

		if (showingWinScreen) {

			canvasContext.fillStyle = 'White';
			canvasContext.font = '20px Courier New';
			var textPos1 = 380;
			var textPos2 = 360;

			if(player1Score >= winningScore) {
				canvasContext.fillText("You Won!!",textPos1,200);
			}
			else if (player2Score >= winningScore) {
				canvasContext.fillText("Computer Won!!",textPos2,200);
			}


			canvasContext.fillText("Click to Continue", 350, 500);

			canvasContext.fillText("Press F5 Key for HomePage", 300, 550);
			return;
		}

		drawNet();

		//left player paddle
		colorRect(0,paddle1Y,paddleThickness,paddleHeight,'white');

		//right computer paddle
		colorRect(canvas.width-paddleThickness,paddle2Y,paddleThickness,paddleHeight,'white');
		
		//draws the ball
		colorCircle(ballX, ballY, 10, 'white');
		
		canvasContext.fillStyle = 'White';
		canvasContext.font = '18px Courier New';
		canvasContext.fillText("Score: ", 160, 30);
		canvasContext.fillText(player1Score, 230, 30);
		canvasContext.fillText("Score: ", canvas.width-230, 30);
		canvasContext.fillText(player2Score, canvas.width-160, 30);

		if(showGameScreen) {
			colorRect(0,0,canvas.width,canvas.height,'black');
		}

	}

	function moveEverything() {

		computerMovement();

		if (showingWinScreen) {
			return;
		}

		

		if(showGameScreen) {
			return;
		}

		ballX = ballX + ballSpeedX;
		ballY = ballY + ballSpeedY;
		// ballSpeedX = ballSpeedX + 1; Use this line to accelerate the speed of ball
		
		

		if (ballX < 0) {
			if (ballY > paddle1Y && 
				ballY < paddle1Y + paddleHeight)
			{
				ballSpeedX = -ballSpeedX;

				var deltaY = ballY - (paddle1Y+paddleHeight/2);
				ballSpeedY = deltaY * 0.35;
			}
		else
		   {
				player2Score++;
				ballReset();
		   }
		}

		if (ballX > canvas.width) {
			if (ballY > paddle2Y && 
				ballY < paddle2Y + paddleHeight)
			{
				ballSpeedX = -ballSpeedX;
				var deltaY = ballY - (paddle2Y+paddleHeight/2);
				ballSpeedY = deltaY * 0.35;
			}
		else
		   {
				player1Score++;
				ballReset();
		   }
		}
		if (ballY < 0) {
			ballSpeedY = -ballSpeedY;
		}

		if (ballY > canvas.height) {
			ballSpeedY = -ballSpeedY;
		}
	}

	function colorRect(leftX, topY, width, height, drawColor) {

		canvasContext.fillStyle = drawColor;
		canvasContext.fillRect(leftX, topY, width, height);

	}

	function colorCircle(centerX, centerY, radius, drawColor) {

		canvasContext.fillStyle = drawColor;
		
		//begings a path or resets the current path
		canvasContext.beginPath();
		
		//arc creates circles or parts of circles
		//ballX - x-coordinate of the center of the circle
		//100 - y-coordinate of the center of the circle
		//10 - Radius of the circle
		//0 - sAngle - starting angle, in radians (0 is 3 o'clock position of the arc's circle)
		//Math.PI*2 - eAngle - ending angle in radians
		//counterclockwise - Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.
		canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
		canvasContext.fill();

	}

	//event that fires everytime the mouse moves on the canvas

	function calculateMousePos(evt) {
		var rect = canvas.getBoundingClientRect();
		var root = document.documentElement;
		var mouseX = evt.clientX - rect.left - root.scrollLeft;
		var mouseY = evt.clientY - rect.top - root.scrollTop;
		return {
			x:mouseX, y:mouseY
		};
	}

	function ballReset() {

		if (player1Score >= winningScore || 
			player2Score >= winningScore) {
						
						showingWinScreen = true;
		}

		ballSpeedX = -ballSpeedX;
        ballX = canvas.width/2;
        ballY = canvas.height/2;
	}

	function computerMovement() {
		var paddle2YCenter = paddle2Y + (paddleHeight/2); // comparing the ball to the center of the paddle
		if (paddle2YCenter < ballY - paddleBallMovement) {
			paddle2Y += paddleBallDetect; //paddle2Y = paddle2Y + 6 //if the paddle is above the ball, move it little down
		}
		else if (paddle2YCenter > ballY + paddleBallMovement) //paddleBallMoment is used to avoid the jerkiness of the paddle while moving up and down
		{
			paddle2Y -= paddleBallDetect; //paddle2Y = paddle2Y - 6 //if the paddle is below the ball, move it little up
		}
	}

	function handleMouseClick(evt) {
		if (showingWinScreen) {
			player1Score = 0;
			player2Score = 0;
			showingWinScreen = false;

		}
	}

	function drawNet() {
		for(var i=0; i<canvas.height; i+=26) {
			colorRect(canvas.width/2-1,i,3,15,'white');
		}
	}

	function easyMode() {

 		alert("Easy Mode");
 		paddleBallDetect = 6;
 		if(buttons.style.display === "none") 
 		{
 			buttons.style.display = "block";
 		} 
 		else 
 		{
 			buttons.style.display = "none";
 		}
 		showGameScreen = false;
 	}

	function medMode() {

 		alert("Medium Mode");
 		paddleBallDetect = 9;
 		if(buttons.style.display === "none") 
 		{
 			buttons.style.display = "block";
 		} 
 		else 
 		{
 			buttons.style.display = "none";
 		}
 		showGameScreen = false;
 	}

	function hardMode() {

 		alert("Hard Mode");
 		paddleBallDetect = 15;
 		if(buttons.style.display === "none") 
 		{
 			buttons.style.display = "block";
 		} 
 		else 
 		{
 			buttons.style.display = "none";
 		}
 		showGameScreen = false;
 	}


	function reloader(evt) {
 			if(evt.which==82) {
 			
 			document.location.reload();
            }
 
 	//Cheat xD
 			if(evt.which==13) {
 				player1Score = 3;
 				showingWinScreen = true;
 				}
      }