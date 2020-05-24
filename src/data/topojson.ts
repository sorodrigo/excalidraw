import { fileOpen } from "browser-nativefs";
import { feature } from "topojson";
import { Topology } from "topojson-specification";
import { FeatureCollection } from "geojson";
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
  const { features } = feature(
    topojson,
    // @ts-ignore
    topojson.objects[Object.keys(topojson.objects)[0]],
  ) as FeatureCollection;
  const [{ geoPath }, { geoEqualEarth }] = await Promise.all([
    import("d3"),
    import("d3-geo"),
  ]);

  const elements: ExcalidrawElement[] = features.flatMap((feature) => {
    const projection = geoEqualEarth().center([20, 0]);
    const makeDirections = geoPath(projection);
    const path = makeDirections(feature);
    if (path) {
      const element = ({
        id: feature.id,
        type: "geometry",
        path,
        height: window.innerHeight / 4,
        width: window.innerWidth / 3,
        x: 0,
        y: 0,
        strokeColor: "#000000",
        backgroundColor: "transparent",
        fillStyle: "hachure",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        isDeleted: false,
      } as unknown) as ExcalidrawElement;
      return element;
    }
    return [];
  });

  return restore(elements, null);
};
