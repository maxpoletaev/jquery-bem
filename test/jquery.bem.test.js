module('core');

test('get class type', function() {
  ok($.BEM._getClassType('block') == 'block',
    'block class detection'
  );
  
  ok($.BEM._getClassType('block__elem') == 'elem',
    'element class detection'
  );
  
  ok($.BEM._getClassType('block_key_val') == 'mod',
    'block modifier class detection'
  );
  
  ok($.BEM._getClassType('block__elem_key_val') == 'mod',
    'element modifier class detection'
  );

  ok($.BEM._getClassType('block_mod') == 'mod',
    'boolean block modifier detection'
  );

  ok($.BEM._getClassType('block__elem_mod') == 'mod',
    'boolean element modifier detection'
  );
  
  ok($.BEM._getClassType('other-class_unknown_elem__mod') == null,
    'unknown class detection'
  );
});

test('build selectors', function() {
  ok($.BEM._buildSelector({ block: 'b-block' }) == '.b-block',
    'build block selector'
  );
  
  ok($.BEM._buildSelector({ block: 'b-block', elem: 'elem' }) == '.b-block__elem',
    'build element selector'
  );
  
  ok($.BEM._buildSelector({ block: 'b-block', mod: 'key:val' }) == '.b-block_key_val',
    'build block modifer selector'
  );
  
  ok($.BEM._buildSelector({ block: 'b-block', elem: 'elem', mod: 'key:val' }) == '.b-block__elem_key_val',
    'build element modifer selector'
  );

  ok($.BEM._buildSelector('b-block') == '.b-block',
    'build selector from string'
  );

  ok($.BEM._buildSelector({ block: 'block', elem: 'elem', mod: 'mod' }) == '.block__elem_mod',
    'build boolean modifer'
  );
});
