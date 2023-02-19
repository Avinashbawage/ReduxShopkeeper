import { useState } from "react";

import Todos from "./todo";

// Using memo will cause React to skip rendering a component if its props have not changed.
// This can improve performance.

const Example = () => {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState(["todo 1", "todo 2"]);

  const increment = () => {
    setCount((count) => count + 1);
  };

  return (
    <>
      <Todos todos={todos} />
      <hr />
      <div>
        Count: {count}
        <button onClick={increment}>+</button>
      </div>
    </>
  );
};

export default Example;
