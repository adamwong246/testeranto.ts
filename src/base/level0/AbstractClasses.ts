import { mapValues } from "lodash";

export abstract class BaseSuite<ISubject, IStore, ISelection> {
  name: string;
  givens: BaseGiven<ISubject, IStore, ISelection>[];
  checks: BaseCheck<ISubject, IStore, ISelection>[];

  constructor(
    name: string,
    givens: BaseGiven<ISubject, IStore, ISelection>[] = [],
    checks: BaseCheck<ISubject, IStore, ISelection>[] = []
  ) {
    this.name = name;
    this.givens = givens;
    this.checks = checks;
  }

  async run(subject) {
    console.log("\nSuite:", this.name);
    for (const givenThat of this.givens) {
      await givenThat.give(subject);
    }

    for (const checkThat of this.checks) {
      await checkThat.check(subject);
    }
  }
}

export abstract class BaseGiven<ISubject, IStore, ISelection> {
  name: string;
  whens: BaseWhen<IStore>[];
  thens: BaseThen<ISelection>[];
  feature: string;

  constructor(
    name: string,
    whens: BaseWhen<IStore>[],
    thens: BaseThen<ISelection>[],
    feature: string
  ) {
    this.name = name;
    this.whens = whens;
    this.thens = thens;
    this.feature = feature;
  }

  abstract givenThat(subject: ISubject): IStore;

  async teardown(subject: any) {
    return subject;
  }

  async give(subject: ISubject) {
    console.log(`\n - ${this.feature} - \n\nGiven: ${this.name}`);
    const store = await this.givenThat(subject);

    for (const whenStep of this.whens) {
      await whenStep.test(store);
    }

    for (const thenStep of this.thens) {
      await thenStep.test(store);
    }

    await this.teardown(store);
    return;
  }
}

export abstract class BaseWhen<IStore> {
  name: string;
  actioner: (x: any) => any;
  constructor(name: string, actioner: (x) => any) {
    this.name = name;
    this.actioner = actioner;
  }

  abstract andWhen(store: IStore, actioner: (x) => any): any;

  async test(store: IStore) {
    console.log(" When:", this.name);
    return await this.andWhen(store, this.actioner);
  }
}

export abstract class BaseThen<ISelection> {
  name: string;
  callback: (storeState: ISelection) => any;

  constructor(name: string, callback: (val: ISelection) => any) {
    this.name = name;
    this.callback = callback;
  }

  abstract butThen(store: any): ISelection;

  async test(store: any) {
    console.log(" Then:", this.name);
    return this.callback(await this.butThen(store));
  }
}

export abstract class BaseCheck<ISubject, IStore, ISelection> {
  feature: string;
  callback: (whens, thens) => any;
  whens: any; //Record<string, BaseWhen<any>>;
  thens: any; //Record<string, BaseThen<any>>;

  constructor(feature: string, callback: (whens, thens) => any, whens, thens) {
    this.feature = feature;
    this.callback = callback;
    this.whens = whens;
    this.thens = thens;
  }

  abstract checkThat(subject: ISubject): IStore;

  async teardown(subject: any) {
    return subject;
  }

  async check(subject: ISubject) {
    console.log(`\n - \nCheck: ${this.feature}`);
    const store = await this.checkThat(subject);
    await this.callback(
      mapValues(this.whens, (when) => {
        return async (payload) => {
          return await when(payload).test(store);
        };
      }),
      mapValues(this.thens, (then) => {
        return async (payload) => {
          return await then(payload).test(store);
        };
      })
    );

    await this.teardown(store);
    return;
  }
}
