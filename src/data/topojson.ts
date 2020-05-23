import { fileOpen } from "browser-nativefs";
import { parseBlob } from "./blob";
import { feature } from "topojson";
import { Topology } from "topojson-specification";
import { FeatureCollection } from "geojson";

export const loadFeaturesFromTopoJSON = async () => {
  const blob = await fileOpen({
    extensions: ["topojson"],
    mimeTypes: ["application/json"],
  });
  const text = await parseBlob(blob);
  const topojson: Topology = JSON.parse(text);
  const { features } = feature(
    topojson,
    topojson.objects[Object.keys(topojson.objects)[0]],
  ) as FeatureCollection;
  return features;
};
