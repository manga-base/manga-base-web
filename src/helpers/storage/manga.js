const mangaKey = "manga";

export const setStorageMangas = (mangas) => {
  mangas.forEach((manga) => {
    sessionStorage.setItem(`${mangaKey}-${manga.id}`, JSON.stringify(manga));
  });
};

export const setManga = (mangaId, mangaData) => {
  sessionStorage.setItem(`${mangaKey}-${mangaId}`, JSON.stringify(mangaData));
};

export const getManga = (mangaId) => {
  return JSON.parse(sessionStorage.getItem(`${mangaKey}-${mangaId}`));
};

export const deleteManga = (mangaId) => {
  sessionStorage.removeItem(`${mangaKey}-${mangaId}`);
};

export const getAllMangas = () => {
  var mangas = [];
  for (const key in sessionStorage) {
    if (Object.hasOwnProperty.call(sessionStorage, key)) {
      if (/manga-/.test(key)) mangas.push(JSON.parse(sessionStorage[key]));
    }
  }
  return mangas;
};
