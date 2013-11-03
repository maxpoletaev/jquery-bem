jQuery.BEM
==========

jQuery.BEM is small jQuery plugin for comfortable working with HTML made by BEM method.

 * Learn more about BEM: http://bem.info/ 
 * Read README in Russian: http://habrahabr.ru/post/196368/



Selecting elements
------------------

HTML:

	<div class="b-product">
		<div class="b-product__name">Coffe</div>
		<div class="b-product__price">$2</div>
	</div>
	<div class="b-product">
		<div class="b-product__name">Tea</div>
		<div class="b-product__price">$1</div>
	</div>

JS:

	$('.b-product:first').elem('name');                // $('.b-product:first > .b-product__name')
	$('.b-product:first').elem('name').root();         // $('.b-product:first > .b-product__name').closest('.b-product')
	$('.b-product:first').elem('name').root('price');  // $('.b-product:first > .b-product__name').siblings('.b-product__price')



Working with modifiers
----------------------

### Setting modifier

HTML:

	<div class="b-product">...</div>

JS:

	$('.b-product').setMod('theme', 'premium');  // will get .b-product.b-product_theme_premium
	$('.b-product').setMod('premium');           // will get .b-product.b-product_premium_yes


### Remove modifier

HTML:

	<div class="b-product b-product_theme_premium">...</div>

JS:

	$('.b-product').delMod('theme', 'premium');  // $('.b-product').removeClass('.b-product_theme_premium');
	$('.b-product').delMod('theme');             // remove the modifier "theme" of any value (.b-product_theme_*)


### Getting modifier

HTML:

	<div class="b-product b-product_theme_premium">...</div>

JS:

	$('.b-product').getMod('theme')      // will return "premium"
	$('.b-product').getMod('discount');  // will rerurn null (non-existent modifier)


### Checking modifier

HTML:

	<div class="b-product b-product_theme_premium">...</div>

JS:

	$('.b-product').hasMod('theme');             // true
	$('.b-product').hasMod('theme', 'premium');  // true
	$('.b-product').hasMod('theme', 'discount')  // false


### Filtering by modifier

HTML:

	<div class="b-product b-product_theme_premium">...</div>
	<div class="b-product">...</div>

JS:

	$('.b-product').byMod('theme', 'premium');     // instead of $('.b-product.b-product_theme_premium')
	$('.b-product').byNotMod('theme', 'premium');  // instead of $('.b-product').not('.b-product_theme_premium')
	$('.b-product').byMod('theme');                // filtering by modifier "theme" of any value (.b-product_theme_*)



Declarations
------------

	bem.decl('b-product', {
			onInit: function($this) {
					// Add to element "price" modifier "size" with a value of "large" when DOM ready.
					$this.elem('price').setMod('size', 'large');
			},
			title: {
					onMouseover: function($this) {
							// Add to root block "b-product" modifier "state" with a value "hover"
							$this.root().setMod('state', 'hover');

							// Call the helper function.
							this._customFunction();
					},
					_customFunction: function() {
							console.log('I am helper function');
					}
			},
			price: {
					onSetmod: function($this, e, modKey, modVal) {
							// Print to console information about the installed modifier of element "price".
							console.log('Modifier set:', modKey, modVal);
					},
					onDelmod($this, e, modKey, modVal) {
							//
					}
			}
	});


Override syntax
---------------

If you are not satisfied with the standard BEM syntax (for example prefixes), use

	bem.setConfig({
		namePrefix: '',     // Names prefix (RegExp)
		elemPrefix: '-',    // Element prefix
		modPrefix: '_',     // Modifier prefix
		modDlmtr: '-'       // Delimiter for the modifier key and value
	});

Now the classes must be named on another:

	.block
	.block-element
	.block-element_modifier-value