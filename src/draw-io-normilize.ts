import { IElement, IOriginElement } from "./types";

export function drawIoNormalize(e: IOriginElement): IElement {
  let x = e.__rf?.position?.x;
  let y = e.__rf?.position?.y;
  let w = e.data.customWidth || e.__rf?.width;
  let h = e.data.customHeight || e.__rf?.height;

  return {
    id: e.id,
    type: e.type,
    label: e.data.label,
    source: e.source,
    target: e.target,
    parent: e.data.parent,
    secondaryId: e.data.secondaryId,
    x,
    y,
    w,
    h,
  };
}
