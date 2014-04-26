/* @required jQuery */

(function($, undefined) {

  /**
   * Base BEM class.
   * @constructor
   */
  var BEM = function(config) {

    /**
     * Default configuration.
     * @type {Object}
     */
    this.config = config || {};

    /**
     * Pugin version.
     * @type {String}
     */
    this.version = '1.3.0';

  };

  /**
   * @extends BEM
   */
  BEM.prototype = {

    /**
     * Get parent block of element or
     * get siblings of element.
     * @public
     *
     * @param {Object} $this
     * @param {String} elem
     * @return {Object}
     */
    getBlock: function($this, elem) {
      var elem = elem || null
        , blockClass = this._getBlockClass($this)
        , block = $this.closest('.' + blockClass);

      block.selector = blockClass;

      if (elem) {
        return block.elem(elem);
      }

      return block;
    },

    /**
     * Switch block context.
     * @public
     *
     * @param {Object} $this
     * @param {String} block
     * @param {String} [elem]
     * @return {Object}
     */
    switchBlock: function($this, block, elem) {
      var elem = elem || null;

      elem
        ? $this.selector = this._buildSelector({ block: block, elem: elem })
        : $this.selector = this._buildSelector({ block: block });

      return $this;
    },

    /**
     * Find element in block.
     * @public
     *
     * @param  {Object}  $this    DOM element
     * @param  {String}  elemKey  Element name
     * @return {Object}
     */
    findElem: function($this, elemKey) {
      var blockClass = this._getBlockClass($this)
        , elemName = this._buildElemClass(blockClass, elemKey)
        , elem = $this.find('.' + elemName);

      return elem;
    },

    /**
     * Get value of modifier.
     * @public
     *
     * @param {Object} $this
     * @param {String} modKey
     * @return {String}
     */
    getMod: function($this, modKey) {
      var mods = this._extractMods($this.first());

      if (mods[modKey] != undefined) return mods[modKey];
      return null;
    },

    /**
     * Check modifier of element.
     * @public
     *
     * @param {Object} $this
     * @param {String} modKey
     * @param {String} [modVal]
     * @return {Boolean}
     */
    hasMod: function($this, modKey, modVal) {
      var mods = this._extractMods($this.first());

      if (modVal) {
        if (mods[modKey] == modVal) return true;
      }
      else {
        if (mods[modKey]) return true;
      }

      return false;
    },

    /**
     * Set modifier on element.
     * @public
     *
     * @param {Object} $this
     * @param {String} modKey
     * @param {String} [modVal]
     * @param {Object}
     */
    setMod: function($this, modKey, modVal) {
      var self = this
        , selector = $this.selector;

      $this.each(function() {
        var current = $(this);
        current.selector = selector;

        var mods = self._extractMods(current)
          , baseName = self._getBaseClass(current);

        if (mods[modKey] != undefined) {
          var oldModName = self._buildModClass(baseName, modKey, mods[modKey]);
          current.removeClass(oldModName);
        }

        if (modVal !== false) {
          var newModName = self._buildModClass(baseName, modKey, modVal);
        }

        current
          .addClass(newModName)
          .trigger('setmod', [modKey, modVal]);
      });

      return $this;
    },

    /**
     * Delete modifier on element.
     * @public
     *
     * @param {Object} $this
     * @param {String} modKey
     * @param {String} [modVal]
     * @param {Object}
     */
    delMod: function($this, modKey, modVal) {
      var self = this
        , selector = $this.selector;

      $this.each(function() {
        var current = $(this);
        current.selector = selector;

        var mods = self._extractMods(current)
          , baseName = self._getBaseClass(current);

        if (modVal) {
          if (mods[modKey] == modVal) {
            var modName = self._buildModClass(baseName, modKey, mods[modKey]);
          }
        }
        else {
          var modName = self._buildModClass(baseName, modKey, mods[modKey]);
        }

        current
          .removeClass(modName)
          .trigger('delmod', [modKey, modVal]);
      });

      return $this;
    },

    /**
     * Filtering elements by modifier.
     * @public
     *
     * @param {Object} $this
     * @param {String} modKey
     * @param {String} [modVal]
     * @param {Boolean} [inverse]
     * @return {Object}
     */
    byMod: function($this, modKey, modVal, inverse) {
      var self = this
        , modVal = modVal || null
        , inverse = inverse || false
        , selector = $this.selector
        , result = $();

      $this.each(function() {
        var current = $(this);
        current.selector = selector;

        var mods = self._extractMods(current)
          , baseName = self._getBaseClass(current);

        if (modVal) {
          if (mods[modKey] == modVal) {
            var modName = self._buildModClass(baseName, modKey, mods[modKey]);
          }
        }
        else {
          if (mods[modKey] != undefined) {
            var modName = self._buildModClass(baseName, modKey, mods[modKey]);
          }
        }

        result = result.add(inverse
          ? current.not('.' + modName)
          : current.filter('.' + modName));
      });

      result.selector = selector;
      return result;
    },

    /**
     * Get block names from element.
     * @protected
     *
     * @param {Object|String} $this
     * @return {Object}
     */
    _extractBlocks: function($this) {
      var self = this, result = []
        , selectors = this._getClasses($this);

      $.each(selectors, function(i, sel) {
        var type = self._getClassType(sel);

        if (type == 'block') {
          result.push(sel);
        }
        else if (type == 'elem') {
          var elem = sel.split(self.config.elemPrefix);
          result.push(elem[0]);
        }
      });

      return result;
    },

    /**
     * Get element names from element.
     * @protected
     *
     * @param {Object} $this
     * @return {Object}
     */
    _extractElems: function($this) {
      var self = this, result = [];

      $.each(self._getClasses($this), function(i, className) {
        if (self._getClassType(className) == 'elem') {
          var elemName = className.split(self.config.elemPrefix);
          result.push(elemName[1]);
        }
      });

      return result;
    },

    /**
     * Get modifiers from element.
     * @protected
     *
     * @param {Object} $this
     * @return {Object}
     */
    _extractMods: function($this) {
      var self = this, result = {};

      $this.each(function() {
        var $this = $(this);

        $.each(self._getClasses($this), function(i, className) {
          if (self._getClassType(className) == 'mod') {
            var re = self._buildModClassRe().exec(className);
            var modName = re[1].split(self.config.modDlmtr);

            if (modName[1] !== undefined && modName[1] !== false) {
              var modVal = modName[1];
            } else {
              var modVal = true;
            }

            result[ modName[0] ] = modVal;
          }
        });
      });

      return result;
    },

    /**
     * Get classes names from element.
     * @protected
     *
     * @param {Object} $this
     * @return {Object}
     */
    _getClasses: function($this) {
      var classes, result = [];

      if (typeof $this == 'object') {

        if ($this.selector.indexOf('.') === 0) {
          classes = $this.selector.split('.');
        }
        else if ($this.attr('class') != undefined) {
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
        if (className != '') result.push($.trim(className));
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
        '^(' + this.config.namePattern + ')$'
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
        '^' + this.config.namePattern + this.config.elemPrefix + '(' + this.config.namePattern + ')$'
      );
    },

    /**
     * Build regexp for modifiers.
     * @protected
     *
     * @return {RegExp}
     */
    _buildModClassRe: function() {
      return new RegExp(
        '^(?:' + this.config.namePattern + '|' + this.config.namePattern + this.config.elemPrefix + this.config.namePattern + ')' + this.config.modPrefix + '(' + this.config.namePattern + '((' + this.config.modDlmtr + this.config.namePattern + ')$|$))'
      );
    },

    /**
     * Build class name for block.
     * @protected
     *
     * @param {String} blockName
     * @return {String}
     */
    _buildBlockClass: function(blockName) {
      return blockName;
    },

    /**
     * Build class name for element.
     * @protected
     *
     * @param {String} blockName
     * @param {String} elemKey
     * @return {String}
     */
    _buildElemClass: function(blockName, elemKey) {
      return blockName + this.config.elemPrefix + elemKey;
    },

    /**
     * Build class name for modifier.
     * @protected
     *
     * @param {String} blockName
     * @param {String} modKey
     * @param {String} modVal
     * @return {String}
     */
    _buildModClass: function(baseClass, modKey, modVal) {
      if (modVal !== undefined && modVal !== true) {
        return baseClass + this.config.modPrefix + modKey + this.config.modDlmtr + modVal;
      } else {
        return baseClass + this.config.modPrefix + modKey;
      }
    },

    /**
     * Build selector from object or string.
     * @private
     *
     * @param {String|Object}
     * @param {String}
     * @return {String}
     */
    _buildSelector: function(selector, prefix) {
      if (prefix !== '') {
        var prefix = prefix || '.';
      }

      if (typeof selector == 'object') {
        if (selector.block != undefined) {
          var buildSelector = this._buildBlockClass(selector.block);

          if (selector.elem != undefined) {
            buildSelector = this._buildElemClass(buildSelector, selector.elem);
          }

          if (selector.mod != undefined) {
            var mod = selector.mod.split(':');
            buildSelector = this._buildModClass(buildSelector, mod[0], mod[1]);
          }
        }
      }

      return buildSelector != undefined
        ? prefix + buildSelector
        : prefix + selector;
    },

    /**
     * Build class name for block.
     * @protected
     *
     * @param {Object|String} $this
     * @param {Number} [index]
     * @return {String}
     */
    _getBlockClass: function($this, index) {
      var blockClasses = this._extractBlocks($this);
      var index = index || 0;

      return index <= blockClasses.length - 1
        ? blockClasses[index]
        : null;
    },

    /**
     * Get base class from element.
     * @protected
     *
     * @param {Object} $this
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
     * @param {String} className
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

  /**
   * Create BEM instance.
   */

  $.BEM = new BEM({
    namePattern: '[a-zA-Z0-9-]+',
    elemPrefix: '__',
    modPrefix: '_',
    modDlmtr: '_'
  });

  /**
   * Extend jQuery object.
   */

  $.fn.extend({
    block: function(elem) {
      return $.BEM.getBlock(this, elem);
    },

    elem: function(elemKey) {
      return $.BEM.findElem(this, elemKey);
    },

    ctx: function(block, elem) {
      return $.BEM.switchBlock(this, block, elem);
    },    

    mod: function(modKey, modVal) {
      if (typeof modVal == 'undefined') {
        modVal = null;
      }

      if (modVal === false) {
        return $.BEM.delMod(this, modKey);
      }

      return (modVal != null)
        ? $.BEM.setMod(this, modKey, modVal)
        : $.BEM.getMod(this, modKey);
    },

    setMod: function(modKey, modVal) {
      return $.BEM.setMod(this, modKey, modVal);
    },

    delMod: function(modKey, modVal) {
      return $.BEM.delMod(this, modKey, modVal);
    },

    hasMod: function(modKey, modVal) {
      return $.BEM.hasMod(this, modKey, modVal);
    },

    byMod: function(modKey, modVal) {
      return $.BEM.byMod(this, modKey, modVal);
    },

    byNotMod: function(modKey, modVal) {
      return $.BEM.byMod(this, modKey, modVal, 'inverse');
    }
  });

})(jQuery, undefined);
