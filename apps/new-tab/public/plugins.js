if (typeof chrome !== "undefined" && chrome.storage?.local) {
  chrome.storage.local.get({ dataUrls: [] }, (result) => {
    console.log(result);
    const dataUrls = result.dataUrls;

    dataUrls.forEach((dataUrl) => {
      let fullHref;

      if (dataUrl.includes("{<>}")) {
        const [title, href] = dataUrl.split("{<>}");
        fullHref = href;
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = fullHref;
      document.head.appendChild(link);
    });
  });
}
