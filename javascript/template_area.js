import _ from 'lodash';
import ko from 'knockout';

import mustache from 'mustache';

import keymirror from 'keymirror';

export const types = keymirror({
  lodash: null,
  mustache: null,
});

export function TemplateAreaViewModel() {
  this.types = ko.observableArray(
    _.toArray(types)
  );
  this.selectedType = ko.observable('');

  this.info = ko.observable('');
  this.isError = ko.observable(false)

  this.value = ko.observable('');

  this.placeholder = ko.pureComputed(function() {
    switch (ko.unwrap(this.selectedType)) {
      case types.lodash:
        return '<% _.forEach(data, function(item) { %>\n  <p><%= item.name %></p>\n<% }); %>';
      case types.mustache:
        return '{{#data}}\n  <p>{{{name}}}</p>\n{{/data}}';
    }
  }, this);
}

TemplateAreaViewModel.prototype.onChange = function(vm, event) {
  const fileReader = new FileReader();

  fileReader.onload = function(event) {
    vm.value(event.target.result);
  };
  fileReader.readAsText(event.target.files[0]);
};

TemplateAreaViewModel.prototype.onKeyDown = function(vm, event) {
  const keyCode = event.keyCode || event.which;

  // if Tab
  if (keyCode === 9) {
    event.preventDefault();

    const observable = vm.value,
          text = ko.unwrap(observable),
          position = event.target.selectionStart;

    // insert Tab
    observable(
      `${text.slice(0, position)}\t${text.slice(position)}`
    );

    event.target.setSelectionRange(position + 1, position + 1);
  } else {
    return true;
  }
};

TemplateAreaViewModel.prototype.compile = function(data) {
  const templateText = ko.unwrap(this.value);

  switch (ko.unwrap(this.selectedType)) {
    case types.lodash:
      return _.template(templateText, {
        imports: {
          _: _,
        },
        variable: 'data',
      }).call(_, data);
    case types.mustache:
      return mustache.render(templateText, { data });
  }
};
