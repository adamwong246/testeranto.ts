import renderer, { act, ReactTestRenderer } from 'react-test-renderer';

import { BaseSuite, BaseGiven, BaseWhen, BaseThen } from '../../index';

export class ReactSuite extends
  BaseSuite<
    () => JSX.Element,  // the thing we test
    ReactTestRenderer,  // the thing we perform actions against
    ReactTestRenderer   // the thing we make assertions against
  > {
}

export class ReactGiven extends
  BaseGiven<
    () => JSX.Element,
    ReactTestRenderer,
    ReactTestRenderer
  >{

  given(subject: () => JSX.Element) {
    let component;
    act(() => {
      component = renderer.create(subject());
    });
    return component;
  }
}

export class ReactWhen extends BaseWhen<ReactTestRenderer> {
  when(store: renderer.ReactTestRenderer) {
    act(() => this.actioner(store));
  }
};

export class ReactThen extends BaseThen<ReactTestRenderer>{
  then(component: renderer.ReactTestRenderer): renderer.ReactTestRenderer {
    return component;
  }
};
