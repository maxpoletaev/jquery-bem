bem.decl('b-select', {
	onSetmod: function($this, e, modKey, modVal) {
		if (modKey == 'state' && modVal == 'active') {
			var $list = $this.elem('list');
			$list.slideDown(100);
		}
	},
	onDelmod: function($this, e, modKey, modVal) {
		if (modKey == 'state' && modVal == 'active') {
			var $list = $this.elem('list');
			$list.slideUp(100);
		}
	},
	onClick: function($this) {
		$this.hasMod('state')?
			$this.delMod('state', 'active'):
			$this.setMod('state', 'active')
		;
	},

	listItem: {
		onClick: function($this) {
			var text = $this.root('value-text'),
				value = $this.data('value'),
				input = $this.root('input')
			;

			input.val(value);
			text.text($this.text());
			$this.root().delMod('state', 'active');
		},
		onMouseover: function($this) {
			$this.setMod('state', 'hover');
		},
		onMouseout: function($this) {
			$this.delMod('state', 'hover');
		}
	}
});

bem.decl('b-page', {
	onClick: function($this, e) {
		var $target = $(e.target);
		var $select = $('.b-select');

		if ( ! $target.is($select)) {
			$select.delMod('state', 'active');
		}
	}
});