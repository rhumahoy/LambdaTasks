import { readFile } from "node:fs/promises";
import path from "node:path";
import axios from "axios";
import { input, confirm } from "@inquirer/prompts";

const cliUploader = async () => {
  try {
    const inputData = await input({
      message:
        "Drag and drop your image to terminal and press ENTER for upload",
    });

    const imagePath = inputData.trim().replace(/['"]/g, "");
    let { name, ext } = path.parse(imagePath);

    const rename = await confirm({
      message: `You uploading the image with name: ${name}. Would you like to rename it?`,
      default: false,
    });

    if (rename) {
      name = await input({
        message: "Enter new image name",
      });
    }

    const image = await readFile(imagePath);
  } catch (e) {
    throw new Error(e.message);
  }
};

async function getTinyUrl(url) {
  const token = "ydNFokIJOGFu0lbauXUm0JPu35k2yv0QCtHzcIQUGDVoSoTTGUeE08mCl8U2";

  try {
    const { data } = await axios.post(
      "https://api.tinyurl.com/create",
      {
        url,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.data.tiny_url;
  } catch (e) {
    throw new Error(e.message);
  }
}
