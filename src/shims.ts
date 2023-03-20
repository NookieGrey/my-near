// @ts-ignore
import * as process from "process";
import { Buffer } from "buffer";

// adding polyfills for nodejs
Object.assign(self, {
  process,
  global: self,
  Buffer,
});