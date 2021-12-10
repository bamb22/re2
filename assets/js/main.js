
$('.slider').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 2000,
  });

 

  $('.slider03').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  });

  $('.slider04').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  });

  $('.slider05').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  });


;(function(window) {

	'use strict';

	var bodyEl = document.body,
		docElem = window.document.documentElement,

		docWidth = Math.max(bodyEl.scrollWidth, bodyEl.offsetWidth, docElem.clientWidth, docElem.scrollWidth, docElem.offsetWidth),
		docHeight = Math.max(bodyEl.scrollHeight, bodyEl.offsetHeight, docElem.clientHeight, docElem.scrollHeight, docElem.offsetHeight);

	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}


	function CircleSlideshow(el, options) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );

		this.items = [].slice.call(this.el.querySelectorAll('.slide'));

		this.itemsTotal = this.items.length;
		if( this.itemsTotal < 2 ) return;


		this.closeCtrl = this.el.querySelector('.action--close');

		this.current = 0;

		this.isClosed = true;

		this._init();
	}

	CircleSlideshow.prototype.options = {};

	CircleSlideshow.prototype._init = function() {
	
		this.navLeftCtrl = document.createElement('button');
		this.navLeftCtrl.className = 'navbutton navbutton--next';
		this.navLeftCtrl.setAttribute('aria-label', 'Next item');
		this.navLeftCtrl.innerHTML = '<svg width="100px" height="30px" viewBox="0 0 100 30"><polyline class="navbutton__line" fill="none" stroke="#6CD84E" stroke-width="5" points="69.821,3.795 92.232,26.205 0,26.205"/></svg>';

		this.navRightCtrl = document.createElement('button');
		this.navRightCtrl.className = 'navbutton navbutton--prev';
		this.navRightCtrl.setAttribute('aria-label', 'Previous item');
		this.navRightCtrl.innerHTML = '<svg width="100px" height="30px" viewBox="0 0 100 30"><polyline class="navbutton__line" fill="none" stroke="#6CD84E" stroke-width="5" points="30.179,26.205 7.768,3.795 100,3.795"/></svg>';

		this.el.insertBefore(this.navLeftCtrl, this.el.firstChild);
		this.el.insertBefore(this.navRightCtrl, this.el.firstChild);

		var leftCircle = document.createElement('div'), rightCircle = document.createElement('div');
		leftCircle.className = 'deco deco--circle deco--circle-left';
		rightCircle.className = 'deco deco--circle deco--circle-right';
		
		this.el.insertBefore(leftCircle, this.el.firstChild);
		this.el.insertBefore(rightCircle, this.el.firstChild);

		this.circles = {left: leftCircle, right: rightCircle};
		dynamics.css(this.circles.left, {scale: 0.8});
		dynamics.css(this.circles.right, {scale: 0.8});

		
		this.items.forEach(function(item) {
			var expanderEl = document.createElement('div');
			expanderEl.className = 'deco deco--circle deco--expander';

			var slideEl = item.querySelector('.slide__item');
			slideEl.insertBefore(expanderEl, slideEl.firstChild);
		});


		classie.add(this.items[this.current], 'slide--current');

		this._initEvents();
	};

	CircleSlideshow.prototype._initEvents = function() {
		var self = this;


		this.navRightCtrl.addEventListener('click', function() { self._navigate('left'); });
		this.navLeftCtrl.addEventListener('click', function() { self._navigate('right'); });


		this.items.forEach(function(item) {
			item.querySelector('.action--open').addEventListener('click', function(ev) {
				self._openContent(item);
				ev.target.blur();
			});
		});


		this.closeCtrl.addEventListener('click', function() { self._closeContent(); });


		document.addEventListener('keydown', function(ev) {
			var keyCode = ev.keyCode || ev.which;
			switch (keyCode) {
				case 37:
					self._navigate('left');
					break;
				case 39:
					self._navigate('right');
					break;
				case 13: 
					if( self.isExpanded ) return;
					self._openContent(self.items[self.current]);
					break;
				case 27: 
					if( self.isClosed ) return;
					self._closeContent();
					break;
			}
		});


		this.el.addEventListener('touchstart', handleTouchStart, false);        
		this.el.addEventListener('touchmove', handleTouchMove, false);
		var xDown = null;
		var yDown = null;
		function handleTouchStart(evt) {
			xDown = evt.touches[0].clientX;
			yDown = evt.touches[0].clientY;
		};
		function handleTouchMove(evt) {
			if ( ! xDown || ! yDown ) {
				return;
			}

			var xUp = evt.touches[0].clientX;
			var yUp = evt.touches[0].clientY;

			var xDiff = xDown - xUp;
			var yDiff = yDown - yUp;

			if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
				if ( xDiff > 0 ) {
					/* left swipe */
					if( !self.isExpanded ) {
						self._navigate('right');	
					}
				} else {
					/* right swipe */
					if( !self.isExpanded ) {
						self._navigate('left');	
					}
				}
			} 

			xDown = null;
			yDown = null;
		};
	};

	CircleSlideshow.prototype._navigate = function(dir) {
		if( this.isExpanded ) {
			return false;
		}

		this._moveCircles(dir);

		var self = this,
			itemCurrent = this.items[this.current],
			currentEl = itemCurrent.querySelector('.slide__item'),
			currentTitleEl = itemCurrent.querySelector('.slide__title');


		if( dir === 'right' ) {
			this.current = this.current < this.itemsTotal-1 ? this.current + 1 : 0;
		}
		else {
			this.current = this.current > 0 ? this.current - 1 : this.itemsTotal-1;
		}

		var itemNext = this.items[this.current],
			nextEl = itemNext.querySelector('.slide__item'),
			nextTitleEl = itemNext.querySelector('.slide__title');
		

		dynamics.animate(currentEl, 
			{
				translateX: dir === 'right' ? -1*currentEl.offsetWidth : currentEl.offsetWidth, scale: 0.7
			}, 
			{
				type: dynamics.spring, duration: 2000, friction: 600,
				complete: function() {
					dynamics.css(itemCurrent, { visibility: 'hidden' });
				}
			}
		);


		dynamics.animate(currentTitleEl, 
			{
				translateX: dir === 'right' ? -250 : 250, opacity: 0
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 450
			}
		);

	
		dynamics.css(itemNext, {visibility: 'visible'});
		dynamics.css(nextEl, {translateX: dir === 'right' ? nextEl.offsetWidth : -1*nextEl.offsetWidth, scale: 0.7});


		dynamics.animate(nextEl, 
			{
				translateX: 0
			}, 
			{
				type: dynamics.spring, duration: 3000, friction: 700, frequency: 500,
				complete: function() {
					self.items.forEach(function(item) { classie.remove(item, 'slide--current'); });
					classie.add(itemNext, 'slide--current');
				}
			}
		);

		
		dynamics.css(nextTitleEl, { translateX: dir === 'right' ? 250 : -250, opacity: 0 });

		dynamics.animate(nextTitleEl, 
			{
				translateX: 0, opacity: 1
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000
			}
		);
	};

	CircleSlideshow.prototype._moveCircles = function(dir) {
		var animProps = {
			type: dynamics.easeIn, 
			duration: 100,
			complete: function(el) {
				dynamics.animate(el, 
					{
						translateX: 0, scale: 0.8
					}, 
					{ 
						type: dynamics.spring, duration: 1000, friction: 300
					}
				);
			}
		};

		dynamics.animate(this.circles.right, 
			{
				translateX: dir === 'right' ? -this.circles.right.offsetWidth/3 : this.circles.right.offsetWidth/3, scale: 0.9
			}, 
			animProps
		);
		dynamics.animate(this.circles.left, 
			{
				translateX: dir === 'right' ? -this.circles.left.offsetWidth/3 : this.circles.left.offsetWidth/3, scale: 0.9
			}, 
			animProps
		);
	};

	CircleSlideshow.prototype._openContent = function(item) {
		this.isExpanded = true;
		this.isClosed = false;
		this.expandedItem = item;

		var self = this,
			expanderEl = item.querySelector('.deco--expander'),
			scaleVal = Math.ceil(Math.sqrt(Math.pow(docWidth, 2) + Math.pow(docHeight, 2)) / expanderEl.offsetWidth),
			smallImgEl = item.querySelector('.slide__img--small'),
			contentEl = item.querySelector('.slide__content'),
			largeImgEl = contentEl.querySelector('.slide__img--large'),
			titleEl = contentEl.querySelector('.slide__title--main'),
			descriptionEl = contentEl.querySelector('.slide__description'),
			priceEl = contentEl.querySelector('.slide__price'),
			buyEl = contentEl.querySelector('.button--buy');

		classie.add(item, 'slide--open');

		bodyEl.style.top = -scrollY() + 'px';
		classie.add(bodyEl, 'lockscroll');
		

		dynamics.css(largeImgEl, {translateY : 800, opacity: 0});

		dynamics.css(titleEl, {translateY : 600, opacity: 0});

		dynamics.css(descriptionEl, {translateY : 400, opacity: 0});

		dynamics.css(priceEl, {translateY : 400, opacity: 0});

		dynamics.css(buyEl, {translateY : 400, opacity: 0});

		
		dynamics.animate(expanderEl, 
			{
				scaleX : scaleVal, scaleY : scaleVal
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.5,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.5,"y":1}]}], duration: 1700
			}
		);
		
	
		dynamics.animate(smallImgEl, 
			{
				translateY : -600, opacity : 0
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 300, delay: 75
			}
		);


		dynamics.animate(largeImgEl, 
			{
				translateY : 0, opacity : 1
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000, delay: 300
			}
		);


		dynamics.animate(titleEl, 
			{
				translateY : 0, opacity : 1
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000, delay: 400
			}
		);

		dynamics.animate(descriptionEl, 
			{
				translateY : 0, opacity : 1
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000, delay: 500
			}
		);


		dynamics.animate(priceEl, 
			{
				translateY : 0, opacity : 1
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000, delay: 600
			}
		);


		dynamics.animate(buyEl, 
			{
				translateY : 0, opacity : 1
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000, delay: 700,
				complete: function() {
				
					classie.add(bodyEl, 'noscroll');
					classie.add(contentEl, 'scrollable');
					
					
					contentEl.style.display = 'none';
					contentEl.offsetHeight;
					contentEl.style.display = 'block';
					
		
					classie.remove(bodyEl, 'lockscroll');
				}
			}
		);
	};

	CircleSlideshow.prototype._closeContent = function() {
		this.isClosed = true;

		var self = this,
			item = this.expandedItem,
			expanderEl = item.querySelector('.deco--expander'),
			smallImgEl = item.querySelector('.slide__img--small'),
			contentEl = item.querySelector('.slide__content'),
			largeImgEl = contentEl.querySelector('.slide__img--large'),
			titleEl = contentEl.querySelector('.slide__title--main'),
			descriptionEl = contentEl.querySelector('.slide__description'),
			priceEl = contentEl.querySelector('.slide__price'),
			buyEl = contentEl.querySelector('.button--buy');


		classie.add(item, 'slide--close');

	
		classie.remove(bodyEl, 'noscroll');
		classie.remove(contentEl, 'scrollable');


		dynamics.stop(buyEl);
		dynamics.animate(buyEl, 
			{
				translateY : 400, opacity : 0
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000
			}
		);


		dynamics.stop(priceEl);
		dynamics.animate(priceEl, 
			{
				translateY : 400, opacity : 0
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000
			}
		);


		dynamics.stop(descriptionEl);
		dynamics.animate(descriptionEl, 
			{
				translateY : 400, opacity : 0
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000, delay: 100
			}
		);

	
		dynamics.stop(titleEl);
		dynamics.animate(titleEl, 
			{
				translateY : 600, opacity : 0
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000, delay: 200
			}
		);


		dynamics.animate(largeImgEl, 
			{
				translateY : 800, opacity : 0
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 500, delay: 300,
				complete: function() {
				
					classie.remove(item, 'slide--open');
				
					classie.remove(item, 'slide--close');
				
					classie.remove(bodyEl, 'lockscroll');
					self.isExpanded = false;
				}
			}
		);


		dynamics.animate(smallImgEl, 
			{
				translateY : 0, opacity : 1
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 700, delay: 500
			}
		);

	
		dynamics.animate(expanderEl, 
			{
				scaleX : 1, scaleY : 1
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.5,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.5,"y":1}]}], duration: 700, delay: 250
			}
		);
	};

	window.CircleSlideshow = CircleSlideshow;

})(window);

// ----수정------
(function() {

	const target = document.querySelector(".target");
	const links = document.querySelectorAll(".menu-box a");
	const colors = ["deepskyblue", "black", "darkblue"];
  
	function mouseenterFunc() {
	  if (!this.parentNode.classList.contains("active")) {
		for (let i = 0; i < links.length; i++) {
		  if (links[i].parentNode.classList.contains("active")) {
			links[i].parentNode.classList.remove("active");
		  }
		  links[i].style.opacity = "0.25";
		}
  
		this.parentNode.classList.add("active");
		this.style.opacity = "1";
  
		const width = this.getBoundingClientRect().width;
		const height = this.getBoundingClientRect().height;
		const left = this.getBoundingClientRect().left + window.pageXOffset;
		const top = this.getBoundingClientRect().top + window.pageYOffset;
		const color = colors[Math.floor(Math.random() * colors.length)];
  
		target.style.width = `${width}px`;
		target.style.height = `${height}px`;
		target.style.left = `${left}px`;
		target.style.top = `${top}px`;
		target.style.borderColor = color;
		target.style.transform = "none";
	  }
	}
  
	for (let i = 0; i < links.length; i++) {
	  links[i].addEventListener("click", (e) => e.preventDefault());
	  links[i].addEventListener("mouseenter", mouseenterFunc);
	}
  
	function resizeFunc() {
	  const active = document.querySelector(".menu-box li.active");
  
	  if (active) {
		const left = active.getBoundingClientRect().left + window.pageXOffset;
		const top = active.getBoundingClientRect().top + window.pageYOffset;
  
		target.style.left = `${left}px`;
		target.style.top = `${top}px`;
	  }
	}
  
	window.addEventListener("resize", resizeFunc);
  
  })();

  // ----수정------
