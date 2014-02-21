jQuery.BEM
==========

jQuery.BEM is small jQuery plugin for comfortable working with HTML made by BEM method.

 * Learn more about BEM: http://bem.info/ 


Selecting elements
------------------

```html
<div class="b-product">
  <div class="b-product__name">Coffe</div>
  <div class="b-product__price">$2</div>
</div>
<div class="b-product">
  <div class="b-product__name">Tea</div>
  <div class="b-product__price">$1</div>
</div>
```

```javascript
$('.b-product:first').elem('name');                 // $('.b-product:first > .b-product__name')
$('.b-product:first').elem('name').block();         // $('.b-product:first > .b-product__name').closest('.b-product')
$('.b-product:first').elem('name').block('price');  // $('.b-product:first > .b-product__name').siblings('.b-product__price')
```


Working with modifiers
----------------------

### Setting modifier

```html
<div class="b-product">...</div>
```

```javascript
$('.b-product').mod('theme', 'premium');  // will get .b-product.b-product_theme_premium
$('.b-product').mod('premium', true);     // will get .b-product.b-product_premium_true
```

### Remove modifier

```html
<div class="b-product b-product_theme_premium">...</div>
```

```javascript
$('.b-product').delMod('theme', 'premium');  // $('.b-product').removeClass('.b-product_theme_premium');
$('.b-product').delMod('theme');             // remove the modifier "theme" of any value (.b-product_theme_*)
$('.b-product').mod('theme', false);         // same
```

### Getting modifier

```html
<div class="b-product b-product_theme_premium">...</div>
```

```javascript
$('.b-product').mod('theme')      // will return "premium"
$('.b-product').mod('discount');  // will rerurn null (non-existent modifier)
```

### Checking modifier

```html
<div class="b-product b-product_theme_premium">...</div>
```

```javascript
$('.b-product').hasMod('theme');             // true
$('.b-product').hasMod('theme', 'premium');  // true
$('.b-product').hasMod('theme', 'discount')  // false
```

### Filtering by modifier

```html
<div class="b-product b-product_theme_premium">...</div>
<div class="b-product">...</div>
```

```javascript
$('.b-product').byMod('theme', 'premium');     // instead of $('.b-product.b-product_theme_premium')
$('.b-product').byNotMod('theme', 'premium');  // instead of $('.b-product').not('.b-product_theme_premium')
$('.b-product').byMod('theme');                // filtering by modifier "theme" of any value (?)
```
