import { readFile } from "node:fs/promises";
import path from "node:path";
import axios from "axios";
import { input, confirm } from "@inquirer/prompts";
import googleService from "./googleService.js";

const FOLDER_NAME = "CLI Uploader";

const cliUploader = async () => {
  try {
    await googleService.auth();

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

    let folderId = await googleService.getFolderId(FOLDER_NAME);
    if (!folderId) {
      const newFolder = await confirm({
        message: `Folder with name ${FOLDER_NAME} not found. Would you like to create it?\n (if you don't want to create it then the image will be uploaded to the root directory of your google drive)`,
      });
      if (newFolder) {
        const createdFolder = await googleService.createFolder(FOLDER_NAME);
        folderId = createdFolder.id;
      }
    }

    const image = await readFile(imagePath);
    const file = await googleService.uploadFile(
      `${name}${ext}`,
      image,
      folderId
    );

    let fileLink = await googleService.getFileLink(file.id);

    const short = await confirm({
      message: "Would you like to shorten your link?",
      default: false,
    });

    if (short) {
      fileLink = await getTinyUrl(fileLink);
    }

    console.log(`Your ${short ? "shorten" : ""} link is: ${fileLink}`);
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

cliUploader();
