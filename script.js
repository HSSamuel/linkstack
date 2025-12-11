// 1. The State (Data) & LocalStorage Logic
// We try to get data from memory first. If not found, use defaults.
const defaultState = {
  name: "John Doe",
  bio: "Software Developer | Tech Enthusiast",
  image: null,
  hostedUrl: "",
  links: [
    { id: 1, title: "GitHub", url: "https://github.com" },
    { id: 2, title: "LinkedIn", url: "https://linkedin.com" },
  ],
};

// Check LocalStorage
const savedData = localStorage.getItem("linkstack-data");

// If saved data exists, parse it. Otherwise, use default.
let state = savedData ? JSON.parse(savedData) : defaultState;

// 2. Save Helper
function saveState() {
  localStorage.setItem("linkstack-data", JSON.stringify(state));
}

function renderPreview() {
  // ... existing variable declarations ...
  const previewName = document.getElementById("previewName");
  const previewBio = document.getElementById("previewBio");
  const previewLinks = document.getElementById("previewLinks");

  // NEW: Get the avatar element
  const avatar = document.querySelector(".avatar-circle");

  // Update Text
  previewName.innerText = state.name;
  previewBio.innerText = state.bio;

  // NEW: Update Image
  if (state.image) {
    avatar.style.backgroundImage = `url(${state.image})`;
  } else {
    avatar.style.backgroundImage = "none"; // Revert to grey if no image
  }

  // ... existing links loop and saveState() ...

  previewLinks.innerHTML = "";
  state.links.forEach((link) => {
    // ... (keep your existing link creation code) ...
    const linkCard = document.createElement("a");
    linkCard.className = "link-card";
    linkCard.innerText = link.title;
    linkCard.href = link.url;
    linkCard.target = "_blank";
    previewLinks.appendChild(linkCard);
  });

  saveState();
}

// 4. Render the Editor Inputs (Left Side)
function renderEditorLinks() {
  const linksContainer = document.getElementById("linksContainer");
  linksContainer.innerHTML = ""; // Clear current inputs

  state.links.forEach((link, index) => {
    const linkItem = document.createElement("div");
    linkItem.className = "link-form-item";

    // CSS Styling for the wrapper
    linkItem.style.border = "1px solid #ddd";
    linkItem.style.padding = "15px";
    linkItem.style.marginBottom = "10px";
    linkItem.style.borderRadius = "8px";
    linkItem.style.backgroundColor = "#fff";

    linkItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-weight: bold; font-size: 12px; color: #888;">LINK #${
                  index + 1
                }</span>
                <button onclick="removeLink(${
                  link.id
                })" style="color: red; background: none; border: none; cursor: pointer;">Delete</button>
            </div>
            <label style="display:block; font-size: 10px; margin-bottom:3px;">Title</label>
            <input type="text" value="${link.title}" oninput="updateLink(${
      link.id
    }, 'title', this.value)" style="width: 100%; margin-bottom: 10px; padding: 8px;">
            
            <label style="display:block; font-size: 10px; margin-bottom:3px;">URL</label>
            <input type="text" value="${link.url}" oninput="updateLink(${
      link.id
    }, 'url', this.value)" style="width: 100%; padding: 8px;">
        `;

    linksContainer.appendChild(linkItem);
  });
}

// 5. Update Link Logic
window.updateLink = function (id, field, value) {
  const linkToUpdate = state.links.find((link) => link.id === id);
  if (linkToUpdate) {
    linkToUpdate[field] = value;
  }
  renderPreview();
};

// 6. Add Link Logic
const addBtn = document.getElementById("addLinkBtn");
addBtn.addEventListener("click", () => {
  const newLink = {
    id: Date.now(),
    title: "New Link",
    url: "https://",
  };
  state.links.push(newLink);
  renderEditorLinks();
  renderPreview();
});

// 7. Remove Link Logic
window.removeLink = function (id) {
  state.links = state.links.filter((link) => link.id !== id);
  renderEditorLinks();
  renderPreview();
};

// 8. Theme Switcher (Updated for Best Fit)
window.changeTheme = function (imageUrl, textMode) {
  const phoneScreen = document.getElementById("phoneScreen");
  const profileHeader = document.querySelector(".profile-header");

  // 1. Set the Background Image
  phoneScreen.style.backgroundImage = `url(${imageUrl})`;

  // CRITICAL: "cover" ensures the image fills the whole screen (no white gaps)
  phoneScreen.style.backgroundSize = "cover";

  // CRITICAL: "center center" ensures the middle of the image is visible
  phoneScreen.style.backgroundPosition = "center center";

  // Prevent the image from repeating if it loads weirdly
  phoneScreen.style.backgroundRepeat = "no-repeat";

  // 2. Manage Text Contrast Classes
  // Remove old classes first to avoid conflicts
  phoneScreen.classList.remove("text-pop-white", "text-pop-dark");

  if (textMode === "white") {
    // Apply White Text Styles
    phoneScreen.classList.add("text-pop-white");

    // Update Links for Dark Backgrounds (Glass Effect)
    document.querySelectorAll(".link-card").forEach((link) => {
      link.style.background = "rgba(255, 255, 255, 0.15)";
      link.style.backdropFilter = "blur(10px)";
      link.style.border = "1px solid rgba(255, 255, 255, 0.3)";
      link.style.color = "white";
      link.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    });
  } else {
    // Apply Dark Text Styles
    phoneScreen.classList.add("text-pop-dark");

    // Update Links for Light Backgrounds (Solid White)
    document.querySelectorAll(".link-card").forEach((link) => {
      link.style.background = "rgba(255, 255, 255, 0.85)"; // Slightly transparent white
      link.style.backdropFilter = "blur(5px)";
      link.style.border = "1px solid #e5e7eb";
      link.style.color = "#1f2937";
      link.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
    });
  }

  // 3. Save to State
  state.themeImage = imageUrl;
  state.themeTextColor = textMode;
  saveState();
};

// --- INITIALIZATION ---
const nameField = document.getElementById("nameInput"); // Ensure IDs match HTML
const bioField = document.getElementById("bioInput");

if (nameField && bioField) {
  // Set initial values in inputs to match saved state
  nameField.value = state.name;
  bioField.value = state.bio;

  nameField.addEventListener("input", (e) => {
    state.name = e.target.value;
    renderPreview();
  });
  bioField.addEventListener("input", (e) => {
    state.bio = e.target.value;
    renderPreview();
  });
}

// Initial Render
renderEditorLinks();
renderPreview();

// Image Upload Logic
const imageInput = document.getElementById("imageInput");

if (imageInput) {
  imageInput.addEventListener("change", function (e) {
    const file = e.target.files[0]; // Get the selected file

    if (file) {
      // Check file size (Optional safety: limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too big! Please use an image under 2MB.");
        return;
      }

      const reader = new FileReader();

      // When the reader finishes processing the file...
      reader.onload = function (event) {
        // event.target.result contains the Base64 image string
        state.image = event.target.result;
        renderPreview();
      };

      // Start reading the file
      reader.readAsDataURL(file);
    }
  });
}

// 9. Export / Download Feature
window.downloadProfile = function () {
  // 1. Generate Links HTML
  const linksHTML = state.links
    .map(
      (link) => `
        <a href="${link.url}" target="_blank" class="link-card">${link.title}</a>
    `
    )
    .join("");

  // 2. Styles Setup (Glassmorphism vs Solid)
  const textClass =
    state.themeTextColor === "white" ? "text-pop-white" : "text-pop-dark";
  let linkStyles = "";

  if (state.themeTextColor === "white") {
    linkStyles = `background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);`;
  } else {
    linkStyles = `background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(5px); border: 1px solid #e5e7eb; color: #1f2937; box-shadow: 0 2px 4px rgba(0,0,0,0.05);`;
  }

  // 3. GENERATE SOCIAL SHARE LINKS (For the audience)
  // Only generate if we have a hosted URL, otherwise they are empty
  let socialShareSection = "";
  if (state.hostedUrl) {
    const u = encodeURIComponent(state.hostedUrl);
    const t = encodeURIComponent(`Connect with ${state.name}`);

    socialShareSection = `
        <div class="share-bar">
            <p>Share this profile:</p>
            <div class="icons">
                <a href="https://api.whatsapp.com/send?text=${t}%20${u}" target="_blank" style="background:#25D366">WA</a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${u}" target="_blank" style="background:#0077b5">IN</a>
                <a href="https://twitter.com/intent/tweet?url=${u}&text=${t}" target="_blank" style="background:#1da1f2">X</a>
                <a href="mailto:?subject=${t}&body=${u}" target="_blank" style="background:#ea4335">✉</a>
            </div>
        </div>
        `;
  }

  // 4. Construct the HTML
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${state.name} | Profile</title>
    <style>
        body {
            margin: 0; padding: 0; font-family: sans-serif;
            background-image: url('${state.themeImage || ""}');
            background-size: cover; background-position: center; background-attachment: fixed;
            min-height: 100vh; display: flex; justify-content: center; align-items: center;
        }
        .container {
            width: 100%; max-width: 400px; text-align: center; padding: 40px 20px;
        }
        .avatar {
            width: 100px; height: 100px; border-radius: 50%; border: 3px solid white;
            margin: 0 auto 20px; background-image: url('${state.image || ""}');
            background-size: cover; background-position: center; background-color: #ddd;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
        h1 { margin: 0; font-size: 24px; margin-bottom: 5px; }
        p.bio { margin: 0; font-size: 14px; margin-bottom: 30px; display: inline-block; padding: 5px 15px; background: rgba(0,0,0,0.2); border-radius: 20px; backdrop-filter: blur(4px); color: white; }
        
        .text-pop-white { color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
        .text-pop-dark { color: #1f2937; text-shadow: 0 1px 2px rgba(255,255,255,0.8); }

        .links { display: flex; flex-direction: column; gap: 15px; }
        .link-card {
            display: block; padding: 15px; text-decoration: none; font-weight: bold;
            border-radius: 12px; transition: transform 0.2s;
            ${linkStyles}
        }
        .link-card:hover { transform: scale(1.02); }

        /* Social Share Bar Styles */
        .share-bar { margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.3); }
        .share-bar p { font-size: 12px; opacity: 0.8; margin-bottom: 10px; color: inherit; }
        .icons { display: flex; justify-content: center; gap: 10px; }
        .icons a {
            width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
            color: white; text-decoration: none; font-size: 12px; font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="container ${textClass}">
        <div class="avatar"></div>
        <h1>${state.name}</h1>
        <p class="bio">${state.bio}</p>
        <div class="links">
            ${linksHTML}
        </div>
        
        ${socialShareSection}
    </div>
</body>
</html>
    `;

  // 5. Download
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "profile.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// =========================================
// QR CODE & SOCIAL SHARING LOGIC
// =========================================
const hostedUrlInput = document.getElementById("hostedUrlInput");
const shareContainer = document.getElementById("shareContainer");
const qrcodeContainer = document.getElementById("qrcode");
let qrCodeObject = null; // To store the QR code object

// Function to generate/update QR Code and Share Links
function updateShareSection() {
  const url = state.hostedUrl;

  // Only show section if a URL exists
  if (url && url.startsWith("http")) {
    shareContainer.style.display = "block";

    // A. Generate QR Code
    qrcodeContainer.innerHTML = ""; // Clear previous
    qrCodeObject = new QRCode(qrcodeContainer, {
      text: url,
      width: 128,
      height: 128,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    // B. Update Social Share Links
    const shareText = encodeURIComponent(`Check out my profile: ${state.name}`);
    const shareUrl = encodeURIComponent(url);

    document.getElementById(
      "shareFb"
    ).href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    document.getElementById(
      "shareTwitter"
    ).href = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
    document.getElementById(
      "shareLinkedin"
    ).href = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
    document.getElementById(
      "shareWhatsapp"
    ).href = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;
  } else {
    shareContainer.style.display = "none";
  }
}

// Listen for Input Changes
if (hostedUrlInput) {
  // Set initial value from state
  hostedUrlInput.value = state.hostedUrl || "";

  hostedUrlInput.addEventListener("input", (e) => {
    state.hostedUrl = e.target.value;
    saveState();
    updateShareSection();
  });
}

// Initial Call to set up UI based on saved state
updateShareSection();

// Function to download JUST the QR Image
window.downloadQrImage = function () {
  const img = document.querySelector("#qrcode img");
  if (img) {
    const link = document.createElement("a");
    link.href = img.src;
    link.download = `${state.name.replace(/\s+/g, "_")}_QR.png`;
    link.click();
  } else {
    alert("Please enter a URL to generate the QR code first.");
  }
};
