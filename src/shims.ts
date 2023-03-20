import { Buffer } from "buffer";

// adding polyfills for nodejs
Object.assign(self, {
  global: self,
  Buffer,
});