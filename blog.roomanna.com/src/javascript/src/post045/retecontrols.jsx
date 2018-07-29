import Rete from 'rete';

export class NumControl extends Rete.Control {
  constructor(emitter, key, readonly) {
    super();
    this.emitter = emitter;
    this.key = key;
    this.template = '<input type="number" :readonly="readonly" :value="value" @input="change($event)"/>';

    this.scope = {
      value: 0,
      readonly,
      change: this.change.bind(this)
    };
  }

  change(e) {
    this.scope.value = +e.target.value;
    this.update();
  }

  update() {
    if(this.key) {
      this.putData(this.key, this.scope.value)
    }
    this.emitter.trigger('process');
    this._alight.scan();
  }

  mounted() {
    this.scope.value = this.getData(this.key) || 0;
    this.update();
  }

  setValue(val) {
    this.scope.value = val;
    this._alight.scan()
  }
}

export class DataControl extends Rete.Control {
  constructor(emitter, key) {
    super();
    this.emitter = emitter;
    this.key = key;
    this.template = '<div>{{value}}</div>';

    this.scope = {
      value: '',
    };
  }

  mounted() {
    this.setValue(this.getData(this.key));
  }

  setValue(val) {
    this.scope.value = (val || []).join(',') || '<EMPTY>';
    this._alight.scan()
  }
}
