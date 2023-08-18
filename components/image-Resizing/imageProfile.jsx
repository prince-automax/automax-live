import Resizer from "react-image-file-resizer";

export const ResizeImage = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      570,
      570,
      "JPEG",
      100,
      0,
      (uri) => {
        const blob = new Blob([uri], { type: "image/jpeg" });
        const newFile = new File([blob], file.name, { type: "image/jpeg" });
        resolve(newFile);
      },
      "blob"
    );
  });
