var THREEx = THREEx || {}

/**
 * - possible to make the ReticleDisplay.js elsewhere
 * - thus the logic is separated from the style
 *
 * @class
 */
THREEx.Reticle = function(){
	var _this = this;
	
	this.signals = {
		click : new Signals.Signal(),
		hoverStart : new Signals.Signal(),
		hoverProgress : new Signals.Signal(),
		hoverStop : new Signals.Signal(),
	}
	
	this.hoverDuration = 0.5;
	this.objects = []
	var hoverStartedAt = null

	//////////////////////////////////////////////////////////////////////////////
	//		Handle hover/click state automata
	//////////////////////////////////////////////////////////////////////////////
	this.update = function(){
		var mouse = new THREE.Vector2(0,0)
		// find intersections
		var raycaster = new THREE.Raycaster();
		raycaster.setFromCamera( mouse, camera );
		var intersects = raycaster.intersectObjects( _this.objects );
		var intersecting = intersects.length > 0 ? true : false
		var intersectingMesh = intersects.length > 0 ? intersects[0].object : null
		// console.log('intersecting', intersecting)
		
		
		// start hovering if needed
		if( intersecting === true ){
			if( hoverStartedAt === null ){
				hoverStartedAt = Date.now()/1000;
				_this.signals.hoverStart.dispatch()
				_this.signals.hoverProgress.dispatch(0.0)
			}
		}

		// stop hovering if needed
		if( intersecting === false ){
		 	if( hoverStartedAt !== null ){
				hoverStartedAt = null
				_this.signals.hoverStop.dispatch()
			}
		}

		if( hoverStartedAt !== null ){
			var hoverSince = Date.now()/1000 - hoverStartedAt;

			
			if( hoverSince >= _this.hoverDuration ){
				hoverStartedAt = null
				_this.signals.hoverProgress.dispatch(1.0)
				_this.signals.hoverStop.dispatch()
				_this.signals.click.dispatch(intersectingMesh)
			}else{
				_this.signals.hoverProgress.dispatch( hoverSince / _this.hoverDuration )				
			}
		}
	}
}