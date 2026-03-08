// ─── Tab Switching ───
document.querySelectorAll(".api-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".api-tab").forEach(t => t.classList.remove("active"))
    document.querySelectorAll(".api-content").forEach(c => c.classList.remove("active"))
    tab.classList.add("active")
    document.getElementById(tab.dataset.tab).classList.add("active")
  })
})

// ─── Copy Install Command ───
document.querySelectorAll(".install-cmd").forEach(el => {
  el.addEventListener("click", () => {
    navigator.clipboard.writeText("npm i api-res-kit")
    const icon = el.querySelector(".copy-icon")
    if (icon) {
      icon.textContent = "Copied!"
      setTimeout(() => { icon.textContent = "Copy" }, 2000)
    }
  })
})

// ─── Navbar scroll effect ───
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar")
  if (window.scrollY > 50) {
    nav.style.padding = "10px 0"
    nav.style.background = "rgba(15, 15, 26, 0.95)"
  } else {
    nav.style.padding = "16px 0"
    nav.style.background = "rgba(15, 15, 26, 0.85)"
  }
})

// ─── Mobile nav toggle ───
document.querySelector(".nav-toggle")?.addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("active")
})

// ─── Smooth scroll for nav links ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
      document.querySelector(".nav-links")?.classList.remove("active")
    }
  })
})
