import { ArchiveType } from "../types";

const trimArchiveOver13months = (archive: ArchiveType[]) => {
  if (archive.length > 13) {
    archive.splice(13, archive.length - 13);
  }
  return archive;
};

export default trimArchiveOver13months;
