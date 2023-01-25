declare namespace Gtk3 {
  type EventHandler<T> = (ev: T) => void;

  export enum Orientation {
    HORIZONTAL,
    VERTICAL,
  }

  interface GtkOrientable {
    getOrientation(): Orientation;
    setOrientation(orientation: Orientation): void;
  }

  export enum Align {
    FILL,
    START,
    END,
    CENTER,
    BASELINE,
  }

  export class GObject {
    public getProperty(propertyName: string): unknown;
    public setProperty(propertyName: string, value: unknown): void;

    public on(
      ev: string,
      handler: EventHandler<unknown>,
      after?: boolean
    ): GObject;
    public off(ev: string, handler: EventHandler<unknown>): GObject;
    public once(
      ev: string,
      handler: EventHandler<unknown>,
      after?: boolean
    ): GObject;
    public emit(ev: string, event: unknown): void;
  }

  export class Widget extends GObject {
    public showAll(): void;
    public show(): void;

    getVisible(): boolean;
    setVisible(visible: boolean): void;

    setHexpand(val: boolean): void;
    getHexpand(): boolean;

    setVexpand(val: boolean): void;
    getVexpand(): void;
  }

  export class Container extends Widget {
    public add(widget: Widget): void;
    public remove(widget: Widget): void;
    public foreach<T>(cb: (data: T) => void, data: T): void;
    public getChildren(): Widget[];
  }

  export class Misc extends Widget {}

  export class Bin extends Container {
    public getChild(): Widget | null | undefined;
  }

  export class ScrolledWindow extends Bin {}

  export class FlowBox extends Container implements GtkOrientable {
    getOrientation(): Orientation;
    setOrientation(orientation: Orientation): void;
  }

  export class Box extends Container implements GtkOrientable {
    getOrientation(): Orientation;
    setOrientation(orientation: Orientation): void;
  }

  export class FlowBoxChild extends Bin {}

  export class Window extends Bin {
    public setDefaultSize(width: number, height: number): void;
  }

  export class Label extends Misc {
    public constructor(options?: { label: string });
  }

  export class Button extends Bin {}

  export class Entry extends Widget {
    public getText(): string;
    public setText(text: string): void;
  }

  interface Library {
    init(): void;
    mainQuit(): void;
    main(): void;

    Object: typeof GObject;
    Widget: typeof Widget;
    Container: typeof Container;
    Misc: typeof Misc;
    Bin: typeof Bin;

    Window: typeof Window;
    Label: typeof Label;
    Button: typeof Button;

    FlowBox: typeof FlowBox;
    FlowBoxChild: typeof FlowBoxChild;

    Orientation: typeof Orientation;
    Align: typeof Align;
    ScrolledWindow: typeof ScrolledWindow;

    Entry: typeof Entry;
    Box: typeof Box;
  }
}

declare namespace GInterface {
  export function require(library: 'Gtk', version: '3.0'): Gtk3.Library;
  export function startLoop(): void;
}

export default GInterface;
export { Gtk3 };
