import { fileOpen } from "browser-nativefs";
import { Topology } from "topojson-specification";
import { MultiPolygon } from "geojson";
import { ExcalidrawElement } from "../element/types";
import { parseBlob } from "./blob";
import { restore } from "./restore";

export const loadFromTopoJSON = async () => {
  const blob = await fileOpen({
    extensions: ["topojson", "json"],
    mimeTypes: ["application/json"],
  });
  const text = await parseBlob(blob);
  const topojson: Topology = JSON.parse(text);

  // topojson-client named exports are not declared in @types/topojson-client
  // @ts-ignore
  const [{ merge }, { geoPath, geoEqualEarth }] = await Promise.all([
    import("topojson-client"),
    import("d3-geo"),
  ]);
  const geo: MultiPolygon = merge(
    topojson,
    // @ts-ignore
    topojson.objects[Object.keys(topojson.objects)[0]].geometries,
  );

  const elements: ExcalidrawElement[] = [];
  const projection = geoEqualEarth().center([20, 0]);
  const makeDirections = geoPath(projection);
  const path = makeDirections(geo);
  if (path) {
    const element = ({
      id: "geo",
      type: "geometry",
      path,
      height: 515,
      width: 920,
      x: 300,
      y: 100,
      strokeColor: "#000000",
      backgroundColor: "transparent",
      fillStyle: "hachure",
      strokeWidth: 1,
      strokeStyle: "solid",
      roughness: 1,
      opacity: 100,
      isDeleted: false,
    } as unknown) as ExcalidrawElement;
    elements.push(element);
  }

  return restore(elements, null);
};
