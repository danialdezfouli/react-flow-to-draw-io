import { IElement } from "./types";

const template = (content: string) => `<mxfile host="app.diagrams.net">
  <diagram id="pKiFPjT_KWOgNsuEO2c0" name="Page-1">
    <mxGraphModel dx="795" dy="425" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        ${content}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

export class DrawIoConvertor {
  elements: IElement[];
  constructor(elements: IElement[]) {
    this.elements = elements;
  }

  person(e: IElement) {
    const id = `uncia-` + e.id;
    const x = e.x + e.w / 3;
    const y = e.y + 30;
    const value = `${e.id} - ${e.label}`;

    return `<mxCell id="${id}"  value="" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;" parent="1" vertex="1">
    <mxGeometry x="${x}" y="${y}" width="30" height="60" as="geometry" />
  </mxCell>

    <mxCell id="${id}-text" value="${value}" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="${id}" vertex="1" connectable="0">
      <mxGeometry x="0.5" y="${-40 / e.h}"  relative="1" as="geometry">
        <mxPoint as="offset" />
      </mxGeometry>
    </mxCell>
  
    `;
  }

  box(e: IElement) {
    const id = `uncia-` + e.id;
    const h = e.h;
    const w = e.w;
    const x = e.x;
    const y = e.y;
    const value = `${e.id} - ${e.label}`;
    const hasText = e.type !== "simpleInternalNode";

    const s = `<mxCell id="${id}" value="${hasText ? "" : value}" data-type="${
      e.type
    }" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry" />
        </mxCell>
      `;

    if (hasText) {
      const t = `<mxCell id="${id}-text" value="${value}" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="${id}" vertex="1" connectable="0">
        <mxGeometry x="0.5" y="${15 / h}"  relative="1" as="geometry">
          <mxPoint as="offset" />
        </mxGeometry>
        </mxCell>`;

      return s + t;
    }

    return s;
  }

  child(e: IElement) {
    const id = `uncia-` + e.id;
    const parent = this.elements.find((i) => i.id === e.parent);

    const h = e.h;
    const w = e.w;
    const x = parent ? parent.x + (parent.w / 2 - e.w / 2) : e.x;
    const y = e.y;

    // parent="uncia-${parent}"

    return `<mxCell id="${id}" value="${e.secondaryId} - ${e.label}" data-type="${e.type}" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="0" >
      <mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry" />
    </mxCell>`;
  }

  custom(i: IElement) {
    const id = `uncia-${i.id}`;
    const source = this.elements.find((e) => e.id === i.source);
    const target = this.elements.find((e) => e.id === i.target);

    if (["U", "E"].some((s) => i.id.startsWith(s)) && target && source) {
      const s = `<mxCell id="${id}" value="" style="endArrow=classic;html=1;rounded=0;endFill=0;startArrow=none;startFill=1;exitX=0.5;exitY=0.5;exitDx=0;exitDy=0;exitPerimeter=0;" edge="1" parent="1" source="uncia-${source.id}" target="uncia-${target.id}">
    <mxGeometry width="50" height="50" relative="1" as="geometry">
      <mxPoint as="sourcePoint" />
      <mxPoint as="targetPoint" />
    </mxGeometry>
  </mxCell>
`;

      const text = `<mxCell id="${id}-text" value="${i.id} (${i.label})" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" parent="${id}" vertex="1" connectable="0">
<mxGeometry x="0" relative="1" as="geometry">
  <mxPoint as="offset" />
</mxGeometry>
</mxCell>`;

      return s + text;
    }

    return null;
  }

  render(elements: IElement[]) {
    return elements
      .map((i) => {
        switch (i.type) {
          case "personNode":
            return this.person(i);

          case "externalCluster":
          case "networkZone":
          case "simpleInternalNode":
          case "simpleExternalNode":
          case "complexInternalNode":
          case "complexExternalNode":
            return this.box(i);

          case "externalAdditional":
            return this.child(i);

          case "custom": {
            return this.custom(i);
          }

          default:
            return null;
        }
      })
      .filter((i) => Boolean(i))
      .join("\n");
  }

  convert() {
    let content = "";

    const groupA = this.elements.filter(
      (i) => !["externalAdditional"].includes(i.type)
    );

    const groupB = this.elements.filter((i) =>
      ["externalAdditional"].includes(i.type)
    );

    content += this.render(groupA);
    content += this.render(groupB);

    return template(content);
  }
}
