import ko from 'knockout';

import domready from 'domready';

import {
  DataAreaViewModel,
} from './data_area';

import {
  TemplateAreaViewModel,
} from './template_area';

domready(function() {
  const dataAreaViewModel = new DataAreaViewModel();

  ko.applyBindings(dataAreaViewModel, document.querySelector('.js-data-area'));

  //----------------------------------------------------------------------------

  const templateAreaViewModel = new TemplateAreaViewModel();

  ko.applyBindings(templateAreaViewModel, document.querySelector('.js-template-area'));

  //----------------------------------------------------------------------------

  const resultAreaViewModel = {};

  resultAreaViewModel.value = ko.pureComputed(function() {
    dataAreaViewModel.info('');
    dataAreaViewModel.isError(false);
    templateAreaViewModel.info('');
    templateAreaViewModel.isError(false);

    let data, result;

    try {
      data = dataAreaViewModel.compile();
    } catch(e) {
      dataAreaViewModel.info(e);
      dataAreaViewModel.isError(true);
    }

    try {
      result = templateAreaViewModel.compile(data);
    } catch(e) {
      templateAreaViewModel.info(e);
      templateAreaViewModel.isError(true);

      return '';
    }

    return result;
  }, resultAreaViewModel).extend({
    rateLimit: 500,
  });

  resultAreaViewModel.onClick = function(vm, event) {
    const blob = new Blob([ko.unwrap(vm.value)]);

    let url = URL.createObjectURL(blob);

    if (window.chrome) {
      // Chrome
      let a = document.createElement('a');

      a.href = url;
      a.download = 'data-formatter.txt';
      a.dispatchEvent(
        new Event('click', { bubbles: true })
      );

      a = null;
    } else {
      // Firefox
      window.open(url);
    }

    URL.revokeObjectURL(url);

    url = null;

    return false;
  };

  ko.applyBindings(resultAreaViewModel, document.querySelector('.js-result-area'));
});
