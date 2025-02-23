async function checkIfUrlIsAlreadySaved(url) {
  return new Promise((resolve) => {
    chrome.storage.local.get({ dataUrls: [] }, (result) => {
      resolve(result.dataUrls.some((item) => item.includes(url)));
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

    if (!dataUrl) return;

    button.setAttribute("data-url", dataUrl);
    const storageEntry = dataTitle ? `${dataTitle}{<>}${dataUrl}` : dataUrl;
    const isUrlAlreadySaved = await checkIfUrlIsAlreadySaved(dataUrl);

    if (dataUrl.startsWith("data:text/css;base64,")) {
      button.disabled = false;
      button.innerHTML = isUrlAlreadySaved
        ? "Remove from Flowtide"
        : "Add to Flowtide";
    }

    button.addEventListener("click", async () => {
      const isSaved = await checkIfUrlIsAlreadySaved(dataUrl);
      chrome.storage.local.get({ dataUrls: [] }, (result) => {
        let dataUrls = result.dataUrls;

        if (isSaved) {
          dataUrls = dataUrls.filter((item) => !item.includes(dataUrl));
          button.innerHTML = "Add to Flowtide";
        } else {
          dataUrls.push(storageEntry);
          button.innerHTML = "Remove from Flowtide";
        }

        chrome.storage.local.set({ dataUrls });
        button.disabled = false;
      });
    });
  });
};

saveDataUrl();
