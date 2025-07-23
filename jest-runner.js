const fs = require('fs');
const path = require('path');
const Module = require('module');

const tests = [];
const mockModules = new Map();
const originalRequire = Module.prototype.require;

Module.prototype.require = function(name) {
  if (mockModules.has(name)) {
    return mockModules.get(name);
  }
  return originalRequire.apply(this, arguments);
};

// Simple test definitions
global.describe = (_name, fn) => fn();

global.it = (name, fn) => {
  tests.push({ name, fn });
};

// Expect implementation
function expect(received) {
  return {
    toBe(expected) {
      if (received !== expected) {
        throw new Error(`Expected ${expected} but received ${received}`);
      }
    },
    toHaveBeenCalledWith(...args) {
      if (!received || !received.mock) {
        throw new Error('Expected a mocked function');
      }
      const calls = received.mock.calls;
      const found = calls.some(call => JSON.stringify(call) === JSON.stringify(args));
      if (!found) {
        throw new Error(
          `Expected to have been called with ${JSON.stringify(args)} but was called with ${JSON.stringify(calls)}`
        );
      }
    },
  };
}

global.expect = expect;

global.jest = {
  fn(impl) {
    const fn = (...args) => {
      fn.mock.calls.push(args);
      if (fn.mock.impl) {
        return fn.mock.impl(...args);
      }
    };
    fn.mock = { calls: [], impl };
    fn.mockResolvedValue = val => {
      fn.mock.impl = () => Promise.resolve(val);
    };
    fn.mockImplementation = newImpl => {
      fn.mock.impl = newImpl;
    };
    return fn;
  },
  mock(moduleName, factory) {
    const stub = factory ? factory() : { get: jest.fn() };
    mockModules.set(moduleName, stub);
    return stub;
  },
};

async function run() {
  const dir = path.join(__dirname, 'services', '__tests__');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.test.js'));
  for (const file of files) {
    require(path.join(dir, file));
  }

  let passed = 0;
  for (const t of tests) {
    try {
      await t.fn();
      console.log(`\x1b[32m✓\x1b[0m ${t.name}`);
      passed++;
    } catch (err) {
      console.error(`\x1b[31m✗ ${t.name}\x1b[0m`);
      console.error(err);
    }
  }
  console.log(`${passed}/${tests.length} tests passed`);
  if (passed !== tests.length) process.exit(1);
}

run();
