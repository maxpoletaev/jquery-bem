/* @required jQuery */

(function($, undefined) {

	/**
	 * Config presets.
	 * @private
	 */
	var defaults = {
		sugar:
		{
			blockPrefix: ['b-', 'w-', 'l-', 'g-', 'i-'],
			elementPrefix: '__',
			modPrefix: ':',
			modDlmtr: '_'
		},
		
		config:
		{
			//
		}
	};


	/**
	 * BEM version.
	 * @private
	 */
	var version = '1.0.0-rc2';


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
	var decls = {};


	/* 
	 * Base BEM object.
	 * @namespace
	 */
	this.bem = {

		/**
		 * Init base class.
		 * @private
		 */
		init: function()
		{
			this.setConfig();
			return this;
		},


		/**
		 * Extend interface for modules.
		 * @protected
		 *
		 * @param  {String}  moduleName  Module namespace
		 * @param  {Object}  object      Module object
		 */
		extend: function(moduleName, object)
		{
			this[moduleName] = object;
			
			if (this[moduleName].init !== undefined)
			{
				this[moduleName].init();
			}
		},


		/**
		 * Declarator for blocks.
		 * @protected
		 *
		 * @param  {Object}  $this  Nested object
		 * @param  {Object}  props  Declaration
		 * @param  {Object}  scope  Scope
		 */
		decl: function($this, props, scope)
		{
			var me = this;
			var props = props || {}
			var scope = props;

			$.each(props, function(key, fn)
			{
				if (typeof fn === 'function')
				{
					if (key.indexOf('on') == 0)
					{
						var event = key.replace(/^on/, '').toLowerCase();
						
						if ($this.length === 0)
						{
							var proxy = $.proxy(fn, scope, $( $this.selector ));
							$(document).on(event, $this.selector, proxy);
						}
						else
						{
							$this.each(function() {
								var proxy = $.proxy(fn, scope, $(this));
								$(this).bind(event, proxy);
							});
						}
					}
				}

				else if (typeof fn == 'object')
				{
					if (key == 'onSetMod')
					{
						// @TODO:
						// onSetMod: { 'key': function(), 'key2' : { 'value': function() } }
					}

					else
					{
						var key = key.replace(/[A-Z]/g, '-$&').toLowerCase();
						var element = $this.findElement(key);

						me.decl(element, fn, scope);
					}
				}
			});

			$this.trigger('ready');

			return $this;
		},


		/**
		 * Set base config.
		 * @protected
		 *
		 * @param  {Object}  [_sugar]   Syntax sugar
		 * @param  {Object}  [_config]  Configuration
		 */
		setConfig: function(_sugar, _config)
		{
			var _sugar = _sugar || {};
			var _config = _config || {}

			sugar = $.extend(defaults.sugar, _sugar);
			config = $.extend(defaults.config, _config);
		},


		/**
		 * Get modifers of elements.
		 * @protected
		 *
		 * @param  {Object}  $this  Nested element
		 * @return {Array}
		 */
		getMods: function($this)
		{
			var mods = {};
			var rawClass = $this.attr('class');

			if (rawClass !== undefined)
			{
				var classes = rawClass.split(' ');

				$.each(classes, function(index, classname)
				{
					if (classname.indexOf(sugar.modPrefix) == 0)
					{
						var cleanClassname = classname.replace(sugar.modPrefix, '');
						var mod = cleanClassname.split(sugar.modDlmtr);

						mods[ mod[0] ] = mod[1];
					}
				});
			}

			return mods;
		},


		/**
		 * Set modifer on element.
		 * @protected
		 *
		 * @param  {Object}  $this     Nested element
		 * @param  {String}  modKey    Modifer name
		 * @param  {String}  [modVal]  Modifer value
		 * @return {Object}
		 */
		setMod: function($this, modKey, modVal)
		{
			var mods = this.getMods($this);
			var modVal = modVal || false;

			if (modVal)
			{
				if (mods[modKey] !== undefined)
				{
					var oldMod = this._genModClassName(modKey, mods[modKey]);
					$this.removeClass(oldMod);
				}

				var newMod = this._genModClassName(modKey, modVal);
				$this.addClass(newMod);
			}

			$this.trigger('setmod', [ modKey, modVal ]);
			return $this;
		},


		/**
		 * Delete modifer on element.
		 * @protected
		 *
		 * @param  {Object}  $this     Nested element
		 * @param  {String}  modKey    Modifer name
		 * @param  {String}  [modVal]  Modifer value
		 * @return {Object}
		 */
		delMod: function($this, modKey, modVal)
		{
			var self = this;
			var modVal = modVal || false;

			$this.each(function()
			{
				var item = $(this);
				var mods = item.getMods(this);

				if (modVal)
				{
					var modName = self._genModClassName(modKey, modVal);
					item.removeClass(modName);
				}
				else
				{
					if (mods[modKey] !== undefined)
					{
						var modName = self._genModClassName(modKey, mods[modKey]);
						item.removeClass(modName);
					}
				}

				$this.trigger('delmod', [ modKey, modVal ]);
			});

			return $this;
		},


		/**
		 * Get modifer value on element.
		 * @protected
		 *
		 * @param  {Object}  $this     Nested element
		 * @param  {String}  modKey    Modifer name
		 * @return {String|Bool}
		 */
		getMod: function($this, modKey)
		{
			var mods = this.getMods($this);

			if (mods[modKey] !== undefined)
			{
				return mods[modKey];
			}

			return false;
		},


		/**
		 * Check modifer on element.
		 * @protected
		 *
		 * @param  {Object}  $this     Nested element
		 * @param  {String}  modKey    Modifer name
		 * @param  {String}  [modVal]  Modifer value
		 * @return {Bool}
		 */
		hasMod: function($this, modKey, modVal)
		{
			var mods = this.getMods($this);
			var modVal = modVal || false;

			if (modVal)
			{
				if (mods[modKey] == modVal) return true;
			}
			
			else
			{
				if (mods[modKey] !== undefined) return true;
			}

			return false;
		},


		/**
		 * Filtering element or block by modifer.
		 * @protected
		 * 
		 * @param  {Object}  $this   Nested object
		 * @param  {String}  modKey  Modifer name
		 * @param  {String}  modVal  Modifer value
		 * @return {Object}
		 */
		byMod: function($this, modKey, modVal)
		{
			var mods = this.getMods($this);
			var modVal = modVal || mods[modKey];
			
			var modName = this._genModClassName(modKey, modVal);

			return $this.filter('.\\' + modName);
		},


		/**
		 * Filtering element or blocks by not modifer.
		 * @protected
		 * 
		 * @param  {Object}  $this   Nested object
		 * @param  {String}  modKey  Modifer name
		 * @param  {String}  modVal  Modifer value
		 * @return {Object}
		 */
		byNotMod: function($this, modKey, modVal)
		{
			var mods = this.getMods($this);
			var modVal = modVal || mods[modKey];

			var modName = this._genModClassName(modKey, modVal);
			
			return $this.not('.\\' + modName);
		},


		/**
		 * Get block name from element or block.
		 * @protected
		 *
		 * @param  {Object}  $this  Nested element
		 * @return {String|Bool}
		 */
		getBlockName: function($this)
		{
			var blockName = [];
			var rawClass = $this.attr('class');

			if (this._selectorIsBlock($this.selector))
			{
				return $this.selector.replace(/^\./, '');
			}

			if (rawClass !== undefined)
			{
				var classes = rawClass.split(' ');

				$.each(rawClass.split(' '), function(index, className)
				{
					$.each(sugar.blockPrefix, function(index, prefix)
					{
						if (className.indexOf(prefix) == 0)
						{
							var parts = className.split(sugar.elementPrefix);
							blockName.push(parts[0]);
						}
					});
				});
			}

			return blockName;
		},


		/**
		 * Get parent block from element.
		 * @protected
		 *
		 * @param  {Object}  $this  Nested Element
		 * @return {Object|Bool}
		 */
		getParentBlock: function($this)
		{
			var blockName = this.getBlockName($this);
			
			var blockName = typeof blockName === 'object'?
				blockName[blockName.length - 1] :
				blockName

			if (blockName)
			{
				 return $this.closest('.' + blockName);
			}

			return false;
		},


		/**
		 * Get element name from block.
		 * @protected
		 *
		 * @param  {Object}  $this        Nested element
		 * @param  {String}  elementKey   Element name
		 * @return {String|Bool}
		 */
		getElementName: function($this, elementKey)
		{
			var blockName = this.getBlockName($this);

			var blockName = typeof blockName === 'object'?
				blockName[blockName.length - 1] :
				blockName

			if (blockName)
			{
				return this._genElementClassName(blockName, elementKey);
			}
			
			return false;
		},


		/**
		 * Get child element object from block or other element.
		 * @protected
		 *
		 * @param  {Object}  $this        Nested element
		 * @param  {Object}  elementName  Element name
		 * @return {Object|Bool}
		 */
		getChildElement: function($this, elementKey)
		{
			var elementName = this.getElementName($this, elementKey);

			if (elementName !== undefined)
			{
				return $this.find('.' + elementName);
			}

			return false;
		},


		/**
		 * Get parent element object from block or other element.
		 * @protected
		 *
		 * @param  {Object}  $this        Nested element
		 * @param  {Object}  elementName  Element name
		 * @return {Object|Bool}
		 */
		getParentElement: function($this, elementKey)
		{
			var elementName = this.getElementName($this, elementKey);

			if (elementName !== undefined)
			{
				return $this.closest('.' + elementName);
			}

			return false;
		},


		/**
		 * Get siblings element.
		 * @protected
		 *
		 * @param  {Object}  $this        Nested element
		 * @param  {Object}  elementName  Element name
		 * @return {Object|Bool}
		 */
		getSiblingsElement: function($this, elementKey)
		{
			var elementName = this.getElementName($this, elementKey);

			if (elementName !== undefined)
			{
				return $this.siblings('.' + elementName).not($this);
			}

			return false;
		},


		/**
		 * Generate modifer classname.
		 * @private
		 *
		 * @param  {String}  modKey  Modifer key
		 * @param  {String}  modVal  Modifer value
		 * @return {String}
		 */
		_genModClassName: function(modKey, modVal)
		{
			return sugar.modPrefix + modKey + sugar.modDlmtr + modVal;
		},

		
		/**
		 * Generate element class name.
		 * @private
		 *
		 * @param  {String}  blockName   Block name
		 * @param  {String}  elementKey  Element name
		 * @return {String}
		 */
		_genElementClassName: function(blockName, elementKey)
		{
			return blockName + sugar.elementPrefix + elementKey;
		},


		/**
		 * Check selector is block.
		 * @private
		 *
		 * @param  {String}  Selector
		 * @return {Bool}
		 */
		_selectorIsBlock: function(selector)
		{
			var result = false;

			$.each(sugar.blockPrefix, function(index, prefix)
			{
				var re = new RegExp('^\.' + prefix, 'g');
				
				if (re.test(selector)
					&& selector.indexOf(sugar.elementPrefix) == -1
					&& selector.indexOf(sugar.modPrefix) == -1)
				{
					result = true;
					return false;
				}
			});

			return result;
		}

	};

	bem.init();
	
})(jQuery, undefined);



(function($, undefined)
{

	$.fn.decl = function(props)
	{
		return bem.decl(this, props);
	}

	$.fn.setMod = function(key, value)
	{
		return bem.setMod(this, key, value);
	}

	$.fn.delMod = function(key, value)
	{
		return bem.delMod(this, key, value);
	}

	$.fn.getMods = function()
	{
		return bem.getMods(this);
	}

	$.fn.getMod = function(key)
	{
		return bem.getMod(this, key);
	}

	$.fn.hasMod = function(key, value)
	{
		return bem.hasMod(this, key, value);
	}

	$.fn.byMod = function(key, value)
	{
		return bem.byMod(this, key, value);
	}

	$.fn.byNotMod = function(key, value)
	{
		return bem.byNotMod(this, key, value);
	}

	$.fn.getBlock = function()
	{
		return bem.getParentBlock(this);
	}

	$.fn.parentElement = function(elementKey)
	{
		return bem.getParentElement(this, elementKey);
	}

	$.fn.findElement = function(elementKey)
	{
		return bem.getChildElement(this, elementKey);
	}

	$.fn.siblingsElement = function(elementKey)
	{
		return bem.getSiblingsElement(this, elementKey);
	}

})(jQuery, undefined);