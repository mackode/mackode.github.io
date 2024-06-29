(function ($) {
	var panelTriggers = document.getElementsByClassName('js-cd-panel-trigger');
	if (panelTriggers.length > 0) {
		for (var i = 0; i < panelTriggers.length; i++) {
			(function (i) {
				var panelClass = 'js-cd-panel-' + panelTriggers[i].getAttribute('data-panel'),
					panel = document.getElementsByClassName(panelClass)[0];
				panelTriggers[i].addEventListener('click', function (event) {
					event.preventDefault();
					addClass(panel, 'cd-panel--is-visible');
				});
				panel.addEventListener('click', function (event) {
					if (hasClass(event.target, 'js-cd-close') || hasClass(event.target, panelClass)) {
						event.preventDefault();
						removeClass(panel, 'cd-panel--is-visible');
					}
				});
			})(i);
		}
	}

	function hasClass(el, className) {
		if (el.classList) return el.classList.contains(className);
		else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	}

	function addClass(el, className) {
		if (el.classList) el.classList.add(className);
		else if (!hasClass(el, className)) el.className += " " + className;
	}

	function removeClass(el, className) {
		if (el.classList) el.classList.remove(className);
		else if (hasClass(el, className)) {
			var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
			el.className = el.className.replace(reg, ' ');
		}
	}

	function validateForm() {
		var name = document.forms["myForm"]["name"];
		var email = document.forms["myForm"]["email"];
		var message = document.forms["myForm"]["message"];

		if (name.value == "") {
			document.getElementById('errorname').innerHTML = "Please enter a valid name";
			name.focus();
			return false;
		} else {
			document.getElementById('errorname').innerHTML = "";
		}

		if (email.value == "") {
			document.getElementById('erroremail').innerHTML = "Please enter a valid email address";
			email.focus();
			return false;
		} else {
			document.getElementById('erroremail').innerHTML = "";
		}

		if (email.value.indexOf("@", 0) < 0) {
			document.getElementById('erroremail').innerHTML = "Please enter a valid email address";
			email.focus();
			return false;
		}

		if (email.value.indexOf(".", 0) < 0) {
			document.getElementById('erroremail').innerHTML = "Please enter a valid email address";
			email.focus();
			return false;
		}

		if (message.value == "") {
			document.getElementById('errormsg').innerHTML = "Please enter a valid message";
			message.focus();
			return false;
		} else {
			document.getElementById('errormsg').innerHTML = "";
		}

		return true;
	}

	$.fn.countTo = function (options) {
		options = options || {};

		return $(this).each(function () {
			var settings = $.extend({}, $.fn.countTo.defaults, {
				from: $(this).data('from'),
				to: $(this).data('to'),
				speed: $(this).data('speed'),
				refreshInterval: $(this).data('refresh-interval'),
				decimals: $(this).data('decimals')
			}, options);

			var loops = Math.ceil(settings.speed / settings.refreshInterval),
				increment = (settings.to - settings.from) / loops;

			var self = this,
				$self = $(this),
				loopCount = 0,
				value = settings.from,
				data = $self.data('countTo') || {};

			$self.data('countTo', data);

			if (data.interval) {
				clearInterval(data.interval);
			}
			data.interval = setInterval(updateTimer, settings.refreshInterval);

			render(value);

			function updateTimer() {
				value += increment;
				loopCount++;

				render(value);

				if (typeof (settings.onUpdate) == 'function') {
					settings.onUpdate.call(self, value);
				}

				if (loopCount >= loops) {
					$self.removeData('countTo');
					clearInterval(data.interval);
					value = settings.to;

					if (typeof (settings.onComplete) == 'function') {
						settings.onComplete.call(self, value);
					}
				}
			}

			function render(value) {
				var formattedValue = settings.formatter.call(self, value, settings);
				$self.html(formattedValue);
			}
		});
	};

	$.fn.countTo.defaults = {
		from: 0,               // the number the element should start at
		to: 0,                 // the number the element should end at
		speed: 1000,           // how long it should take to count between the target numbers
		refreshInterval: 100,  // how often the element should be updated
		decimals: 0,           // the number of decimal places to show
		formatter: formatter,  // handler for formatting the value before rendering
		onUpdate: null,        // callback method for every time the element is updated
		onComplete: null       // callback method for when the element finishes updating
	};

	function formatter(value, settings) {
		return value.toFixed(settings.decimals);
	}
}(jQuery));

jQuery(function ($) {
	$('.count-number').data('countToOptions', {
		formatter: function (value, options) {
			return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
		}
	});

	$('.js-cd-panel-trigger').click(function () {
		$('.timer').each(count);
	});

	function count(options) {
		var $this = $(this);
		options = $.extend({}, options || {}, $this.data('countToOptions') || {});
		$this.countTo(options);
	}
});
