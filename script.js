const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 4500);
}

const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuButton?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

// Apply each gallery card's real photo as its background image
const galleryCards = document.querySelectorAll(".gallery-card");
galleryCards.forEach((card) => {
  const image = card.dataset.image;
  if (image) {
    card.style.backgroundImage = `url("${image}")`;
  }
});

const filterButtons = document.querySelectorAll(".filter");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    galleryCards.forEach((card) => {
      card.style.display = filter === "all" || card.dataset.category === filter ? "flex" : "none";
    });
  });
});

const galleryModal = document.querySelector("#gallery-modal");
const modalArt = document.querySelector("#modal-art");
const modalTitle = document.querySelector("#modal-title");
const modalCategory = document.querySelector("#modal-category");
galleryCards.forEach((card) => {
  card.addEventListener("click", () => {
    modalTitle.textContent = card.dataset.title;
    modalCategory.textContent = card.querySelector("span").textContent;
    if (card.dataset.image) {
      modalArt.style.backgroundImage = `url("${card.dataset.image}")`;
    }
    galleryModal.classList.add("open");
    document.body.style.overflow = "hidden";
  });
});
function closeModal() {
  galleryModal.classList.remove("open");
  document.body.style.overflow = "";
}
document.querySelector(".modal-close")?.addEventListener("click", closeModal);
galleryModal?.addEventListener("click", (event) => {
  if (event.target === galleryModal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

const quotes = [
  ["The fitting was perfect and the quality is amazing. My scrub sets are so comfortable!", "Dr. Amaka O.", "Custom Scrub Set", "AO"],
  ["LUNOSENSTITCHES never disappoints. I always get compliments every time I wear my outfits.", "Blessing O.", "Women's Wear", "BO"],
  ["My daughter's birthday dress was beautiful. The details and finishing were top-notch.", "Jennifer A.", "Kids' Wear", "JA"],
];
let quoteIndex = 0;
const quoteText = document.querySelector("#quote-text");
const quoteCount = document.querySelector("#quote-count");
const avatar = document.querySelector(".avatar");
const author = document.querySelector(".quote-author strong");
const product = document.querySelector(".quote-author small");
function updateQuote(nextIndex) {
  quoteIndex = (nextIndex + quotes.length) % quotes.length;
  const [text, name, service, initials] = quotes[quoteIndex];
  quoteText.textContent = text;
  author.textContent = name;
  product.textContent = service;
  avatar.textContent = initials;
  quoteCount.textContent = `0${quoteIndex + 1} / 0${quotes.length}`;
}
document.querySelectorAll("[data-quote]").forEach((button) => {
  button.addEventListener("click", () => updateQuote(quoteIndex + (button.dataset.quote === "next" ? 1 : -1)));
});

document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    const service = link.dataset.service;
    const select = document.querySelector('select[name="service"]');
    if (select) select.value = service;
  });
});

/* ------------------------------------------------------------------
   INSPIRATION IMAGE: live preview + keyless public upload
   ------------------------------------------------------------------ */

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// Render a small preview card inside the .file-label
function showImagePreview(labelEl, file) {
  if (!labelEl) return;
  let preview = labelEl.querySelector(".file-preview");
  if (!preview) {
    preview = document.createElement("div");
    preview.className = "file-preview";
    preview.style.cssText = [
      "display:flex",
      "align-items:center",
      "gap:10px",
      "margin-top:10px",
      "padding:8px",
      "border:1px solid #e7d9dc",
      "background:#fcf8f6"
    ].join(";");

    const img = document.createElement("img");
    img.className = "file-preview-img";
    img.alt = "Selected inspiration";
    img.style.cssText = [
      "width:56px",
      "height:56px",
      "object-fit:cover",
      "border-radius:3px",
      "display:block",
      "flex:0 0 auto"
    ].join(";");

    const meta = document.createElement("div");
    meta.className = "file-preview-meta";
    meta.style.cssText = "min-width:0;flex:1;font-size:11px;line-height:1.4;";

    const nameEl = document.createElement("div");
    nameEl.className = "file-preview-name";
    nameEl.style.cssText = "font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";

    const sizeEl = document.createElement("div");
    sizeEl.className = "file-preview-size";
    sizeEl.style.cssText = "color:#766a70;";

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "file-preview-clear";
    clearBtn.textContent = "\u00d7";
    clearBtn.setAttribute("aria-label", "Remove selected image");
    clearBtn.style.cssText = [
      "border:0",
      "background:#6f1f3d",
      "color:#fff",
      "width:24px",
      "height:24px",
      "border-radius:50%",
      "font-size:15px",
      "line-height:1",
      "cursor:pointer",
      "flex:0 0 auto"
    ].join(";");

    const input = labelEl.querySelector('input[type="file"]');

    clearBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (input) input.value = "";
      preview.remove();
      const hint = labelEl.querySelector(".file-hint");
      if (hint) hint.textContent = "Choose an image or fabric reference";
    });

    meta.appendChild(nameEl);
    meta.appendChild(sizeEl);
    preview.appendChild(img);
    preview.appendChild(meta);
    preview.appendChild(clearBtn);
    labelEl.appendChild(preview);

    if (input) {
      clearBtn.addEventListener("click", () => {
        if (input.files && input.files.length) input.value = "";
      });
    }
  }

  const img = preview.querySelector(".file-preview-img");
  const nameEl = preview.querySelector(".file-preview-name");
  const sizeEl = preview.querySelector(".file-preview-size");

  if (nameEl) nameEl.textContent = file.name || "Selected image";
  if (sizeEl) sizeEl.textContent = formatBytes(file.size || 0);

  if (img && file.type && file.type.indexOf("image/") === 0) {
    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target.result;
      img.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else if (img) {
    img.style.display = "none";
  }

  const hint = labelEl.querySelector(".file-hint");
  if (hint) hint.textContent = "Image selected \u2713";
}

// Wire up the file input so selecting a file gives immediate feedback
const inspirationInput = document.querySelector('input[name="inspiration"]');
if (inspirationInput) {
  inspirationInput.addEventListener("change", () => {
    const file = inspirationInput.files && inspirationInput.files[0];
    if (!file) return;

    if (!file.type || file.type.indexOf("image/") !== 0) {
      showToast("Please choose an image file (JPG, PNG, or WEBP).");
      inspirationInput.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      showToast(`That image is ${formatBytes(file.size)}. Please use one under ${formatBytes(MAX_IMAGE_BYTES)}.`);
      inspirationInput.value = "";
      return;
    }

    showImagePreview(inspirationInput.closest(".file-label"), file);
  });
}

// Upload to a keyless public host. Returns a public URL or "" on failure.
async function uploadToCatbox(file) {
  const fd = new FormData();
  fd.append("reqtype", "fileupload");
  fd.append("fileToUpload", file, file.name || "inspiration.jpg");
  const res = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: fd
  });
  if (!res.ok) return "";
  const text = (await res.text()).trim();
  return text.indexOf("http") === 0 ? text : "";
}

async function uploadToTmpfiles(file) {
  const fd = new FormData();
  fd.append("file", file, file.name || "inspiration.jpg");
  const res = await fetch("https://tmpfiles.org/api/v1/upload", {
    method: "POST",
    body: fd
  });
  if (!res.ok) return "";
  const json = await res.json();
  const url = json && json.data && json.data.url ? json.data.url : "";
  if (!url) return "";
  // tmpfiles serves a viewer page; the direct file link is /dl/
  return url.replace("https://tmpfiles.org/", "https://tmpfiles.org/dl/");
}

async function uploadTo0x0(file) {
  const fd = new FormData();
  fd.append("file", file, file.name || "inspiration.jpg");
  const res = await fetch("https://0x0.st", {
    method: "POST",
    body: fd,
    headers: { "User-Agent": "LUNOSENSTITCHES-Website/1.0" }
  });
  if (!res.ok) return "";
  const text = (await res.text()).trim();
  return text.indexOf("http") === 0 ? text : "";
}

// Try every host in order, first success wins.
async function uploadInspirationImage(file) {
  const hosts = [
    { name: "catbox", fn: uploadToCatbox },
    { name: "tmpfiles", fn: uploadToTmpfiles },
    { name: "0x0", fn: uploadTo0x0 }
  ];

  for (const host of hosts) {
    try {
      const url = await host.fn(file);
      if (url) {
        console.log("Inspiration image uploaded via " + host.name + ": " + url);
        return url;
      }
    } catch (err) {
      console.warn("Upload failed via " + host.name + ":", err);
    }
  }

  return "";
}

// --- BOOKING FORM LISTENER ---
document.querySelector("#booking-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : "Request Appointment \u2197";

  const formData = new FormData(form);
  const name = formData.get("name") || "";
  const phone = formData.get("phone") || "";
  const email = formData.get("email") || "";
  const service = formData.get("service") || "";
  const type = formData.get("type") || "";
  const date = formData.get("date") || "";
  const time = formData.get("time") || "";
  const details = formData.get("details") || "";
  const fileInput = form.querySelector('input[name="inspiration"]');

  if (submitBtn) {
    submitBtn.innerHTML = "Preparing appointment... \u23f3";
    submitBtn.disabled = true;
  }

  let imageUrl = "";
  let imageFailed = false;

  if (fileInput && fileInput.files && fileInput.files[0]) {
    if (submitBtn) submitBtn.innerHTML = "Uploading image... \u23f3";
    try {
      imageUrl = await uploadInspirationImage(fileInput.files[0]);
      if (!imageUrl) {
        imageFailed = true;
      }
    } catch (err) {
      console.error("Image upload error:", err);
      imageFailed = true;
    }
  }

  const whatsappNumber = "2348108631176";
  let message = `Hello! I would like to request an appointment.\n\n`;
  message += `\ud83d\udc64 *Full Name:* ${name}\n`;
  message += `\ud83d\udcde *Phone:* ${phone}\n`;
  message += `\u2709\ufe0f *Email:* ${email}\n`;
  message += `\ud83e\uddf5 *Service:* ${service}\n`;
  message += `\ud83d\udccc *Appointment Type:* ${type}\n`;
  message += `\ud83d\udcc5 *Preferred Date:* ${date}\n`;
  message += `\u23f0 *Preferred Time:* ${time}\n`;

  if (String(details).trim() !== "") {
    message += `\ud83d\udcdd *Details:* ${details}\n`;
  }

  if (imageUrl !== "") {
    message += `\ud83d\uddbc\ufe0f *Inspiration Image:* ${imageUrl}\n`;
  } else if (imageFailed) {
    message += `\ud83d\uddbc\ufe0f *Inspiration Image:* (I have an image to share \u2014 will send it in this chat)\n`;
  }

  if (imageFailed) {
    showToast("Opening WhatsApp. Please attach your image in the chat \u2014 we could not upload it automatically.");
  } else {
    showToast(`Thank you${name ? `, ${name}` : ""}. Opening WhatsApp...`);
  }

  form.reset();
  const preview = form.querySelector(".file-preview");
  if (preview) preview.remove();

  if (submitBtn) {
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
  }

  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  window.location.href = whatsappURL;
});

// --- CONTACT FORM LISTENER ---
document.querySelector("#contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;

  const formData = new FormData(form);
  const name = formData.get("name") || "";
  const contact = formData.get("contact") || "";
  const service = formData.get("service") || "";
  const userMessage = formData.get("message") || "";

  const whatsappNumber = "2348108631176";
  let message = `Hello! I have a general inquiry from the website.\n\n`;
  message += `\ud83d\udc64 *Name:* ${name}\n`;
  message += `\ud83d\udcde *Contact Info:* ${contact}\n`;
  message += `\ud83d\udca1 *Category:* ${service}\n`;

  if (String(userMessage).trim() !== "") {
    message += `\ud83d\udcac *Message:* ${userMessage}\n`;
  }

  showToast(`Thank you${name ? `, ${name}` : ""}. Opening WhatsApp...`);
  form.reset();

  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  window.location.href = whatsappURL;
});

document.querySelectorAll("[data-product]").forEach((button) => {
  button.addEventListener("click", () => showToast(`${button.dataset.product} is ready to order. Connect with us to confirm size and delivery.`));
});