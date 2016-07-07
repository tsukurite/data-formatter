import _ from 'lodash';
import ko from 'knockout';

import keymirror from 'keymirror';

import csv from 'comma-separated-values';
import ltsv from 'ltsv';
import yaml from 'js-yaml';

export const types = keymirror({
  CSV: null,
  TSV: null,
  LTSV: null,
  JSON: null,
  YAML: null,
});

export function DataAreaViewModel() {
  this.types = ko.observableArray(
    _.toArray(types)
  );
  this.selectedType = ko.observable('');

  this.info = ko.observable('');
  this.isError = ko.observable(false);

  this.value = ko.observable('');

  this.placeholder = ko.pureComputed(function() {
    switch (ko.unwrap(this.selectedType)) {
      case types.CSV:
        return 'id,name\n1,Alice\n2,Bob';
      case types.TSV:
        return 'id	name\n1	Alice\n2	Bob';
      case types.LTSV:
        return 'id:1	name:Alice\nid:2	name:Bob';
      case types.JSON:
        return '[\n  { "id": 1, "name": "Alice" },\n  { "id": 2, "name": "Bob" }\n]';
      case types.YAML:
        return '- id: 1\n  name: Alice\n- id: 2\n  name: Bob';
    }
  }, this);
}

DataAreaViewModel.prototype.onKeyDown = function(vm, event) {
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

DataAreaViewModel.prototype.onChange = function(vm, event) {
  const fileReader = new FileReader();

  fileReader.onload = function(event) {
    vm.value(event.target.result);
  };
  fileReader.readAsText(event.target.files[0]);
};

DataAreaViewModel.prototype.compile = function() {
  const dataText = ko.unwrap(this.value);

  switch (ko.unwrap(this.selectedType)) {
    case types.CSV:
      return csv.parse(dataText, {
        cellDelimiter: ',',
        header: true,
      });
    case types.TSV:
      return csv.parse(dataText, {
        cellDelimiter: '\t',
        header: true,
      });
    case types.LTSV:
      return ltsv.parse(dataText);
    case types.JSON:
      return JSON.parse(dataText);
    case types.YAML:
      return yaml.safeLoad(dataText);
  }
};
