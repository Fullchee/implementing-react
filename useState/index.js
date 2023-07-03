// import ReactX from "./useState";

// const { useState } = ReactX;

// TODO: move to `ReactX.js`
// why is ReactX an IIFE: 'private' variables
// pattern that jQuery uses
// to ensure that undefined hasn't been overridden
const ReactX = (() => {
  let hooks = [];
  let i = 0;
  const useState = (initialState) => {
    // need to declare localIndex to keep the init value in `setState`
    const localIndex = i;
    i++;
    // poor man's ReactX:assume: undefined = uninitialized
    // React uses Symbols to check if it's defined
    if (typeof hooks[localIndex] === "undefined") {
      hooks[localIndex] = initialState;
    }
    const setState = (newState) => {
      hooks[localIndex] = newState;
    };
    const result = [hooks[localIndex], setState];
    return result;
  };

  const useEffect = (callback, dependencies) => {
    // don't need to store localIndex in a local value
    // we don't use it in a callback like `setState`
    const localIndex = i;
    i++;

    let hasChanged = true;
    // TODO: isn't this initially undefined?
    let oldDependencies = hooks[localIndex];
    if (oldDependencies) {
      hasChanged = false;
      for (let j = 0; j < dependencies.length; j++) {
        if (!Object.is(dependencies[j], oldDependencies[j])) {
          hasChanged = true;
        }
      }
    }
    if (hasChanged) {
      callback();
    }

    hooks[i] = dependencies || [];
    i++;
  };

  const resetStateIndex = () => {
    i = 0;
  };
  return {
    useState,
    useEffect,
    resetStateIndex, // only in our poor man's react, would be handled by
  };
})();

const { useState, useEffect, resetStateIndex } = ReactX;

const Component = () => {
  const [count, setCount] = useState(1);
  console.log(count);

  // needed to prevent infinite loop
  if (count !== 2) {
    setCount(2);
  }
};

Component(); // render

resetStateIndex();

Component(); // render
