/* @required jQuery */

(function($, undefined) {

	/**
	 * Config presets.
	 * @private
	 */
	var defaults = {
		sugar: {
			namePrefix: '^[a-zA-Z0-9]{1,2}-',
			namePattern: '[a-zA-Z0-9-]+',
			elemPrefix: '__',
			modPrefix: '_',
			modDlmtr: '_'
		},
		
		config: {
			//
		}
	};


	/**
	 * BEM version.
	 * @private
	 */
	var version = '1.1.0-beta1';


	/**
	 * Syntax sugar.
	 * @private
	 */
	var sugar = {};


	/**
	 * Configuration.
	 * @private
	 */
	var config = {};


	/**
	 * Declarations for blocks.
	 * @private
	 */
	var decls = [];


	/* 
	 * Base BEM object.
	 * @namespace
	 */
	this.bem = {

		/**
		 * Init base class.
		 * @private
		 */
		init: function() {
			this.setConfig();
			return this;
		},


		/**
		 * Extender interface for modules.
		 * @protected
		 *
		 * @param  {String}  moduleName  Module namespace
		 * @param  {Object}  object      Module object
		 */
		extend: function(moduleName, object) {
			this[moduleName] = object;

			if (this[moduleName].init != undefined) {
				this[moduleName].init();
			}
		},


		/**
		 * Declarator for blocks.
		 * @protected
		 *
		 * @param  {String|Object}  $this      Nested selector
		 * @param  {Object}         props      Declaration
		 * @param  {Object}         scope      Scope
		 * @param  {Bool}           recursive  Recursive call
		 */
		decl: function(selector, props, scope, recursive) {
			var self = this,
				props = props || {},
				scope = props,
				recursive = recursive || false;

			if (!recursive) {
				decls.push({
					selector: selector,
					props: props
				});
			}

			var selector = typeof selector == 'object'?
				'.' + self._buildElemClass(selector.block, selector.elem) :
				'.' + selector

			$.each(props, function(key, fn) {
				if (typeof fn == 'function') {
					if (key.indexOf('on') == 0) {
						var e = key.replace(/^on/, '').toLowerCase();
						
						$(selector).each(function() {
							var $this = $(this), proxy = $.proxy(fn, scope, $this);
							
							$this
								.off(e).on(e, proxy)
								.trigger('ready');
						});
					}
				}
				else if (typeof fn == 'object') {
					var key = key.replace(/[A-Z]/g, '-$&').toLowerCase();
					var block = self._getBlockClass(selector);
					var elem = self._buildElemClass(block, key);
					
					self.decl(elem, fn, scope, 'recursive');
				}
			});
		},


		/**
		 * Reload all declarations.
		 * @protected
		 */
		reload: function() {
			var self = this, _decls = decls;
			decls = [];

			$.each(_decls, function(i, decl) {
				self.decl(decl.selector, decl.props);
			});
		},


		/**
		 * Set base config.
		 * @protected
		 *
		 * @param  {Object}  [_sugar]   Syntax sugar
		 * @param  {Object}  [_config]  Configuration
		 */
		setConfig: function(_sugar, _config, _decls) {
			var _sugar = _sugar || {},
				_config = _config || {}

			sugar = $.extend(defaults.sugar, _sugar);
			config = $.extend(defaults.config, _config);
		},


		/**
		 * Return parent block of element.
		 * @protected
		 *
		 * @param  {Object}  $this  Nested element
		 * @return {Object}
		 */
		parentBlock: function($this) {
			var blockClasses = this._extractBlocks($this);
			return $this.closest('.' + blockClasses[0]);
		},


		/**
		 * Find element in block.
		 * @protected
		 *
		 * @param  {Object}  $this    Block element
		 * @param  {String}  elemKey  Element name
		 * @return {Object}
		 */
		findElem: function($this, elemKey) {
			var blockName = this._getBlockClass($this),
				elemName = this._buildElemClass(blockName, elemKey);

			return $this.find('.' + elemName);
		},


		/**
		 * Get value of modifer.
		 * @protected
		 *
		 * @param  {Object}  $this   Nested element
		 * @param  {String}  modKey  Modifer key
		 * @return {String}
		 */
		getMod: function($this, modKey) {
			var mods = this._extractMods($this);
			
			if (mods[modKey] != undefined) return mods[modKey];
			return null;
		},


		/**
		 * Check modifer of element.
		 * @protected
		 *
		 * @param  {Object}  $this     Nested element
		 * @param  {String}  modKey    Modifer key
		 * @param  {String}  [modVal]  Modifer value
		 * @return {Bool}
		 */
		hasMod: function($this, modKey, modVal) {
			var mods = this._extractMods($this),
				modVal = modVal || null;

			if (modVal) {
				if (mods[modKey] == modVal) return true;
			}
			else {
				if (mods[modKey] != undefined) return true;
			}

			return false;
		},


		/**
		 * Set modifer on element.
		 * @protected
		 *
		 * @param  {Object}  $this     Nested element
		 * @param  {String}  modKey    Modifer key
		 * @param  {String}  [modVal]  Modifer value
		 * @param  {Object}
		 */
		setMod: function($this, modKey, modVal) {
			var mods = this._extractMods($this),
				baseName = this._getBaseClass($this),
				modVal = modVal || 'yes';

			if (mods[modKey] != undefined) {
				var oldModName = this._buildModClass(baseName, modKey, mods[modKey]);
				$this.removeClass(oldModName);
			}

			var newModName = this._buildModClass(baseName, modKey, modVal);
			$this.addClass(newModName);

			return $this;
		},


		/**
		 * Delete modifer on element.
		 * @protected
		 *
		 * @param  {Object}  $this     Nested element
		 * @param  {String}  modKey    Modifer key
		 * @param  {String}  [modVal]  Modifer value
		 * @param  {Object}
		 */
		delMod: function($this, modKey, modVal) {
			var modVal = modVal || null,
				mods = this._extractMods($this),
				baseName = this._getBaseClass($this);

			if (modVal) {
				if (mods[modKey] == modVal) {
					var modName = this._buildModClass(baseName, modKey, mods[modKey]);
					$this.removeClass(modName);
				}
			}
			else {
				if (mods[modKey] != undefined) {
					var modName = this._buildModClass(baseName, modKey, mods[modKey]);
					$this.removeClass(modName);
				}
			}

			return $this;
		},


		/**
		 * Filtering elements by modifer.
		 * @prodtected
		 *
		 * @param  {Object}  $this      Nested element
		 * @param  {String}  modKey     Modifer key
		 * @param  {String}  [modVal]   Modifer value
		 * @param  {Bool}    [inverse]  Use .not() instead .filter()
		 * @param  {Object}
		 */
		byMod: function($this, modKey, modVal, inverse) {
			var modVal = modVal || null,
				inverse = inverse || false,
				mods = this._extractMods($this),
				baseName = this._getBaseClass($this);

			if (modVal) {
				if (mods[modKey] == modVal) {
					var modName = this._buildModClass(baseName, modKey, mods[modKey]);
				}
			}
			else {
				if (mods[modKey] != undefined) {
					var modName = this._buildModClass(baseName, modKey, mods[modKey]);
				}
			}

			return inverse?
				$this.not('.' + modName) :
				$this.filter('.' + modName);
		},


		/**
		 * Get block names from element.
		 * @protected
		 *
		 * @param  {Object|String}  $this  Nested element
		 * @return {Object}
		 */
		_extractBlocks: function($this) {
			var self = this, result = [];
			var selectors = this._getClasses($this);
			
			$.each(selectors, function(i, sel) {
				var type = self._getClassType(sel);

				if (type == 'block') {
					result.push(sel);
				}
				else if (type == 'elem') {
					var elem = sel.split(sugar.elemPrefix);
					result.push(elem[0]);
				}
			});

			return result;
		},


		/**
		 * Get element names from element.
		 * @protected
		 *
		 * @param  {Object}  $this  Nested element
		 * @return {Object}
		 */
		_extractElems: function($this) {
			return [];
		},


		/**
		 * Get modifers from element.
		 * @protected
		 *
		 * @param  {Object}  $this  Nested element
		 * @return {Object}
		 */
		_extractMods: function($this) {
			var self = this, result = {};

			$this.each(function() {
				var $this = $(this);
				
				$.each(self._getClasses($this), function(i, className) {
					if (self._getClassType(className) == 'mod') {
						var re = self._buildModClassRe().exec(className);
						var modName = re[1].split(sugar.modDlmtr);

						result[ modName[0] ] = modName[1];
					}
				});
			});
			
			return result;
		},


		/**
		 * Get classes names from element.
		 * @protected
		 *
		 * @param  {Object}  $this  Nested element
		 * @return {Object}
		 */
		_getClasses: function($this) {
			var classes, result = [];

			if (typeof $this == 'object') {
				if ($this.attr('class') != undefined) {
					classes = $this.attr('class').split(' ');
				}
				else {
					return null;
				}
			}
			else {
				classes = $this.split('.');
			}
			
			$.each(classes, function(i, className) {
				if (className != '') result.push(className);
			});
			
			return result;
		},


		/**
		 * Build regexp for blocks.
		 * @protected
		 *
		 * @return {RegExp}
		 */
		_buildBlockClassRe: function() {
			return new RegExp(
				sugar.namePrefix + '(' + sugar.namePattern + ')$'
			);
		},


		/**
		 * Build regexp for elements.
		 * @protected
		 *
		 * @return {RegExp}
		 */
		_buildElemClassRe: function() {
			return new RegExp(
				sugar.namePrefix + sugar.namePattern + sugar.elemPrefix + '(' + sugar.namePattern + ')$'
			);
		},


		/**
		 * Build regexp for modifers.
		 * @protected
		 *
		 * @return {RegExp}
		 */
		_buildModClassRe: function() {
			return new RegExp(
				sugar.namePrefix + '.*' + sugar.modPrefix + '(' + sugar.namePattern + sugar.modDlmtr + sugar.namePattern + ')$'
			);
		},


		/**
		 * Build class name for block.
		 * @protected
		 *
		 * @param  {String}  blockName  Block name
		 * @return {String}
		 */
		_buildBlockClass: function(blockName) {
			return blockName;
		},


		/**
		 * Build class name for element.
		 * @protected
		 *
		 * @param  {String}  blockName  Block name
		 * @param  {String}  elemKey    Element name
		 * @return {String}
		 */
		_buildElemClass: function(blockName, elemKey) {
			return blockName + sugar.elemPrefix + elemKey;
		},


		/**
		 * Build class name for modifer.
		 * @protected
		 *
		 * @param  {String}  blockName  Block name
		 * @param  {String}  modKey     Modifer key
		 * @param  {String}  modVal     Modifer value
		 * @return {String}
		 */
		_buildModClass: function(baseClass, modKey, modVal) {
			return baseClass + sugar.modPrefix + modKey + sugar.modDlmtr + modVal;
		},


		/**
		 * Build class name for block.
		 * @protected
		 *
		 * @param  {Object|String}  $this  Nested element
		 * @return {String}
		 */
		_getBlockClass: function($this) {
			var blockClasses = this._extractBlocks($this);
			return blockClasses[0];
		},


		/**
		 * Get base class from element.
		 * @protected
		 *
		 * @param  {Object}  $this  Nested element
		 * @return {String}
		 */
		_getBaseClass: function($this) {
			var self = this, baseClass = null;
			var selectors = this._getClasses($this);

			$.each(selectors, function(i, sel) {
				var classType = self._getClassType(sel);

				if (classType && classType != 'mod') {
					baseClass = sel;
				}
			});

			return baseClass;
		},


		/**
		 * Get class type.
		 * @protected
		 *
		 * @param  {String}  className  Class name
		 * @return {String}
		 */
		_getClassType: function(className) {

			if (this._buildModClassRe().test(className)) {
				return 'mod';
			}
			
			else if (this._buildElemClassRe().test(className)) {
				return 'elem';
			}
			
			else if (this._buildBlockClassRe().test(className)) {
				return 'block';
			}

			return null;
		}

	};

	bem.init();
	
})(jQuery, undefined);



(function($, undefined) {

	$.fn.up = function() {
		return bem.parentBlock( $(this));
	}

	$.fn.elem = function(elemKey) {
		return bem.findElem( $(this), elemKey);
	}

	$.fn.getMod = function(modKey) {
		return bem.getMod( $(this), modKey);
	}

	$.fn.hasMod = function(modKey, modVal) {
		return bem.hasMod( $(this), modKey, modVal);
	}

	$.fn.setMod = function(modKey, modVal) {
		return bem.setMod( $(this), modKey, modVal);
	}

	$.fn.delMod = function(modKey, modVal) {
		return bem.delMod( $(this), modKey, modVal);
	}

	$.fn.byMod = function(modKey, modVal) {
		return bem.byMod( $(this), modKey, modVal);
	}

	$.fn.byNotMod = function(modKey, modVal) {
		return bem.byMod( $(this), modKey, modVal, 'inverse');
	}

})(jQuery, undefined);