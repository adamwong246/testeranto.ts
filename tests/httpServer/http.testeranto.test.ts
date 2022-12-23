import { assert } from "chai";
import http from "http";

import {TesterantoFactory} from "../../index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/testShapes";

type TestResource = "port";
type WhenShape = [url: string, paylaod: string];
type ThenShape = any;
type Input = () => http.Server;
type Subject = () => http.Server;
type InitialState = unknown;
type Store = http.Server;
type Selection = string;

export const HttpTesteranto = <
  ITestShape extends ITTestShape
>(
  testImplementations: ITestImplementation<
    InitialState,
    Selection,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: Input
) =>
  TesterantoFactory<
    ITestShape,
    Input,
    Subject,
    Store,
    Selection,
    ThenShape,
    WhenShape,
    TestResource,
    InitialState
  >(
    testInput,
    testSpecifications,
    testImplementations,
    "port",
    {
      beforeAll: async function (input: Input): Promise<Subject> {
        return input;
      },
      beforeEach: async function (serverFactory: Subject, initialValues: any, testResource: "port"): Promise<Store> {
        const server = serverFactory();
        await server.listen(testResource);
        return server;
      },
      andWhen: async function (store: Store, actioner: any, testResource: "port"): Promise<string> {
        const [path, body]: [string, string] = actioner(store)();
        const y = await fetch(
          `http://localhost:${testResource.toString()}/${path}`,
          {
            method: "POST",
            body,
          }
        );
        return await y.text();
      },
      butThen: async function (store: Store, callback: any, testResource: "port"): Promise<string> {
        const [path, expectation]: [string, string] = callback({});
        const bodytext = await(
          await fetch(`http://localhost:${testResource.toString()}/${path}`)
        ).text();
        assert.equal(bodytext, expectation);
        return bodytext;
      },
      assertioner: function (t: WhenShape) {
        return t;
      },
      teardown: function (server: Store, ndx: number): unknown {
        return new Promise((res) => {
          server.close(() => {
            res(server)
          })
        })
      },
      actionHandler: function (b: (...any: any[]) => any) {
        return b
      }
    },   
  )
