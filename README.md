# testeranto.ts

## teeny-tiny, tightly-typed typescript tests™

### "It's like cucumber, but for typescript."

---

```ts
class Rectangle {
  height: number;
  width: number;

  constructor(height: number = 2, width: number = 2) {
    this.height = height;
    this.width = width;
  }

  getHeight() {
    return this.height;
  }

  getWidth() {
    return this.width;
  }

  setHeight(height: number) {
    this.height = height;
  }

  setWidth(width: number) {
    this.width = width;
  }

  area(): number {
    return this.width * this.height;
  }

  circumference(): number {
    return this.width * 2 + this.height * 2;
  }
}
```

```ts
export default Rectangle;

const RectangleTesteranto = TesterantoClassicFactory<
  Rectangle,
  {
    Default: "hello";
  },
  {
    Default: [never];
    WidthOfOneAndHeightOfOne: [never];
    WidthAndHeightOf: [number, number];
  },
  {
    HeightIsPubliclySetTo: [number];
    WidthIsPubliclySetTo: [number];
    setWidth: [number];
    setHeight: [number];
  },
  {
    AreaPlusCircumference: [number];
    circumference: [number];
    getWidth: [number];
    getHeight: [number];
    area: [number];
    prototype: [string];
  }
>(Rectangle, (Suite, Given, When, Then) => {
  const RectangleSuite = Suite.Default;
  return [
    RectangleSuite([
      Given.Default(
        [When.setWidth(4), When.setHeight(9)],

        [Then.getWidth(4), Then.getHeight(9)]
      ),

      Given.WidthOfOneAndHeightOfOne(
        [When.setWidth(4), When.setHeight(5)],
        [
          Then.getWidth(4),
          Then.getHeight(5),
          Then.area(20),
          Then.AreaPlusCircumference(38),
        ]
      ),
      Given.WidthOfOneAndHeightOfOne(
        [When.setHeight(4), When.setWidth(3)],
        [Then.area(12)]
      ),
      Given.WidthOfOneAndHeightOfOne(
        [
          When.setHeight(3),
          When.setWidth(4),
          When.setHeight(5),
          When.setWidth(6),
        ],
        [Then.area(30), Then.circumference(22)]
      ),
      Given.WidthOfOneAndHeightOfOne(
        [When.setHeight(3), When.setWidth(4)],
        [
          Then.getHeight(3),
          Then.getWidth(4),
          Then.area(12),
          Then.circumference(14),
        ]
      ),
    ]),
  ];
});
```

```
Suite: Default constructor

 - idk feature -

Given: width of 1 and height of 1
 When: setWidth: 4
 When: setHeight: 9
 Then: getWidth: 4
 Then: getHeight: 9

 - idk feature -

Given: width of 1 and height of 1
 When: setWidth: 4
 When: setHeight: 5
 Then: getWidth: 4
 Then: getHeight: 5
 Then: area: 20
 Then: AreaPlusCircumference: 38

 - idk feature -

Given: width of 1 and height of 1
 When: setHeight: 4
 When: setWidth: 3
 Then: area: 12

 - idk feature -

Given: width of 1 and height of 1
 When: setHeight: 3
 When: setWidth: 4
 When: setHeight: 5
 When: setWidth: 6
 Then: area: 30
 Then: circumference: 22

 - idk feature -

Given: width of 1 and height of 1
 When: setHeight: 3
 When: setWidth: 4
 Then: getHeight: 3
 Then: getWidth: 4
 Then: area: 12
 Then: circumference: 14
```

### about

Testeranto.ts a Typescript testing framework, akin to mocha, jasmine or jest. Unlike those projects, testeranto focuses on _specifing stateful logic with strong type bindings using a gherkin syntax_.

### the good parts

Testeranto can test any statefull typescript, from individual classes to entire services, with the given-when-then format that we all know and love, and all without any dependencies- testeranto.ts is comprised entirely of <700 lines of typescript.

### the bad parts

You will need to implement your own test infrastructure. Depending on your needs, you will need to implement an interface which extends 1 of 2 classes:

- `TesterantoClassic`, when you only need to test a class

  - [Testing a class](/tests/Rectangle)

- `TesterantoBasic`, when you need to test something more complex
  - [Testing a Redux store](/tests/Redux+Reselect+React/LoginStore.test.ts)
  - [Testing a Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginSelector.test.ts)
  - [Testing a React Component with Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginPage.test.ts)
