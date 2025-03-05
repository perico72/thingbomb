/*
    Blooft
    Copyright (C) 2024-present George Stone

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    https://github.com/blooft-app/blooft
*/

async function checkIfUrlIsAlreadySaved(url) {
  return new Promise((resolve) => {
    chrome.storage.local.get({ dataUrls: [] }, (result) => {
      result.dataUrls.forEach((item) => {
        if (item.includes(url)) {
          resolve(true);
        }
      });
      resolve(false);
    });
  });
}

const saveDataUrl = () => {
  document.querySelectorAll("button[data-new-url]").forEach(async (button) => {
    const dataNewUrls = JSON.parse(button.getAttribute("data-new-url") || "[]");
    const dataUrl = dataNewUrls.length
      ? dataNewUrls[dataNewUrls.length - 1]
      : null;
    const dataTitle = button.getAttribute("data-title") || "";
    const dataId = button.getAttribute("data-id") || "";

    if (!dataUrl) return;

    button.setAttribute("data-url", dataUrl);
    const storageEntry = dataTitle
      ? `${dataTitle}{<>}${dataId}{<>}${dataUrl}`
      : dataUrl;
    const isUrlAlreadySaved = await checkIfUrlIsAlreadySaved(dataUrl);

    if (dataUrl.startsWith("data:text/css;base64,")) {
      button.disabled = false;
      button.innerHTML = isUrlAlreadySaved
        ? "Remove from Blooft"
        : "Add to Blooft";
    }

    button.addEventListener("click", async () => {
      const isSaved = await checkIfUrlIsAlreadySaved(dataUrl);
      chrome.storage.local.get({ dataUrls: [] }, (result) => {
        let dataUrls = result.dataUrls;

        if (isSaved) {
          dataUrls = dataUrls.filter((item) => !item.includes(dataUrl));
          button.innerHTML = "Add to Blooft";
        } else {
          dataUrls.push(storageEntry);
          button.innerHTML = "Remove from Blooft";
        }

        chrome.storage.local.set({ dataUrls });
        button.disabled = false;
      });
    });
  });
};

saveDataUrl();
