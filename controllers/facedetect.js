import { Model } from "clarifai-nodejs";
import e from "express";

const faceFinder = async (imgUrl) => {
  const DETECTION_IMAGE_URL = imgUrl;
  const modelUrl = "https://clarifai.com/clarifai/main/models/face-detection";

  const detectorModel = new Model({
    url: modelUrl,
    authConfig: {
      pat: "e74940135f2a4495bcd3312d740b24b8",
    },
  });

  try {
    const detectorModelPrediction = await detectorModel.predictByUrl({
      url: DETECTION_IMAGE_URL,
      inputType: "image",
    });

    const regions = detectorModelPrediction?.[0]?.data?.regionsList;

    if (regions) {
      const boundingBoxes = regions.map((region) => {
        const top_row =
          Math.round((region.regionInfo?.boundingBox?.topRow ?? 0) * 1000) /
          1000;
        const left_col =
          Math.round((region.regionInfo?.boundingBox?.leftCol ?? 0) * 1000) /
          1000;
        const bottom_row =
          Math.round((region.regionInfo?.boundingBox?.bottomRow ?? 0) * 1000) /
          1000;
        const right_col =
          Math.round((region.regionInfo?.boundingBox?.rightCol ?? 0) * 1000) /
          1000;

        return {
          topRow: top_row,
          leftCol: left_col,
          bottomRow: bottom_row,
          rightCol: right_col,
        };
      });

      return boundingBoxes;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error running face detection:", error);
    return [];
  }
};

const faceDetect = async (req, res) => {
  const { input: imageUrl } = req.body;

  const boxes = await faceFinder(imageUrl);

  console.log("Detected boxes:", boxes);
  res.json({
    status: "success",
    receivedUrl: imageUrl,
    boxes,
  });
};

export default faceDetect;
