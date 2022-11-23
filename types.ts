export interface IElement {
  id: string;
  type: string;
  source: string;
  target: string;
  parent?: string;
  label: string;
  secondaryId?: string;
  w: number;
  h: number;
  x: number;
  y: number;
}

export interface IOriginElement {
  id: string;
  type: string;
  source: string;
  target: string;
  data: {
    parent?: string;
    secondaryId?: string;
    label: string;
    customWidth: number;
    customHeight: number;
  };
  position: {
    x: number;
    y: number;
  };

  __rf: {
    position: {
      x: number;
      y: number;
    };
    height: number;
    width: number;
  };
}
