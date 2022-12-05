# testeranto.ts

🚧 under heavy development! 🚧 I'm hoping to have a 1.0.0 release by the end of the year 🤞 but until then _caveat emptor_.

## about

Testeranto.ts an Acceptance Test Driven Development (ATDD) testing framework. Testeranto focuses on specifing stateful logic which crosses applications boundaries with strong type bindings and using an extended gherkin syntax.

### the good parts

Testeranto can very feasibly be used to test any code- a ruby HTTP server, for example. While testeranto itself and it's test implementations are typescript, the subject of the test can be any stateful software.

Testeranto allows you to test the same code in multiple ways. You can test your unbundled TS in a unit-test fashion, and also bundle that same code, then testing it through a interface like puppeteer, fetch, curl, etc. The same patterns you apply to your low level components are applied to your larger applications as well.

Testeranto exposes an extended gherkin syntax. You can use the given-when-then lingua-franca, AND you can also use an imperative `Check` which is a bit more flexible.

Testeranto.ts is very lightweight and unopinionated. It is comprised entirely of ~1000 lines of typescript, with only 1 dependency (lodash).

Testeranto is just TS- no plain text, no markdown and no regex pattern matching required.

### the bad parts

Testerano is not for testing pure functions. It's designed only to address _stateful_ logic.

Testeranto prefers TS and to be leveraged to it full potential requires at least some proficiency with the language.

Because testerano is so unopinionated, it does not provide test infrastructure. You will need to find an existing recipe or implement it yourself. Depending on your needs, you will need to implement an interface which extends 1 of 2 classes:

1] `TesterantoClassic`, when you only need to test a class

2] `TesterantoBasic`, when you need to test something more complex

### examples of test infrasuctures

- [Testing a class, with TesterantoClassic](/tests/Rectangle)
- [Testing a Redux store](/tests/Redux+Reselect+React/LoginStore.test.ts)
- [Testing a Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginSelector.test.ts)
- [Testing a React Component with Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginPage.test.ts)
- [Testing an http server with node's fetch](/tests/httpServer/http.testerano.test.ts.test.ts)
- [Testing an http server with puppeteer](/tests/httpServer/puppeteer.testeranto.test.ts)
- [Testing a Clasical react component](/tests/ClassicalReact/ClassicalReact.testeranto.test.ts)
- [Testing a Clasical react component, bundled with esbuild and tested with puppeteer with screenshots](/tests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.ts)
