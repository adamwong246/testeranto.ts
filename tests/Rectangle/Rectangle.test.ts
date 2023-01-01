import assert from "assert";

import {
  TesterantoFactory,
} from "../../src/index";

import Rectangle from "./Rectangle";

import { features } from "../testerantoFeatures.test";

type WhenShape = any;
type ThenShape = any;
type TestResource = never;
type Input = Rectangle;

export const RectangleTesteranto =
  TesterantoFactory<
    {
      suites: {
        Default: string;
      };
      givens: {
        Default;
        WidthOfOneAndHeightOfOne;
        WidthAndHeightOf: [number, number];
      };
      whens: {
        HeightIsPubliclySetTo: [number];
        WidthIsPubliclySetTo: [number];
        setWidth: [number];
        setHeight: [number];
      };
      thens: {
        AreaPlusCircumference: [number];
        circumference: [number];
        getWidth: [number];
        getHeight: [number];
        area: [number];
        prototype: [string];
      };
      checks: {
        Default;
        WidthOfOneAndHeightOfOne;
        WidthAndHeightOf: [number, number];
      };
    },
    Input,
    Input,
    Rectangle,
    Rectangle,
    WhenShape,
    ThenShape,
    TestResource,
    unknown
  >(
    Rectangle.prototype,
    (Suite, Given, When, Then, Check) => {
      return [
        Suite.Default(
          "Testing the Rectangle class",
          [
            Given.Default(
              "test 1",
              [features.hello],
              [When.setWidth(4), When.setHeight(9)],
              [Then.getWidth(4), Then.getHeight(9)]
            ),

            Given.WidthOfOneAndHeightOfOne(
              "test 2",
              [],
              [When.setWidth(4), When.setHeight(5)],
              [
                Then.getWidth(4),
                Then.getHeight(5),
                Then.area(20),
                Then.AreaPlusCircumference(38),
              ]
            ),
            Given.WidthOfOneAndHeightOfOne(
              "test 3",
              [features.hola],
              [When.setHeight(4), When.setWidth(3)],
              [Then.area(12)]
            ),
            Given.WidthOfOneAndHeightOfOne(
              "test 4",
              [features.hola],
              [
                When.setHeight(3),
                When.setWidth(4),
                When.setHeight(5),
                When.setWidth(6),
              ],
              [Then.area(30), Then.circumference(22)]
            ),
            Given.WidthOfOneAndHeightOfOne(
              "test 5",
              [features.gutentag, features.aloha],
              [When.setHeight(3), When.setWidth(4)],
              [
                Then.getHeight(3),
                Then.getWidth(4),
                Then.area(12),
                Then.circumference(14),
              ]
            ),
          ],

          [
            // Check.Default(
            //   "imperative style",
            //   async ({ PostToAdd }, { TheNumberIs }) => {
            //     const a = await PostToAdd(2);
            //     const b = parseInt(await PostToAdd(3));
            //     await TheNumberIs(b);
            //     await PostToAdd(2);
            //     await TheNumberIs(7);
            //     await PostToAdd(3);
            //     await TheNumberIs(10);
            //     assert.equal(await PostToAdd(-15), -5);
            //     await TheNumberIs(-5);
            //   }
            // ),
          ]
        ),
      ];
    },

    {
      Suites: {
        Default: "a default suite",
      },

      Givens: {
        Default: () =>
          new Rectangle(),
        WidthOfOneAndHeightOfOne: () =>
          new Rectangle(1, 1),
        WidthAndHeightOf: (width, height) =>
          new Rectangle(width, height),
      },

      Whens: {
        HeightIsPubliclySetTo: (height) => (rectangle) =>
          (rectangle.height = height),
        WidthIsPubliclySetTo: (width) => (rectangle) =>
          (rectangle.width = width),
        setWidth: (width) => (rectangle) =>
          rectangle.setWidth(width),
        setHeight: (height) => (rectangle) =>
          rectangle.setHeight(height),
      },

      Thens: {
        AreaPlusCircumference: (combined) => (rectangle) => {
          assert.equal(
            rectangle.area() + rectangle.circumference(),
            combined
          );
        },
        getWidth: (width) => (rectangle) =>
          assert.equal(rectangle.width, width),

        getHeight: (height) => (rectangle) =>
          assert.equal(rectangle.height, height),

        area: (area) => (rectangle) => assert.equal(rectangle.area(), area),

        prototype: (name) => (rectangle) => assert.equal(1, 1),
        // throw new Error("Function not implemented.")

        circumference: (circumference) => (rectangle) =>
          assert.equal(rectangle.circumference(), circumference),
      },

      Checks: {
        /* @ts-ignore:next-line */
        AnEmptyState: () => {
          return {}
        },
      },
    },
    "na",
    {
      andWhen: async function (renderer, actioner: any, testResource: never) {
        actioner()(renderer)
        return renderer;
      },
    },
    __filename
  )

export { };