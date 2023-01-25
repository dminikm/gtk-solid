import { Gtk3 } from 'node-gtk';

export namespace JSX {
  interface ElementChildrenAttribute {
    children: {};
  }

  interface Widget {
    widthRequest?: number;
    heightRequest?: number;

    hexpand?: boolean;
    vexpand?: boolean;

    valign?: Gtk3.Align;
    halign?: Gtk3.Align;

    margin?: number;
  }

  interface ContainerElement<T extends Gtk3.Widget = Gtk3.Widget>
    extends Widget {
    children?: T[];
  }

  interface BinElement<T extends Gtk3.Widget = Gtk3.Widget>
    extends Omit<ContainerElement<T>, 'children'> {
    children?: T;
  }

  interface Orientable {
    orientation?: Gtk3.Orientation;
  }

  interface IntrinsicElements {
    button: BinElement & { onClicked?: (ev: unknown) => void };
    window: { onShow?: (ev: unknown) => void } & {
      title?: string;
    } & ContainerElement;
    label: { children?: string[] | string };

    'flow-box': ContainerElement<Gtk3.FlowBoxChild> & Orientable;
    'flow-box-child': BinElement;
    'scrolled-window': BinElement;

    entry: Widget & {
      text?: string;
      onChanged?: (ev: unknown) => void;
      onActivate?: () => void;
    };
    box: ContainerElement<Gtk3.Box> & Orientable;
  }
}
