// using file for both, constants and types

export const __backend__ = process.env.NEXT_PUBLIC_BACKEND_URL
  ? process.env.NEXT_PUBLIC_BACKEND_URL
  : "http://localhost:8081/";

export type Interface = {
  name: string;
  identifier: string;
};

export type RoutingEntry = {
  gateway: string;
  target: string;
};

export type Router = {
  identifier: string;
  name: string;
  interfaces: Interface[];
  table: RoutingEntry[];
};

export enum Selectable {
  NONE = 0,
  ROUTER = 1,
  LINK = 2,
}

export type Selected = {
  type: Selectable;
  [key: string]: any;
};
