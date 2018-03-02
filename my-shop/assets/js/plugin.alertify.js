(function (alertify, $, _, window, document) {
  /**    * Получаем целевой блок    */   function getTraget(instance) {
    var self = this;
    var _content = instance.elements.content;
    var _target = instance.get('target');
    var $target = $(_content).find(_target);
    return $target;
  }

  alertify.sendMessage || alertify.dialog('sendMessage', function factory() {
    function send(instance) {
      var $form = getTraget(instance);
      var _message = $form.serializeObject();
      var _beforeSend = instance.get('beforeSend');
      if (typeof window[_beforeSend] === 'function') {
        message = window[_beforeSend]($form, _message);
      }
      Shop.sendMessage(_message).done(function (_response) {
        alertify.success(_response.notice);
        instance.close();
      }).fail(function (_response) {
        _.forEach(_response.errors, function (error) {
          alertify.error(val[0]);
        });
      });
    };
    function validate(instance) {
      var self = this;
      return validateForm(getTraget(instance));
    };
    return {
      main: function (params) {
        if (!params.beforeSend) {
          params.beforeSend = null;
        }
        this.setting(params);
      }, setup: function () {
        return {
          buttons: [{
            text: alertify.defaults.glossary.send || alertify.defaults.glossary.ok,
            key: 13,
            invokeOnClose: false,
            className: alertify.defaults.theme.ok
          }, {
            text: alertify.defaults.glossary.cancel,
            key: 27,
            invokeOnClose: true,
            className: alertify.defaults.theme.cancel
          }], focus: {element: 0}, options: {maximizable: false, resizable: false, movable: false}
        }
      }, prepare: function () {
      }, settings: {target: '', beforeSend: null,}, settingUpdated: function (key, oldValue, newValue) {
        switch (key) {
          case 'target':
            this.setContent($(newValue).clone()[0]);
            break;
        }
      }, callback: function (closeEvent) {
        var self = this;
        var errors;
        switch (closeEvent.index) {
          case 0:
            closeEvent.cancel = true;
            errors = validate(self, closeEvent);
            if (errors.length) {
              return false
            }
            send(self);
            break;
        }
      }
    };
  });
  alertify.panel || alertify.dialog('panel', function factory() {
    function closePanel(event) {
      var self = event.data;
      if ($(this).width() >= self.get('hideAfter')) {
        self.close();
      }
    };
    function onResize(modal) {
      $(window).on('resize', modal, closePanel);
    };
    function offResize(modal) {
      $(window).off('resize', closePanel);
    }

    return {
      main: function (params) {
        this.setting(params);
      }, setup: function () {
        return {options: {title: '', modal: true, movable: false, resizable: false, maximizable: false,}}
      }, settings: {target: null, panel: null, position: null, hideAfter: 764, onopen: null,}, prepare: function () {
      }, build: function () {
        $(this.elements.root).addClass('ajs-panel-placeholder');
        $(this.elements.dialog).addClass('ajs-panel');
        $(this.elements.header).hide();
        $(this.elements.footer).hide();
      }, settingUpdated: function (key, oldValue, newValue) {
        switch (key) {
          case 'position':
          case 'classes':
            $(this.elements.dialog).removeClass(oldValue).addClass(newValue);
            break;
          case 'target':
            this.setContent($(newValue).clone()[0]);
            break;
        }
      }, callback: function (closeEvent) {
      }, hooks: {
        onshow: function () {
          var self = this;
          onResize(self);
          var _onopen = self.get('onopen');
          if (typeof window[_onopen] === 'function') {
            window[_onopen].call($(self.elements.dialog));
          }
        }, onclose: function () {
          offResize(this);
        }
      }
    }
  });
  alertify.checkoutRecover || alertify.dialog('checkoutRecover', function factory() {
    function getForm(instance, ajax) {
      $.getJSON(instance.get('ajax')).done(function (response) {
        parseForm(instance, response);
      });
    };
    function parseForm(instance, response) {
      var _form = $('<div id="restore"><input name="utf8" type="hidden" value="✓"><div id="reset_password_message"></div><div class="form"><div class="form-row is-wide"><div class="form-label"></div><input id="email" name="email" type="text" class="form-field"></div></div></div>');
      var $form = $(response).find('#restore');
      var label = $form.find('td b').text();
      var buttonOk = $form.find('[name="commit"]').val();
      _form.find('.form-label').text(label);
      instance.setContent(_form[0]);
      $(instance.elements.header).text(buttonOk);
      $(instance.__internal.buttons[0].element).text(buttonOk);
      return;
    }

    function validate(instance, closeEvent) {
      var fields = $(instance.elements.content).find('input').serialize();
      clearForm(instance);
      $.ajax('/client_account/password/reset.json', {
        type: 'post',
        dataType: 'json',
        data: fields
      }).done(function (_response) {
        if (_response.status == 'ok') {
          alertify.success(_response.message);
          instance.close();
        } else {
          $('#reset_password_message').text(_response.message).addClass('notice is-error');
        }
      }).fail(function (response) {
        console.log('alertify: checkoutRecover: validate: fail: ', response);
      })
    }

    function clearForm(instance) {
      var $form = $(instance.elements.content).find('#restore');
      $form.find('#reset_password_message').text('').removeClass('notice is-error');
      $form.find('#email').val('');
    }

    return {
      main: function (params) {
        this.setting(params);
      }, setup: function () {
        return {
          buttons: [{
            text: alertify.defaults.glossary.send || alertify.defaults.glossary.ok,
            key: 13,
            invokeOnClose: false,
            className: alertify.defaults.theme.ok
          }, {
            text: alertify.defaults.glossary.cancel,
            key: 27,
            invokeOnClose: true,
            className: alertify.defaults.theme.cancel
          }], focus: {element: 0}, options: {maximizable: false, resizable: false, movable: false}
        }
      }, settings: {ajax: null, checkJson: ''}, prepare: function () {
        clearForm(this);
      }, build: function () {
      }, settingUpdated: function (key, oldValue, newValue) {
        switch (key) {
          case 'ajax':
            getForm(this, newValue);
            break;
        }
      }, callback: function (closeEvent) {
        var self = this;
        var errors;
        switch (closeEvent.index) {
          case 0:
            closeEvent.cancel = true;
            validate(self, closeEvent);
            break;
        }
      }
    };
  });
})(alertify, jQuery, _, window, document);
$(function () {
  $(document).on('click', '[data-type]', function (event) {
    event.preventDefault();
    var options = $(this).data();
    alertify[options.type](options);
  });
  $('a[onclick*="$.facebox"]').attr('onclick', '').on('click', function (event) {
    event.preventDefault();
    alertify.checkoutRecover({ajax: '/client_account/session/new.json'});
  })
});