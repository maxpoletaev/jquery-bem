QUnit.module('core', {

  /**
   * Reset the config variables before each test case.
   */
  beforeEach: function() {
    $.BEM.setConfig();
  }
});

QUnit.test('get class type', function(assert) {
  assert.ok($.BEM.getClassType('block') == 'block',
    'block class detection'
  );

  assert.ok($.BEM.getClassType('block__elem') == 'elem',
    'element class detection'
  );

  assert.ok($.BEM.getClassType('block_key_val') == 'mod',
    'block modifier class detection'
  );

  assert.ok($.BEM.getClassType('block__elem_key_val') == 'mod',
    'element modifier class detection'
  );

  assert.ok($.BEM.getClassType('block_mod') == 'mod',
    'boolean block modifier detection'
  );

  assert.ok($.BEM.getClassType('block__elem_mod') == 'mod',
    'boolean element modifier detection'
  );

  assert.ok($.BEM.getClassType('other-class_unknown_elem__mod') == null,
    'unknown class detection'
  );
});

QUnit.test('overriding config', function(assert) {
  $.BEM.setConfig({
    namePattern: '[a-z]+',
    elemPrefix: '____',
    modPrefix: '--',
    modDlmtr: '---'
  });

  assert.ok($.BEM.getClassType('block') == 'block',
    'block class detection'
  );

  assert.ok($.BEM.getClassType('block____elem') == 'elem',
    'element class detection'
  );

  assert.ok($.BEM.getClassType('block--key---val') == 'mod',
    'block modifier class detection'
  );

  assert.ok($.BEM.getClassType('block____elem--key---val') == 'mod',
    'element modifier class detection'
  );

  assert.ok($.BEM.getClassType('block--mod') == 'mod',
    'boolean block modifier detection'
  );

  assert.ok($.BEM.getClassType('block____elem--mod') == 'mod',
    'boolean element modifier detection'
  );

  assert.ok($.BEM.getClassType('other-class--unknown---elem__mod') == null,
    'unknown class detection'
  );
});

QUnit.test('build selectors', function(assert) {
  assert.ok($.BEM.buildSelector({ block: 'b-block' }) == '.b-block',
    'build block selector'
  );

  assert.ok($.BEM.buildSelector({ block: 'b-block', elem: 'elem' }) == '.b-block__elem',
    'build element selector'
  );

  assert.ok($.BEM.buildSelector({ block: 'b-block', mod: 'key:val' }) == '.b-block_key_val',
    'build block modifer selector'
  );

  assert.ok($.BEM.buildSelector({ block: 'b-block', elem: 'elem', mod: 'key:val' }) == '.b-block__elem_key_val',
    'build element modifer selector'
  );

  assert.ok($.BEM.buildSelector('b-block') == '.b-block',
    'build selector from string'
  );

  assert.ok($.BEM.buildSelector({ block: 'block', elem: 'elem', mod: 'mod' }) == '.block__elem_mod',
    'build boolean modifer'
  );
});

QUnit.test('selecting elements', function(assert) {
  var $fixture = $('#selecting-elements');
  var $block = $('.block', $fixture);
  var $elem = $('.block__elem', $fixture);
  var $subelem = $('.block__subelem', $fixture);

  assert.equal($block.elem('elem')[0], $elem[0],
    'selecting element'
  );
  assert.equal($block.elem('subelem')[0], $subelem[0],
    'selecting subelement'
  );
});

QUnit.test('selecting elements with context', function(assert) {
  var $fixture = $('#selecting-with-context');

  var $blockA = $('.block-a', $fixture);
  var $elemA = $('.block-a__elem', $fixture);
  var $blockB = $('.block-b', $fixture);
  var $elemB = $('.block-b__elem', $fixture);

  assert.equal($blockA.elem('elem')[0], $elemA[0]);
  assert.equal($blockB.elem('elem')[0], $elemB[0]);
});
