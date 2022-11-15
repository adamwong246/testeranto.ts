export abstract class BaseSuite<ISubject, IStore, ISelection> {
  name: string;
  subject: ISubject;
  givens: BaseGiven<ISubject, IStore, ISelection>[];

  constructor(
    name: string,
    subject: ISubject,
    givens: BaseGiven<ISubject, IStore, ISelection>[],

  ) {
    this.name = name;
    this.subject = subject;
    this.givens = givens;
  }

  test() {
    console.log("\nSuite:", this.name)
    this.givens.forEach((givenThat: BaseGiven<ISubject, IStore, ISelection>) => {
      givenThat.test(this.subject);
    })
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
    feature: string,
  ) {
    this.name = name;
    this.whens = whens;
    this.thens = thens;
    this.feature = feature;
  }

  abstract givenThat(subject: ISubject): IStore;

  test(subject: ISubject) {
    console.log(`\n - ${this.feature} - \n\nGiven: ${this.name}`)
    const store = this.givenThat(subject);

    this.whens.forEach((whenStep) => {
      whenStep.test(store);
    });

    this.thens.forEach((thenStep) => {
      thenStep.test(store);
    });
  }

}

export abstract class BaseWhen<IStore> {
  name: string;
  actioner: (x: any) => any;
  constructor(
    name: string,
    actioner: (x) => any,
  ) {
    this.name = name;
    this.actioner = actioner;
  }

  abstract andWhen(store: IStore, actioner: (x) => any): any;

  test(store: IStore): IStore {
    console.log(" When:", this.name);
    return this.andWhen(store, this.actioner)
  }
};

export abstract class BaseThen<ISelection> {
  name: string;
  callback: (storeState: ISelection) => any;

  constructor(
    name: string,
    callback: (val: ISelection) => any
  ) {
    this.name = name;
    this.callback = callback;
  }

  abstract butThen(store: any): ISelection;

  test(store: any) {
    console.log(" Then:", this.name);
    return this.callback(this.butThen(store));
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export abstract class TesterantoBasic<
  ISubject, IStore, ISelection,
  SuiteExtensions, GivenExtensions, WhenExtensions, ThenExtensions
> {

  constructorator: IStore;

  suitesOverrides: Record<(keyof SuiteExtensions), (
    sometext: string,
    subject: ISubject,
    givens: BaseGiven<ISubject, IStore, ISelection>[],
    ...xtraArgs
  ) => BaseSuite<ISubject, IStore, ISelection>>;

  givenOverides: Record<(keyof GivenExtensions), (
    feature: string,
    whens: BaseWhen<IStore>[],
    thens: BaseThen<ISelection>[],
    ...xtraArgs
  ) => BaseGiven<ISubject, IStore, ISelection>>;

  whenOverides: Record<(keyof WhenExtensions), (any) => BaseWhen<IStore>>;
  thenOverides: Record<(keyof ThenExtensions), (any) => BaseThen<ISelection>>;

  constructor(
    public readonly cc: IStore,
    suitesOverrides: Record<(keyof SuiteExtensions), (
      sometext: string,
      subject: ISubject,
      givens: BaseGiven<ISubject, IStore, ISelection>[],
      ...xtraArgs
    ) => BaseSuite<ISubject, IStore, ISelection>>,

    givenOverides: Record<(keyof GivenExtensions), (
      feature: string,
      whens: BaseWhen<IStore>[],
      thens: BaseThen<ISelection>[],
      ...xtraArgs
    ) => BaseGiven<ISubject, IStore, ISelection>>,
    whenOverides: Record<(keyof WhenExtensions), (c: any) => BaseWhen<IStore>>,
    thenOverides: Record<(keyof ThenExtensions), (d: any) => BaseThen<ISelection>>,
  ) {
    this.constructorator = cc;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
  }

  Suites():
    Record<(keyof SuiteExtensions), (
      sometext: string,
      subject: ISubject,
      givens: BaseGiven<ISubject, IStore, ISelection>[],
      ...xtraArgs
    ) => BaseSuite<ISubject, IStore, ISelection>> {
    return this.suitesOverrides;
  }

  Given():
    Record<(keyof GivenExtensions), (
      feature: string,
      whens: BaseWhen<IStore>[],
      thens: BaseThen<ISelection>[],
      ...xtraArgs
    ) => BaseGiven<ISubject, IStore, ISelection>> {
    return this.givenOverides;
  }

  When():
    Record<(keyof WhenExtensions), (any?) => BaseWhen<IStore>> {
    return this.whenOverides;
  }

  Then(): Record<(keyof ThenExtensions), (any?) => BaseThen<ISelection>> {
    return this.thenOverides;
  }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export class ClassySuite<Klass> extends BaseSuite<Klass, Klass, Klass> { };

export class ClassyGiven<Klass> extends BaseGiven<Klass, Klass, Klass> {
  thing: Klass;

  constructor(
    name: string,
    whens: ClassyWhen<Klass>[],
    thens: ClassyThen<Klass>[],
    feature: string,
    thing: Klass,
  ) {
    super(name, whens, thens, feature);
    this.thing = thing;
  }

  givenThat() {
    return this.thing;
  }
}

export class ClassyWhen<Klass> extends BaseWhen<Klass> {
  andWhen(thing: Klass): Klass {
    return this.actioner(thing);
  }
};

export class ClassyThen<Klass> extends BaseThen<Klass> {
  butThen(thing: Klass): Klass {
    return thing;
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class TesterantoClassic<Klass, GivenExtensions, WhenExtensions, ThenExtensions> {

  constructorator: new (...any) => Klass;

  givenOverides: Record<(keyof GivenExtensions), (
    feature: string,
    whens: ClassyWhen<Klass>[],
    thens: ClassyThen<Klass>[],
    ...xtraArgs
  ) => ClassyGiven<Klass>>;
  whenOverides: Record<(keyof WhenExtensions), (any) => ClassyWhen<Klass>>;
  thenOverides: Record<(keyof ThenExtensions), (any) => ClassyThen<Klass>>;

  constructor(
    public readonly cc: new () => Klass,
    givenOverides: Record<(keyof GivenExtensions), (
      feature: string,
      whens: ClassyWhen<Klass>[],
      thens: ClassyThen<Klass>[],
      ...xtraArgs
    ) => ClassyGiven<Klass>>,
    whenOverides: Record<(keyof WhenExtensions), (c: any) => ClassyWhen<Klass>>,
    thenOverides: Record<(keyof ThenExtensions), (d: any) => ClassyThen<Klass>>,

  ) {
    this.constructorator = cc;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;

  }

  Suites(): Record<string, (a: ClassyGiven<Klass>[]) => ClassySuite<Klass>> {
    return {
      Default:
        (givenz: ClassyGiven<Klass>[]) =>
          new ClassySuite<Klass>('Default constructor', this.constructorator.prototype, givenz),
    }
  }

  Given():
    Record<(keyof GivenExtensions | 'Default'), (
      feature: string,
      whens: ClassyWhen<Klass>[],
      thens: ClassyThen<Klass>[],
      ...xtraArgs
    ) => ClassyGiven<Klass>> {
    return {

      Default: (
        feature: string,
        whens: ClassyWhen<Klass>[],
        thens: ClassyThen<Klass>[],
      ) => new ClassyGiven(`default constructor`, whens, thens, feature, new this.constructorator()),

      ...this.givenOverides
    };
  }

  When():
    Record<(keyof WhenExtensions | keyof Klass), (any) => ClassyWhen<Klass>> {

    const objectdescription = Object.getOwnPropertyDescriptors(this.constructorator.prototype);

    let autogeneratedWhens = {};
    Object.keys(objectdescription).forEach((k, ndx) => {
      autogeneratedWhens[k] = (...xArgs) =>
        new ClassyWhen<Klass>(`!${k}`, (y) => {
          return y[k](...xArgs)
        }
        )
    })

    /* @ts-ignore:next-line */
    return {
      ...autogeneratedWhens,
      ...this.whenOverides
    };
  }

  Then(): Record<(keyof ThenExtensions | keyof Klass), (any) => ClassyThen<Klass>> {

    const objectdescription = Object.getOwnPropertyDescriptors(this.constructorator.prototype);

    let autogeneratedWhens = {};
    Object.keys(objectdescription).forEach((k, ndx) => {
      autogeneratedWhens[k] = (...xArgs) =>
        new ClassyWhen<Klass>(`!${k}`, (y) => {
          return y[k](...xArgs)
        }
        )
    })

    /* @ts-ignore:next-line */
    return {
      ...autogeneratedWhens,
      ...this.thenOverides
    };
  }

}