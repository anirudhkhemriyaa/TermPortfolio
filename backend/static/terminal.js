// ===============================
// MARV TERMINAL ENGINE
// ===============================

const boot = document.getElementById("boot");
const terminal = document.getElementById("terminal");
const output = document.getElementById("output");
const input = document.getElementById("commandInput");

let history = [];
let historyIndex = -1;

// ===============================
// BOOT SEQUENCE
// ===============================

const bootSequence = [
    "Initializing MARV Interface...",
    "Loading backend modules...",
    "Establishing secure session...",
    "System ready."
];

async function typeLine(text, speed = 35) {
    for (let i = 0; i < text.length; i++) {
        boot.innerHTML += text[i];
        await new Promise(r => setTimeout(r, speed));
    }
    boot.innerHTML += "\n";
}

async function runBoot() {
    for (let line of bootSequence) {
        await typeLine(line);
        await new Promise(r => setTimeout(r, 250));
    }

    setTimeout(async () => {
        boot.classList.add("hidden");
        terminal.classList.remove("hidden");
        input.focus();

        await showWelcome();   // ← THIS MUST BE HERE
    }, 500);
}

// ===============================
// RENDER HELPERS
// ===============================

function createLine(text = "", type = "data") {
    const div = document.createElement("div");
    div.classList.add("line", `line-${type}`);
    div.innerText = text;
    output.appendChild(div);
    terminal.scrollTop = terminal.scrollHeight;
}

async function createLineSlow(text, type = "system") {
    const div = document.createElement("div");
    div.classList.add("line", `line-${type}`);
    output.appendChild(div);

    for (let i = 0; i < text.length; i++) {
        div.innerText += text[i];
        await new Promise(r => setTimeout(r, 8));
    }

    terminal.scrollTop = terminal.scrollHeight;
}

async function showWelcome() {
    await createLineSlow("MARV // COMMAND INTERFACE READY", "system");
    createLine("Type 'marv help' to view available modules.", "muted");
    createLine("");
}

// ===============================
// COMMAND ROUTER
// ===============================

async function execute(command) {

    createLine(`you@marv:~$ ${command}`, "user");

    const parts = command.trim().split(" ");

    if (parts[0] !== "marv") {
        createLine("Invalid namespace. Use 'marv help'.", "error");
        return;
    }

    if (parts[1] === "help") {
        renderHelp();
        return;
    }

    if (parts[1] === "clear") {
        output.innerHTML = "";
        await showWelcome();
        return;
    }

    if (parts[1] === "resume") {
        window.open("/Anirudha_.pdf", "_blank");
        return;
    }

    if (parts[1] === "info" && parts[2]) {
        await handleInfo(parts[2]);
        return;
    }
    if (parts[1] === "contact") {
        await handleContact();
        return;
    }

    if (parts[1] === "profiles") {
        await handleProfiles();
        return;
    }

    if (parts[1] === "system") {
        await handleSystem();
        return;
    }

    createLine("Unknown command. Use 'marv help'.", "error");
}

// ===============================
// HELP MODULE
// ===============================

function renderHelp() {
    createLine("");
    createLine("AVAILABLE MODULES", "system");
    createLine("--------------------------------------------------", "divider");
    createLine("marv info about        → Developer profile", "data");
    createLine("marv info projects     → Backend modules", "data");
    createLine("marv info skills       → Technical stack", "data");
    createLine("marv info achievements → Milestones", "data");
    createLine("marv resume            → Download CV", "data");
    createLine("marv clear             → Reset interface", "data");
    createLine("marv contact            → Contact information", "data");
    createLine("marv profiles           → GitHub / LinkedIn / LeetCode", "data");
    createLine("marv system             → Backend system status", "data");
    createLine("");
}

// ===============================
// INFO HANDLER
// ===============================

async function handleInfo(target) {
    try {
        const res = await fetch(`/api/${target}`);
        if (!res.ok) throw new Error("API request failed");

        const data = await res.json();

        createLine("");

        if (target === "about") {
            createLine("DEVELOPER PROFILE", "system");
            createLine("--------------------------------------------------", "divider");

            createLine(`Name     : ${data.identity.name}`, "data");
            createLine(`Role     : ${data.identity.role}`, "data");
            createLine(`Location : ${data.identity.location}`, "data");

            createLine("");
            createLine("SUMMARY", "muted");
            createLine(`  ${data.summary}`, "data");

            createLine("");
            createLine("ENGINEERING FOCUS", "system");
            data.engineering_profile.interests.forEach(i =>
                createLine(`  • ${i}`, "data")
            );

            createLine("");
            return;
        }

        if (target === "projects") {
            data.forEach(p => {
                const projectCard = document.createElement("div");
                projectCard.className = "project-card";

                const title = document.createElement("div");
                title.className = "project-title";
                title.innerText = p.module_name;
                projectCard.appendChild(title);

                const meta = document.createElement("div");
                meta.className = "project-meta";
                const stack = p.architecture ? Object.values(p.architecture).join(" • ") : "N/A";
                meta.innerHTML = `Type: <span class="highlight">${p.type || 'Standard'}</span> | Status: <span class="highlight">${p.status || 'Completed'}</span><br>Stack: <span class="highlight">${stack}</span>`;
                projectCard.appendChild(meta);

                if (p.problem_solved) {
                    const problemSection = document.createElement("div");
                    problemSection.className = "project-section problem-section";
                    problemSection.innerHTML = `<div class="section-title problem-title">Problem</div><div class="section-content">${p.problem_solved}</div>`;
                    projectCard.appendChild(problemSection);
                }

                if (p.engineering_decisions && p.engineering_decisions.length > 0) {
                    const engineeringSection = document.createElement("div");
                    engineeringSection.className = "project-section engineering-section";
                    let engItems = p.engineering_decisions.map(d => `<li>${d}</li>`).join("");
                    engineeringSection.innerHTML = `<div class="section-title engineering-title">Engineering</div><ul class="section-list">${engItems}</ul>`;
                    projectCard.appendChild(engineeringSection);
                }

                if (p.impact) {
                    const impactSection = document.createElement("div");
                    impactSection.className = "project-section impact-section";
                    impactSection.innerHTML = `<div class="section-title impact-title">Impact</div><div class="section-content">${p.impact}</div>`;
                    projectCard.appendChild(impactSection);
                }

                output.appendChild(projectCard);
            });
            createLine("");
            terminal.scrollTop = terminal.scrollHeight;
            return;
        }

        if (target === "skills") {
            createLine("TECHNICAL STACK", "system");
            createLine("--------------------------------------------------", "divider");

            Object.entries(data).forEach(([section, values]) => {
                createLine(section.replace("_", " ").toUpperCase(), "muted");
                values.forEach(v => createLine(`  • ${v}`, "data"));
                createLine("");
            });

            return;
        }

        if (target === "achievements") {
            createLine("TECHNICAL MILESTONES", "system");
            createLine("--------------------------------------------------", "divider");

            Object.entries(data).forEach(([key, value]) => {
                createLine(key.toUpperCase(), "muted");

                if (typeof value === "object") {
                    Object.entries(value).forEach(([k, v]) =>
                        createLine(`  • ${k.replace("_", " ")}: ${v}`, "data")
                    );
                } else {
                    createLine(`  • ${value}`, "data");
                }

                createLine("");
            });

            return;
        }

    } catch (error) {
        createLine("System error while fetching data.", "error");
    }
}


async function handleContact() {
    try {
        const res = await fetch("/api/contact");
        if (!res.ok) throw new Error();

        const data = await res.json();

        createLine("");
        createLine("CONTACT INFORMATION", "system");
        createLine("--------------------------------------------------", "divider");

        createLine(`Email       : ${data.email}`, "data");
        createLine(`Phone       : ${data.phone}`, "data");
        createLine(`Location    : ${data.location}`, "data");
        createLine(`Availability: ${data.availability}`, "data");
        createLine("");

    } catch {
        createLine("Unable to retrieve contact data.", "error");
    }
}


async function handleProfiles() {
    try {
        const res = await fetch("/api/profiles");
        if (!res.ok) throw new Error();

        const data = await res.json();

        createLine("");
        createLine("PROFESSIONAL PROFILES", "system");
        createLine("--------------------------------------------------", "divider");

        renderLink("GitHub   ", data.github);
        renderLink("LinkedIn ", data.linkedin);
        renderLink("LeetCode ", data.leetcode);

        createLine("");

    } catch {
        createLine("Unable to retrieve profile links.", "error");
    }
}

function renderLink(label, url) {
    const div = document.createElement("div");
    div.classList.add("line", "line-data");

    const text = document.createTextNode(`${label}: `);
    const link = document.createElement("a");

    link.href = url;
    link.target = "_blank";
    link.innerText = url;
    link.style.color = "#00eaff";
    link.style.textDecoration = "none";

    div.appendChild(text);
    div.appendChild(link);
    output.appendChild(div);
}


async function handleProfiles() {
    try {
        const res = await fetch("/api/profiles");
        if (!res.ok) throw new Error();

        const data = await res.json();

        createLine("");
        createLine("PROFESSIONAL PROFILES", "system");
        createLine("--------------------------------------------------", "divider");

        renderLink("GitHub   ", data.github);
        renderLink("LinkedIn ", data.linkedin);
        renderLink("LeetCode ", data.leetcode);

        createLine("");

    } catch {
        createLine("Unable to retrieve profile links.", "error");
    }
}

function renderLink(label, url) {
    const div = document.createElement("div");
    div.classList.add("line", "line-data");

    const text = document.createTextNode(`${label}: `);
    const link = document.createElement("a");

    link.href = url;
    link.target = "_blank";
    link.innerText = url;
    link.style.color = "#00eaff";
    link.style.textDecoration = "none";

    div.appendChild(text);
    div.appendChild(link);
    output.appendChild(div);
}



async function handleSystem() {
    try {
        const res = await fetch("/api/system");
        if (!res.ok) throw new Error();

        const data = await res.json();

        createLine("");
        createLine("SYSTEM STATUS", "system");
        createLine("--------------------------------------------------", "divider");

        createLine(`Status      : ${data.status}`, "data");
        createLine(`Uptime (s)  : ${data.uptime_seconds}`, "data");
        createLine(`Server Time : ${data.server_time}`, "data");
        createLine(`Framework   : ${data.framework}`, "data");
        createLine("");

    } catch {
        createLine("System status unavailable.", "error");
    }
}

// ===============================
// INPUT HANDLING
// ===============================

input.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {
        const command = input.value.trim();
        if (!command) return;

        history.push(command);
        historyIndex = history.length;

        input.value = "";
        execute(command);
    }

    if (e.key === "ArrowUp") {
        if (historyIndex > 0) {
            historyIndex--;
            input.value = history[historyIndex];
        }
    }

    if (e.key === "ArrowDown") {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            input.value = history[historyIndex];
        } else {
            input.value = "";
        }
    }
});

// ===============================
// START
// ===============================

runBoot();