import { Gtk, init, main, render } from 'gtk-renderer';
import { createSignal, For, Show } from 'solid-js';
import fetch from 'node-fetch';
import { JSX } from 'gtk-renderer/jsx-runtime';
import { Gtk3 } from 'node-gtk';

interface TodoItem {
  id: number;
  name: string;
}

let max_id = 1;

function App() {
  const [value, setValue] = createSignal('');
  const [todos, setTodos] = createSignal<TodoItem[]>([]);

  const handleAddTodo = () => {
    setTodos((todos) => [...todos, { id: max_id++, name: value() }]);
    setValue('');
  };

  const handleRemoveTodo = (todo: TodoItem) => () => {
    console.log(`Removing todo with id: ${todo.id}`);

    setTodos((todos) =>
      todos.filter((item) => {
        console.log(
          `Checking: ${todo.id} = ${item.id}? ${todo.id === item.id}`
        );
        return item.id !== todo.id;
      })
    );
  };

  return (
    <window
      title={'Todo App!'}
      onShow={main}
      widthRequest={800}
      heightRequest={600}
    >
      <box orientation={Gtk.Orientation.VERTICAL} margin={8}>
        <box orientation={Gtk.Orientation.HORIZONTAL}>
          <entry
            text={value()}
            onChanged={setValue}
            onActivate={handleAddTodo}
            hexpand
          />
          <button onClicked={handleAddTodo}>
            <label>Add todo!</label>
          </button>
        </box>
        <box orientation={Gtk.Orientation.VERTICAL} vexpand>
          <scrolled-window
            valign={Gtk.Align.FILL}
            halign={Gtk.Align.FILL}
            vexpand
          >
            <box orientation={Gtk.Orientation.VERTICAL} vexpand margin={12}>
              <For each={todos()}>
                {(todo) => (
                  <box orientation={Gtk.Orientation.HORIZONTAL} margin={12}>
                    <box hexpand>
                      <label>
                        {todo.id.toString()} | {todo.name}
                      </label>
                    </box>
                    <button onClicked={handleRemoveTodo(todo)}>
                      <label>Remove</label>
                    </button>
                  </box>
                )}
              </For>
            </box>
          </scrolled-window>
        </box>
      </box>
    </window>
  );
}

init();
render(() => <App />);
