import gi, { Gtk3 } from 'node-gtk';
export const Gtk = gi.require('Gtk', '3.0');
import { createRenderer } from 'solid-js/universal';

const textNodes: Map<Gtk3.Widget, TextNode[]> = new Map();

class TextNode {
  public text: string;
  public parent?: Gtk3.Widget;

  constructor(text: string) {
    this.text = text;
  }

  public setParent(parent?: Gtk3.Widget, anchor?: TextNode) {
    if (this.parent) {
      textNodes.set(
        this.parent,
        textNodes.get(this.parent)!.filter((node) => node !== this)
      );
    }

    if (parent) {
      this.parent = parent;
      let nodes =
        textNodes.get(this.parent) ??
        textNodes.set(this.parent, []).get(this.parent)!;

      if (anchor) {
        const anchorIndex = nodes.findIndex((node) => node === anchor);
        nodes.splice(anchorIndex, 0, this);
        textNodes.set(this.parent, nodes);
      } else {
        textNodes.set(this.parent, [...nodes, this]);
      }
    }
  }

  public setText(text: string) {
    this.text = text;
    if (this.parent) {
      const text = textNodes
        .get(this.parent)!
        .map((node) => node.text)
        .join('');
      try {
        // @ts-ignore
        this.parent.setText(text);
      } catch (e) {
        console.error(e);
      }
    }
  }
}

function camelToKebab(text: string): string {
  return text
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase();
}

const {
  render,
  effect,
  memo,
  createComponent,
  createElement,
  createTextNode,
  insertNode,
  insert,
  spread,
  setProp,
  mergeProps,
} = createRenderer<Gtk3.Widget | TextNode>({
  createElement(name) {
    switch (name) {
      case 'window':
        return new Gtk.Window();

      case 'label':
        return new Gtk.Label();

      case 'button':
        return new Gtk.Button();

      case 'flow-box':
        return new Gtk.FlowBox();

      case 'flow-box-child':
        return new Gtk.FlowBoxChild();

      case 'scrolled-window':
        return new Gtk.ScrolledWindow();

      case 'entry':
        return new Gtk.Entry();

      case 'box':
        return new Gtk.Box();

      default:
        throw new Error('Unknown element created');
    }
  },
  createTextNode(value) {
    return new TextNode(value);
  },
  replaceText(textNode, value) {
    if (textNode instanceof TextNode) {
      textNode.setText(value);
    }
  },
  setProperty(node, name, value) {
    if (node instanceof TextNode) return;

    if (name.startsWith('on')) {
      const eventName = camelToKebab(name.slice(2));

      if (node instanceof Gtk.Entry) {
        node.on(eventName, () => {
          const fn = value as any;
          fn(node.getText());
        });
      } else {
        node.on(eventName, value as any);
      }
    } else {
      if (name === 'hexpand') return node.setHexpand(value as any);
      if (name === 'vexpand') return node.setVexpand(value as any);

      node.setProperty(camelToKebab(name), value);
    }
  },
  insertNode(parent, node, anchor) {
    if (node instanceof TextNode && !(parent instanceof Gtk.Label)) {
      return;
    }

    // Remove all previous children of the bin container
    if (parent instanceof Gtk.Bin && node instanceof Gtk.Widget) {
      const child = parent.getChild();
      if (child) {
        parent.remove(child);
      }
    }

    if (node instanceof TextNode) {
      console.log(parent, node, anchor);
      if (parent instanceof TextNode) return;

      node.setParent(parent, anchor as any);
      node.setText(node.text);
      return;
    }

    if (parent instanceof Gtk.Container) {
      parent.add(node);
      node.setVisible(true);
    }
  },
  isTextNode(node) {
    return node instanceof TextNode;
  },
  removeNode(parent, node) {
    if (node instanceof TextNode) {
      return node.setParent();
    }

    if (parent instanceof Gtk.Container) {
      parent.remove(node);
      node.setVisible(false);
    }
  },
  getParentNode(node) {
    if (node instanceof TextNode) {
      return node.parent;
    }

    if (node instanceof Gtk.Widget) {
      return node.getProperty('parent') as any;
    }

    return undefined;
  },
  getFirstChild(node) {
    if (node instanceof Gtk.Container) {
      return node.getChildren()?.[0];
    }

    return undefined;
  },
  getNextSibling(node) {
    return undefined;
  },
});

export function init() {
  gi.startLoop();
  Gtk.init();
}

function customRender(code: () => Gtk3.Widget) {
  return render(() => {
    const widget = code();
    widget.showAll();
    return widget;
  }, null as any);
}

export function main() {
  setInterval(() => Gtk.main(), 100);
}

export {
  ErrorBoundary,
  For,
  Index,
  Match,
  Show,
  Suspense,
  SuspenseList,
  Switch,
} from 'solid-js';

export {
  customRender as render,
  effect,
  memo,
  createComponent,
  createElement,
  createTextNode,
  insertNode,
  insert,
  spread,
  setProp,
  mergeProps,
};
