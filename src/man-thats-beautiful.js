// i've changed and optimized this code to use es6 standard, rather than es5 from hakim's original code.

/*          *     .        *  .    *    *   . 
 .  *  move your mouse to over the stars   .
 *  .  .   change these values:   .  *
   .      * .        .          * .       */

   export default function startStarryBackground() {
	const STAR_COUNT = (window.innerWidth + window.innerHeight) / 8;
	const STAR_SIZE = 3;
	const STAR_MIN_SCALE = 0.2;
	const OVERFLOW_THRESHOLD = 50;
  
	const canvas = document.querySelector('canvas');
	const context = canvas.getContext('2d');
  
	let scale = 1; // device pixel ratio
	let width, height;
	let pointerX, pointerY;
  
	const stars = [];
  
	const velocity = {
	  x: 0,
	  y: 0,
	  tx: 0,
	  ty: 0,
	  z: 0.0005
	};
  
	let touchInput = false;
  
	window.addEventListener('resize', resize);
	canvas.addEventListener('mousemove', onMouseMove);
	canvas.addEventListener('touchmove', onTouchMove);
	canvas.addEventListener('touchend', onMouseLeave);
	document.addEventListener('mouseleave', onMouseLeave);
  
	function generate() {
	  for (let i = 0; i < STAR_COUNT; i++) {
		stars.push({
		  x: 0,
		  y: 0,
		  z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
		});
	  }
	}
  
	function placeStar(star) {
	  star.x = Math.random() * width;
	  star.y = Math.random() * height;
	}
  
	function recycleStar(star) {
	  let direction = 'z';
	  const { x: vx, y: vy } = velocity;
	  if (Math.abs(vx) > 1 || Math.abs(vy) > 1) {
		const axis = Math.random() < Math.abs(vx) / (Math.abs(vx) + Math.abs(vy)) ? 'h' : 'v';
		if (axis === 'h') {
		  direction = vx > 0 ? 'l' : 'r';
		} else {
		  direction = vy > 0 ? 't' : 'b';
		}
	  }
	  star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);
	  if (direction === 'z') {
		star.z = 0.1;
		star.x = Math.random() * width;
		star.y = Math.random() * height;
	  } else if (direction === 'l') {
		star.x = -OVERFLOW_THRESHOLD;
		star.y = height * Math.random();
	  } else if (direction === 'r') {
		star.x = width + OVERFLOW_THRESHOLD;
		star.y = height * Math.random();
	  } else if (direction === 't') {
		star.x = width * Math.random();
		star.y = -OVERFLOW_THRESHOLD;
	  } else if (direction === 'b') {
		star.x = width * Math.random();
		star.y = height + OVERFLOW_THRESHOLD;
	  }
	}
  
	function resize() {
	  scale = window.devicePixelRatio || 1;
	  width = window.innerWidth * scale;
	  height = window.innerHeight * scale;
	  canvas.width = width;
	  canvas.height = height;
	  stars.forEach(placeStar);
	}
  
	function step() {
	  context.clearRect(0, 0, width, height);
	  update();
	  render();
	  requestAnimationFrame(step);
	}
  
	function update() {
	  velocity.tx *= 0.96;
	  velocity.ty *= 0.96;
	  velocity.x += (velocity.tx - velocity.x) * 0.8;
	  velocity.y += (velocity.ty - velocity.y) * 0.8;
  
	  stars.forEach(star => {
		star.x += velocity.x * star.z;
		star.y += velocity.y * star.z;
		star.x += (star.x - width / 2) * velocity.z * star.z;
		star.y += (star.y - height / 2) * velocity.z * star.z;
		star.z += velocity.z;
		// recycle when out of bounds
		if (
		  star.x < -OVERFLOW_THRESHOLD ||
		  star.x > width + OVERFLOW_THRESHOLD ||
		  star.y < -OVERFLOW_THRESHOLD ||
		  star.y > height + OVERFLOW_THRESHOLD
		) {
		  recycleStar(star);
		}
	  });
	}
  
	function render() {
	  stars.forEach(star => {
		context.beginPath();
		context.lineCap = 'round';
		context.lineWidth = STAR_SIZE * star.z * scale;
		context.strokeStyle = `rgba(255,255,255,${0.5 + 0.5 * Math.random()})`;
		context.beginPath();
		context.moveTo(star.x, star.y);
  
		let tailX = velocity.x * 2;
		let tailY = velocity.y * 2;
  
		// stroke() wont work on an invisible line
		if (Math.abs(tailX) < 0.1) tailX = 0.5;
		if (Math.abs(tailY) < 0.1) tailY = 0.5;
		context.lineTo(star.x + tailX, star.y + tailY);
		context.stroke();
	  });
	}
  
	function movePointer(x, y) {
	  if (typeof pointerX === 'number' && typeof pointerY === 'number') {
		const ox = x - pointerX;
		const oy = y - pointerY;
		velocity.tx = velocity.tx + (ox / 8) * scale * (touchInput ? 1 : -1);
		velocity.ty = velocity.ty + (oy / 8) * scale * (touchInput ? 1 : -1);
	  }
	  pointerX = x;
	  pointerY = y;
	}
  
	function onMouseMove(event) {
	  touchInput = false;
	  movePointer(event.clientX, event.clientY);
	}
  
	function onTouchMove(event) {
	  touchInput = true;
	  movePointer(event.touches[0].clientX, event.touches[0].clientY, true);
	  event.preventDefault();
	}
  
	function onMouseLeave() {
	  pointerX = null;
	  pointerY = null;
	}
  
	generate();
	resize();
	step();
  }