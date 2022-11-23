import fs from "fs";
import path from "path";
import { DrawIoConvertor } from "./draw-io-convertor";
import { drawIoNormalize } from "./draw-io-normilize";
import { IOriginElement } from "./types";

const data = JSON.parse(fs.readFileSync("./src/data.json", "utf-8"));

const elements = data.elements.map((e: IOriginElement) => drawIoNormalize(e));
const c = new DrawIoConvertor(elements);
const result = c.convert();

fs.writeFileSync("result.drawio", result);
