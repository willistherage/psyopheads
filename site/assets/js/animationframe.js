var AnimationFrame = function() {

	var af = {

		//----------------------------------------
		// Variables
		//----------------------------------------

		listeners: [],

		//----------------------------------------
		// Public Methods
		//----------------------------------------

		addListener: function(callback) {
			
			var runFrame = false;

			if(this.listeners.length < 1)
			{
				runFrame = true;
			}

			if(this.listeners.indexOf(callback) > -1)
			{
				return;
			}

			this.listeners.push(callback);

			if(runFrame)
			{
				this.onAnimationFrame();
			}
		},

		removeListener: function(callback) {

			var index = this.listeners.indexOf(callback);

			if(index > -1)
			{
				this.listeners.splice(index, 1);
			}
		},

		init: function () {

			_.bindAll(this, 'addListener', 'removeListener', 'onAnimationFrame');

		},


		//----------------------------------------
		// Event Handlers
		//----------------------------------------

		onAnimationFrame: function() {

			var l = this.listeners.length;

			for(var i = 0; i < l; i++)
			{
				this.listeners[i]();
			}

			if(l)
			{
				requestAnimationFrame(this.onAnimationFrame);
			}
		}

	};

	af.init();

	return af;
}