import fs from "fs";
import { mapValues } from "lodash";

type IT = {
  name: string;
  givens: BaseGiven<unknown, unknown, unknown, unknown>[];
  checks: BaseCheck<unknown, unknown, unknown, unknown>[];
};

type ITest = {
  test: IT;
  runner: (testResurce?) => unknown;
  testResource: any;
};

type ITestResults = Promise<{
  test: IT;
  status: any;
}>[];

export type ITTestShape = {
  suites;
  givens;
  whens;
  thens;
  checks;
};

export type ITestSpecification<ITestShape extends ITTestShape> = (
  Suite: {
    [K in keyof ITestShape["suites"]]: (
      name: string,
      givens: BaseGiven<unknown, unknown, unknown, unknown>[],
      checks: BaseCheck<unknown, unknown, unknown, unknown>[]
    ) => BaseSuite<unknown, unknown, unknown, unknown, unknown>;
  },
  Given: {
    [K in keyof ITestShape["givens"]]: (
      name: string,
      features: BaseFeature[],
      whens: BaseWhen<unknown, unknown, unknown>[],
      thens: BaseThen<unknown, unknown, unknown>[],
      ...xtras: ITestShape["givens"][K]
    ) => BaseGiven<unknown, unknown, unknown, unknown>;
  },
  When: {
    [K in keyof ITestShape["whens"]]: (
      ...xtras: ITestShape["whens"][K]
    ) => BaseWhen<unknown, unknown, unknown>;
  },
  Then: {
    [K in keyof ITestShape["thens"]]: (
      ...xtras: ITestShape["thens"][K]
    ) => BaseThen<unknown, unknown, unknown>;
  },
  Check: {
    [K in keyof ITestShape["checks"]]: (

      name: string,
      features: BaseFeature[],
      callbackA: (
        whens: {
          [K in keyof ITestShape["whens"]]: (...unknown) => BaseWhen<unknown, unknown, unknown>
        },
        thens: {
          [K in keyof ITestShape["thens"]]: (...unknown) => BaseThen<unknown, unknown, unknown>
        },

      ) => unknown,
      // whens: BaseWhen<unknown, unknown, unknown>[],
      // thens: BaseThen<unknown, unknown, unknown>[],

      ...xtras: ITestShape["checks"][K]
    ) => BaseCheck<unknown, unknown, unknown, unknown>;
  }
) => any[];

export type ITestImplementation<
  IState,
  ISelection,
  IWhenShape,
  IThenShape,
  ITestShape extends ITTestShape
> = {
  Suites: {
    [K in keyof ITestShape["suites"]]: string;
  };
  Givens: {
    [K in keyof ITestShape["givens"]]: (
      ...e: ITestShape["givens"][K]
    ) => IState;
  };
  Whens: {
    [K in keyof ITestShape["whens"]]: (
      ...f: ITestShape["whens"][K]
    ) => (zel: ISelection) => IWhenShape;
  };
  Thens: {
    [K in keyof ITestShape["thens"]]: (
      ...g: ITestShape["thens"][K]
    ) => (sel: ISelection) => IThenShape;
  };
  Checks: {
    [K in keyof ITestShape["checks"]]: (
      ...h: ITestShape["checks"][K]
    ) => IState;
  };
};

export class BaseFeature {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

export abstract class BaseSuite<
  IInput,
  ISubject,
  IStore,
  ISelection,
  IThenShape
> {
  name: string;
  givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[];
  checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[];

  constructor(
    name: string,
    givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[] = [],
    checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[] = []
  ) {
    this.name = name;
    this.givens = givens;
    this.checks = checks;
  }

  setup(s: IInput): Promise<ISubject> {
    return new Promise((res) => res(s as unknown as ISubject));
  }

  test(t: IThenShape): unknown {
    return t;
  }

  async run(input, testResourceConfiguration?) {
    const subject = await this.setup(input);

    console.log("\nSuite:", this.name, testResourceConfiguration);

    for (const [ndx, giver] of this.givens.entries()) {
      await giver.give(subject, ndx, testResourceConfiguration, this.test);
    }

    for (const [ndx, thater] of this.checks.entries()) {
      await thater.check(subject, ndx, testResourceConfiguration, this.test);
    }
  }
}

export abstract class BaseGiven<ISubject, IStore, ISelection, IThenShape> {
  name: string;
  features: BaseFeature[];
  whens: BaseWhen<IStore, ISelection, IThenShape>[];
  thens: BaseThen<ISelection, IStore, IThenShape>[];

  constructor(
    name: string,
    features: BaseFeature[],
    whens: BaseWhen<IStore, ISelection, IThenShape>[],
    thens: BaseThen<ISelection, IStore, IThenShape>[]
  ) {
    this.name = name;
    this.features = features;
    this.whens = whens;
    this.thens = thens;
  }

  abstract givenThat(
    subject: ISubject,
    testResourceConfiguration?
  ): Promise<IStore>;

  async teardown(subject: IStore, ndx: number): Promise<unknown> {
    return;
  }

  async give(
    subject: ISubject,
    index: number,
    testResourceConfiguration,
    tester
  ) {
    console.log(`\n Given: ${this.name}`);
    const store = await this.givenThat(subject, testResourceConfiguration);

    for (const whenStep of this.whens) {
      await whenStep.test(store, testResourceConfiguration);
    }

    for (const thenStep of this.thens) {
      const t = await thenStep.test(store, testResourceConfiguration);
      tester(t);
    }

    await this.teardown(store, index);
    return;
  }
}

export abstract class BaseWhen<IStore, ISelection, IThenShape> {
  name: string;
  actioner: (x: ISelection) => IThenShape;

  constructor(name: string, actioner: (xyz: ISelection) => IThenShape) {
    this.name = name;
    this.actioner = actioner;
  }

  abstract andWhen(
    store: IStore,
    actioner: (x: ISelection) => IThenShape,
    testResource
  );

  async test(store: IStore, testResourceConfiguration?) {
    console.log(" When:", this.name);
    return await this.andWhen(store, this.actioner, testResourceConfiguration);
  }
}

export abstract class BaseThen<ISelection, IStore, IThenShape> {
  name: string;
  thenCB: (storeState: ISelection) => IThenShape;

  constructor(name: string, thenCB: (val: ISelection) => IThenShape) {
    this.name = name;
    this.thenCB = thenCB;
  }

  abstract butThen(store: any, testResourceConfiguration?): ISelection;

  async test(store: IStore, testResourceConfiguration): Promise<IThenShape> {
    console.log(" Then:", this.name);
    return this.thenCB(await this.butThen(store, testResourceConfiguration));
  }
}

export abstract class BaseCheck<ISubject, IStore, ISelection, IThenShape> {
  name: string;
  features: BaseFeature[];
  checkCB: (whens, thens) => any;
  whens: BaseWhen<IStore, ISelection, IThenShape>[];
  thens: BaseThen<ISelection, IStore, IThenShape>[];

  constructor(
    name: string,
    features: BaseFeature[],
    checkCB: (
      whens: BaseWhen<IStore, ISelection, IThenShape>[],
      thens: BaseThen<ISelection, IStore, IThenShape>[]
    ) => any,
    whens: BaseWhen<IStore, ISelection, IThenShape>[],
    thens: BaseThen<ISelection, IStore, IThenShape>[]
  ) {

    this.name = name;
    this.features = features;
    this.checkCB = checkCB;
    this.whens = whens;
    this.thens = thens;

  }

  abstract checkThat(
    subject: ISubject,
    testResourceConfiguration?
  ): Promise<IStore>;

  async teardown(subject: IStore, ndx: number): Promise<unknown> {
    return;
  }

  async check(
    subject: ISubject,
    ndx: number,
    testResourceConfiguration,
    tester
  ) {
    console.log(`\n Check: ${this.name}`);
    const store = await this.checkThat(subject, testResourceConfiguration);
    await this.checkCB(
      mapValues(this.whens, (when: (p, tc) => any) => {
        return async (payload) => {
          return await when(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration
          );
        };
      }),
      mapValues(this.thens, (then: (p, tc) => any) => {
        return async (payload) => {
          const t = await then(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration
          );
          tester(t);
        };
      })
    );

    await this.teardown(store, ndx);
    return;
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////
abstract class TesterantoBasic<
  IInput,
  ISubject,
  IStore,
  ISelection,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions,
  CheckExtensions,
  IThenShape
> {
  constructorator: IStore;

  suitesOverrides: Record<
    keyof SuiteExtensions,
    (
      name: string,
      givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[],
      checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[]
    ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape>
  >;

  givenOverides: Record<
    keyof GivenExtensions,
    (
      name: string,
      features: BaseFeature[],
      whens: BaseWhen<IStore, ISelection, IThenShape>[],
      thens: BaseThen<ISelection, IStore, IThenShape>[],
      ...xtraArgs
    ) => BaseGiven<ISubject, IStore, ISelection, IThenShape>
  >;

  whenOverides: Record<
    keyof WhenExtensions,
    (any) => BaseWhen<IStore, ISelection, IThenShape>
  >;

  thenOverides: Record<
    keyof ThenExtensions,
    (
      selection: ISelection,
      expectation: any
    ) => BaseThen<ISelection, IStore, IThenShape>
  >;

  checkOverides: Record<
    keyof CheckExtensions,
    (
      feature: string,
      callback: (whens, thens) => any,
      ...xtraArgs
    ) => BaseCheck<ISubject, IStore, ISelection, IThenShape>
  >;

  constructor(
    public readonly cc: IStore,
    suitesOverrides: Record<
      keyof SuiteExtensions,
      (
        name: string,
        givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[],
        checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[]
      ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape>
    >,

    givenOverides: Record<
      keyof GivenExtensions,
      (
        name: string,
        features: BaseFeature[],
        whens: BaseWhen<IStore, ISelection, IThenShape>[],
        thens: BaseThen<ISelection, IStore, IThenShape>[],
        ...xtraArgs
      ) => BaseGiven<ISubject, IStore, ISelection, IThenShape>
    >,

    whenOverides: Record<
      keyof WhenExtensions,
      (c: any) => BaseWhen<IStore, ISelection, IThenShape>
    >,

    thenOverides: Record<
      keyof ThenExtensions,
      (
        selection: ISelection,
        expectation: any
      ) => BaseThen<ISelection, IStore, IThenShape>
    >,

    checkOverides: Record<
      keyof CheckExtensions,
      (
        feature: string,
        callback: (whens, thens) => any,
        ...xtraArgs
      ) => BaseCheck<ISubject, IStore, ISelection, IThenShape>
    >
  ) {
    this.constructorator = cc;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.checkOverides = checkOverides;
  }

  Suites() {
    return this.suitesOverrides;
  }

  Given(): Record<
    keyof GivenExtensions,
    (
      name: string,
      features: BaseFeature[],
      whens: BaseWhen<IStore, ISelection, IThenShape>[],
      thens: BaseThen<ISelection, IStore, IThenShape>[],
      ...xtraArgs
    ) => BaseGiven<ISubject, IStore, ISelection, IThenShape>
  > {
    return this.givenOverides;
  }

  When(): Record<
    keyof WhenExtensions,
    (arg0: IStore, ...arg1: any) => BaseWhen<IStore, ISelection, IThenShape>
  > {
    return this.whenOverides;
  }

  Then(): Record<
    keyof ThenExtensions,
    (
      selection: ISelection,
      expectation: any
    ) => BaseThen<ISelection, IStore, IThenShape>
  > {
    return this.thenOverides;
  }

  Check(): Record<
    keyof CheckExtensions,
    (
      feature: string,
      callback: (whens, thens) => any,
      whens,
      thens
    ) => BaseCheck<ISubject, IStore, ISelection, IThenShape>
  > {
    return this.checkOverides;
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////
export class ClassySuite<Klass> extends BaseSuite<
  Klass,
  Klass,
  Klass,
  Klass,
  any
> {
  setup(s: Klass): Promise<Klass> {
    return new Promise((res, rej) => res(s));
  }
}

export class ClassyGiven<Klass> extends BaseGiven<Klass, Klass, Klass, any> {
  thing: Klass;

  constructor(
    name: string,
    features: BaseFeature[],
    whens: ClassyWhen<Klass>[],
    thens: ClassyThen<Klass>[],
    thing: Klass
  ) {
    super(name, features, whens, thens);
    this.thing = thing;
  }

  givenThat(subject: Klass, testResourceConfiguration?: any): Promise<Klass> {
    return new Promise((res) => res(this.thing));
  }
}

export class ClassyWhen<Klass> extends BaseWhen<Klass, Klass, any> {
  andWhen(thing: Klass): Klass {
    return this.actioner(thing);
  }
}

export class ClassyThen<Klass> extends BaseThen<Klass, Klass, any> {
  butThen(thing: Klass): Klass {
    return thing;
  }
}

export class ClassyCheck<Klass> extends BaseCheck<Klass, Klass, Klass, any> {
  thing: Klass;

  constructor(
    name: string,
    features: BaseFeature[],
    callback: (whens, thens) => any,
    whens,
    thens,
    thing: Klass
  ) {
    super(name, features, callback, whens, thens);
    this.thing = thing;
  }

  checkThat(subject: Klass, testResourceConfiguration?: any): Promise<Klass> {
    return new Promise((res) => res(this.thing));
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
export abstract class TesterantoInterface<
  IInput,
  ISubject,
  IStore,
  ISelection,
  IThenShape
> {
  abstract givenKlasser: (
    f,
    w,
    t,
    z?
  ) => BaseGiven<ISubject, IStore, ISelection, IThenShape>;
  abstract whenKlasser: (a, b) => BaseWhen<IStore, ISelection, IThenShape>;
  abstract thenKlasser: (a, b) => BaseThen<ISelection, IStore, IThenShape>;
  abstract checkKlasser: (
    n,
    f,
    cb,
    z?
  ) => BaseCheck<ISubject, IStore, ISelection, IThenShape>;
}
//////////////////////////////////////////////////////////////////////////////////////////////
export abstract class Testeranto<
  ITestShape extends ITTestShape,
  IState,
  ISelection,
  IStore,
  ISubject,
  IWhenShape,
  IThenShape,
  ITestResource,
  IInput
> {
  constructor(
    testImplementation: ITestImplementation<
      IState,
      ISelection,
      IWhenShape,
      IThenShape,
      ITestShape
    >,

    testSpecification: (
      Suite: {
        [K in keyof ITestShape["suites"]]: (
          feature: string,
          givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[],
          checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[]
        ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape>;
      },
      Given: {
        [K in keyof ITestShape["givens"]]: (
          name: string,
          features: BaseFeature[],
          whens: BaseWhen<IStore, ISelection, IThenShape>[],
          thens: BaseThen<ISelection, IStore, IThenShape>[],
          ...a: ITestShape["givens"][K]
        ) => BaseGiven<ISubject, IStore, ISelection, IThenShape>;
      },
      When: {
        [K in keyof ITestShape["whens"]]: (
          ...a: ITestShape["whens"][K]
        ) => BaseWhen<IStore, ISelection, IThenShape>;
      },
      Then: {
        [K in keyof ITestShape["thens"]]: (
          ...a: ITestShape["thens"][K]
        ) => BaseThen<ISelection, IStore, IThenShape>;
      },
      Check: {
        [K in keyof ITestShape["checks"]]: (
          name: string,
          features: BaseFeature[],
          cbz:
            (
              ...any
              // a: any,
              // b: any
              // { TheEmailIsSetTo }: { TheEmailIsSetTo: any },
              // { TheEmailIs }: { TheEmailIs: any }
            ) => Promise<void>
        ) => any;
      }
    ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape>[],

    input: IInput,

    suiteKlasser: (n: string, g: BaseGiven<ISubject, IStore, ISelection, IThenShape>[], c: any[]) =>
      BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape>,
    givenKlasser: (n, f, w, t, z?) =>
      BaseGiven<ISubject, IStore, ISelection, IThenShape>,
    whenKlasser: (s, o) =>
      BaseWhen<IStore, ISelection, IThenShape>,
    thenKlasser: (s, o) =>
      BaseThen<IStore, ISelection, IThenShape>,
    checkKlasser: (n, f, cb, w, t) =>
      BaseCheck<ISubject, IStore, ISelection, IThenShape>,
    
    testResource?: ITestResource
  ) {
    const classySuites = mapValues(
      testImplementation.Suites,
      () => (somestring, givens, checks) =>
        new suiteKlasser.prototype.constructor(somestring, givens, checks)

    );

    const classyGivens = mapValues(
      testImplementation.Givens,
      (z) =>
        (name, features, whens, thens, ...xtrasW) =>
          new givenKlasser.prototype.constructor(name, features, whens, thens, z(...xtrasW))
    );

    const classyWhens = mapValues(
      testImplementation.Whens,
      (whEn: (thing, payload?: any) => any) => (payload?: any) =>
        new whenKlasser.prototype.constructor(
          `${whEn.name}: ${payload && payload.toString()}`,
          whEn(payload)
        )
    );

    const classyThens = mapValues(
      testImplementation.Thens,
      (thEn: (klass, ...xtrasE) => void) => (expected: any, x) =>
        new thenKlasser.prototype.constructor(
          `${thEn.name}: ${expected && expected.toString()}`,
          thEn(expected)
        )
    );

    const classyChecks = mapValues(
      testImplementation.Checks,
      (z) => (somestring, features, callback) => {
        return new checkKlasser.prototype.constructor(somestring, features, callback, classyWhens, classyThens);
      }
    );

    const classyTesteranto = new (class <
      IInput,
      ISubject,
      IStore,
      ISelection,
      SuiteExtensions,
      GivenExtensions,
      WhenExtensions,
      ThenExtensions,
      ICheckExtensions,
      IThenShape
    > extends TesterantoBasic<
      IInput,
      ISubject,
      IStore,
      ISelection,
      SuiteExtensions,
      GivenExtensions,
      WhenExtensions,
      ThenExtensions,
      ICheckExtensions,
      IThenShape
    > { })(
      input,
      /* @ts-ignore:next-line */
      classySuites,
      classyGivens,
      /* @ts-ignore:next-line */
      classyWhens,
      classyThens,
      classyChecks
    );

    const suites = testSpecification(
      /* @ts-ignore:next-line */
      classyTesteranto.Suites(),
      classyTesteranto.Given(),
      classyTesteranto.When(),
      classyTesteranto.Then(),
      classyTesteranto.Check()
    );

    return suites.map((suite) => {
      return {
        test: suite,
        testResource,
        runner: async (testResourceConfiguration?) => {
          await suite.run(input, testResourceConfiguration[testResource]);
        },
      };
    });
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////

const processTestsWithPorts = async (
  tests: ITest[],
  ports: number[]
): Promise<ITestResults> => {
  const testsStack = tests;
  return (
    await Promise.all(
      ports.map(async (port: number) => {
        return new Promise<ITestResults>((res, rej) => {
          const popper = async (payload) => {
            if (testsStack.length === 0) {
              res(payload);
            } else {
              const suite = testsStack.pop();
              try {
                await suite?.runner({ port });
                popper([
                  ...payload,
                  {
                    test: suite?.test,
                    status: "pass",
                  },
                ]);
              } catch (e) {
                console.error(e);
                popper([
                  ...payload,
                  {
                    test: suite?.test,
                    status: e,
                  },
                ]);
              }
            }
          };
          popper([]);
        });
      })
    )
  ).flat();
};

export const reporter = async (
  tests: Promise<ITest>[],

  testResources: {
    ports: number[];
  }
) => {
  await Promise.all(tests).then(async (x) => {
    const suites = x.flat();

    const testsWithoutResources: ITestResults = suites
      .filter((s) => !s.testResource)
      .map(async (suite) => {
        let status;
        try {
          await suite.runner({});
          status = "pass";
        } catch (e) {
          console.error(e);
          status = e;
        }

        return {
          test: suite.test,
          status,
        };
      });

    const portTestresults = await processTestsWithPorts(
      suites.filter((s) => s.testResource === "port"),
      testResources.ports
    );

    Promise.all([...testsWithoutResources, ...portTestresults]).then(
      (result) => {
        fs.writeFile(
          "./dist/testerantoResults.txt",
          JSON.stringify(result, null, 2),
          (err) => {
            if (err) {
              console.error(err);
            }

            const failures = result.filter((r) => r.status != "pass");

            if (failures.length) {
              console.warn(
                `❌ You have failing tests: ${JSON.stringify(
                  failures.map((f) => f.test.name)
                )}`
              );
              process.exit(-1);
            } else {
              console.log("✅ All tests passed ");
              process.exit(0);
            }
          }
        );
      }
    );
  });
};
