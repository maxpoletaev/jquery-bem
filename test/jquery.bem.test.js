module('core');

test('get class type', function() {

  var block    = $.BEM._getClassType('b-block')
    , elem     = $.BEM._getClassType('b-block__elem')
    , blockMod = $.BEM._getClassType('b-block_key_val')
    , elemMod  = $.BEM._getClassType('b-block__elem_key_val')
    , unknown  = $.BEM._getClassType('other_class-name');
  
  ok(block == 'block',
    'block class detection'
  );
  
  ok(elem == 'elem',
    'element class detection'
  );
  
  ok(blockMod == 'mod',
    'block modifier class detection'
  );
  
  ok(elemMod == 'mod',
    'element modifier class detection'
  );
  
  ok(unknown == null,
    'unknown class detection'
  );
});

test('build selectors', function() {

  var block    = $.BEM._buildSelector({ block: 'b-block' })
    , elem     = $.BEM._buildSelector({ block: 'b-block', elem: 'elem' })
    , blockMod = $.BEM._buildSelector({ block: 'b-block', mod: 'key:val' })
    , elemMod  = $.BEM._buildSelector({ block: 'b-block', elem: 'elem', mod: 'key:val' })
    , string   = $.BEM._buildSelector('b-block');

  ok(block == '.b-block',
    'build block selector'
  );
  
  ok(elem == '.b-block__elem',
    'build element selector'
  );
  
  ok(blockMod == '.b-block_key_val',
    'build block modifer selector'
  );
  
  ok(elemMod == '.b-block__elem_key_val',
    'build element modifer selector'
  );

  ok(string == '.b-block',
    'build selector from string'
  );
});
