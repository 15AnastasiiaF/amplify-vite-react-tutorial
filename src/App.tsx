import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();

  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [helloResult, setHelloResult] = useState<string | null>(null);
  
  useEffect(() => {
    fetchTodos();
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => {
        setTodos([...items]);
      },
    }); // This will subscribe to real-time updates for the Todo model. 

    return () => sub.unsubscribe();
  }, []);

  // function createTodo() {
  //   client.models.Todo.create({ content: window.prompt("Todo content") });
  // }

  const createTodo = async () => {
    await client.models.Todo.create({
      content: window.prompt("What do you need to do?"),
      isDone: false,
    });

    //fetchTodos();
  }

  const fetchTodos = async () => {
    const { data: items } = await client.models.Todo.list();
    console.log("Todos from list: ", items);
    //setTodos(items);
  };
    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  async function sayHello() {
    const result = await client.queries.sayHello({
      name: "Amplify", 
    });
    console.log("result.data", result.data);
    setHelloResult(result.data);
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li onClick={() => deleteTodo(todo.id)} key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
      </div>

      <button onClick={signOut}>Sign out</button>

      <button onClick={sayHello}>Say Hello</button>
      {helloResult && <p>{helloResult}</p>}
      
    </main>
  );
}

export default App;
