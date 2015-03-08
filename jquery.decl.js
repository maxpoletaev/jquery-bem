/* @required jQuery */
/* @required jQuery.BEM */

(function($, undefined) {

  if (!$.BEM) {
    console.error('jQuery.BEM required');
  }

  function attachEvent($el, event, fn) {
    if (Array.isArray(fn)) {
      fn.forEach(function(_fn) {
        attachEvent($el, event, _fn);
      });
    } else {
      $el.on(event, fn);
    }
  }

  $.decl = function(opts) {
    var $this = this;

    $.each(opts, function(key, opt) {
      if (opts.hasOwnProperty(key) {

        if (key.indexOf('on') === 0) {
          var eventName = key.slice(2).toLowerCase();
          attachEvent($this, eventName, opt);
        }

        else if (typeof opt == 'object') {
          var elemName = key.replace(/[A-Z]/g, '-$&').toLowerCase();
          var elemSelector = $this.selector + '__' elemName;
          $(elemSelector).decl(opt);
        }

      });
    });

    $this.trigger('init');
  };

}(jQuery));
